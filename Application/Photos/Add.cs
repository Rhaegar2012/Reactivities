using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command:IRequest<Result<Photo>>
        {
            public IFormFile File {get;set;}
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor , Application.Interfaces.IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;

            }
#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            public async Task<Result<Photo>?> Handle(Command request, CancellationToken cancellationToken)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            {
                var user = await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUserName());
                if(user == null)
                {
                    return null;
                }

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);
                var photo = new Photo
                {
                    Url=photoUploadResult.Url,
                    Id = photoUploadResult.PublicId,
                };

                if(!user.Photos.Any(x=>x.IsMain))
                {
                    photo.IsMain = true;
                }
                user.Photos.Add(photo);
                var result = await _context.SaveChangesAsync()>0;
                if(result)
                {
                   return Result<Photo>.Success(photo);
                }
                return Result<Photo>.Failure("Problem adding photo");
            }
        }
    }
}