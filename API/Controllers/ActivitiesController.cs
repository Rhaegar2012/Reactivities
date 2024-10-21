using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using MediatR;
using Domain;
using System.Reflection.Metadata;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    
    public class ActivitiesController:BaseAPIController
    {
        
        [HttpGet]
        public async Task<IActionResult> GetActivities(CancellationToken ct)
        {
            return HandleResult(await Mediator.Send(new List.Query(),ct));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id)
        {
            var result = await Mediator.Send(new Details.Query{Id=id});
            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            await Mediator.Send(new Create.Command{Activity = activity});
            return Ok();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id =id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity = activity}));
            
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command {Id = id}));
        }
    }
}