using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command:IRequest<Result<Unit>>
        {
            public string Id {get;set;}
        }

        public class Handler:IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly Application.Interfaces.IUserAccessor _userAccesor;
            public Handler(DataContext context , Application.Interfaces.IUserAccessor userAccessor)
            {
                _context=context;
                _userAccesor=userAccessor;  

            }
#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            public async Task<Result<Unit>?> Handle (Command request, CancellationToken cancellationToken)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            {
                var user = await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x=>x.UserName ==_userAccesor.GetUserName());

                if(user == null)
                {
                    return null;
                }
                var photo = user.Photos.FirstOrDefault(x=>x.Id == request.Id);
                if(photo == null)
                {
                    return null;
                }
                var currentMain = user.Photos.FirstOrDefault(x=>x.IsMain);
                if(currentMain != null)
                {
                    currentMain.IsMain = false;
                }
                photo.IsMain = true;
                var success = await _context.SaveChangesAsync()>0;
                if(success)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Problem setting main photo");


            }
        }
    }
}