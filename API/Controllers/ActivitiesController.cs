using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using MediatR;
using Domain;

namespace API.Controllers
{
    public class ActivitiesController:BaseAPIController
    {
        
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query{Id=id});
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
            await Mediator.Send(new Edit.Command{Activity = activity});
            return Ok();
        }
    }
}