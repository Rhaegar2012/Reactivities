using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration.UserSecrets;
using Persistence;
namespace Infrastructure.Security
{
    public class IsHostRequirement: IAuthorizationRequirement
    {
        
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {

        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccesor;
        public IsHostRequirementHandler(DataContext context,IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccesor = httpContextAccessor;
            _dbContext = context;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null)
            {
                return Task.CompletedTask;
            }
            var activityId= Guid.Parse(_httpContextAccesor.HttpContext?.Request.RouteValues.SingleOrDefault(x=>x.Key =="id").Value?.ToString());
            var attendee = _dbContext.ActivityAttendees.FindAsync(userId,activityId).Result;
            if(attendee == null)
            {
                return Task.CompletedTask;
            }
            if(attendee.IsHost)
            {
                context.Succeed(requirement);
                
            }
            return Task.CompletedTask;
        }
    }
}