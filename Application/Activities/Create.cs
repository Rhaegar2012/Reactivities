using System.Threading;
using System.Threading.Tasks;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Persistence;
using Application.Interfaces;
using Microsoft.VisualBasic;
namespace Application.Activities
{
    public class Create
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Activity Activity {get;set;}

        }

        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=> x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler: IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly Application.Interfaces.IUserAccessor _userAccesor;
            public Handler(DataContext context, Application.Interfaces.IUserAccessor userAccesor)
            {
                _context = context;
                _userAccesor = userAccesor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == _userAccesor.GetUserName()); 
                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost=true
                } ;
                request.Activity.Attendees.Add(attendee);   
                 _context.Activities.Add(request.Activity);
                 var result = await _context.SaveChangesAsync()>0;
                 if(!result)
                 {
                    return Result<Unit>.Failure("Failed to create activity");
                 }
                 return Result<Unit>.Success(Unit.Value);

            }
        }
    }

    public interface IUserAccesor
    {
    }

}