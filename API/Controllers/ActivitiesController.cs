using Microsoft.AspNetCore.Mvc;
using Application.Activities;
using MediatR;
using Domain;

namespace API.Controllers
{
    public class ActivitiesController:BaseAPIController
    {
        
        private readonly IMediator _mediator;
        public ActivitiesController(IMediator mediator )
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await _mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return  Ok();
        }
    }
}