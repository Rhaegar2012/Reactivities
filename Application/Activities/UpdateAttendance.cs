using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id{get;set;}
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context , Application.Interfaces.IUserAccessor userAccessor)
            {
                _context=context;
                _userAccessor=userAccessor;
            }
#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            {
                var activity = await _context.Activities
                                .Include(a=>a.Attendees).ThenInclude(u=>u.AppUser)
                                .SingleOrDefaultAsync(x=>x.Id ==request.Id); 
                if(activity == null) return null;
                var user = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUserName());
                if(user == null) return null;
                var hostUsername = activity.Attendees.FirstOrDefault(x=>x.IsHost)?.AppUser?.UserName;
                var attendance = activity.Attendees.FirstOrDefault(x=> x.AppUser.UserName == user.UserName);
                if(attendance != null && hostUsername == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }
                if(attendance !=null && hostUsername != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }
                if(attendance == null)
                {
                    attendance = new Domain.ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync()>0;
                return result? Result<Unit>.Success(Unit.Value): Result<Unit>.Failure ("Problem updating attendance");


            }

        }
    }
}