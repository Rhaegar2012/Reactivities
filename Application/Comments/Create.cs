using System;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command:IRequest<Result<CommentDTO>>
        {
            public string Body {get;set;}
            public Guid ActivityId{get;set;}
        }

        public class CommandValidator:AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=>x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDTO>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor =userAccessor;
            }
#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            public async Task<Result<CommentDTO>?> Handle(Command request, CancellationToken cancellationToken)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if(activity == null)
                {
                    return null;
                }
                var user = await _context.Users
                            .Include(p=>p.Photos)
                            .SingleOrDefaultAsync(x=>x.UserName == _userAccessor.GetUserName());
                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body
                };

                activity.Comments.Add(comment);

                var success = await _context.SaveChangesAsync()>0;
                if(success) return Result<CommentDTO>.Success(_mapper.Map<CommentDTO>(comment));
                return Result<CommentDTO>.Failure("Failed to add comment");
            }
        }
    }
}