using System;
using Domain;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Comments;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string TargetUsername{get;set;}

        }

        public class Handler:IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;

            }

#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            public async Task<Result<Unit>?> Handle(Command request , CancellationToken cancellationToken)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            {
                var observer = await _context.Users.FirstOrDefaultAsync(x=>x.UserName==_userAccessor.GetUserName());

                var target = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == request.TargetUsername);

                if(target == null)
                {
                    return null;
                }

                var following = await _context.UserFollowings.FindAsync(observer.Id,target.Id);
                if(following == null)
                {
                    following = new UserFollowing
                    {
                        Observer =observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(following);
                }
                else
                {
                  _context.UserFollowings.Remove(following);  

                }

                var success = await _context.SaveChangesAsync()>0;
                if(success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}