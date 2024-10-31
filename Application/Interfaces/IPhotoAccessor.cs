using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Application.Photos;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        Task<PhotoUploadResults> AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }

   
}