using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query: IRequest<Result<List<UserActivityDTO>>>
        {
            public string Username {get;set;}
            public string Predicate {get;set;}

        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDTO>>>
        {
           private readonly DataContext _context;
           private readonly IMapper _mapper;
           public Handler(DataContext context, IMapper mapper)
           {
                _context = context;
                _mapper = mapper;
           }

            async Task<Result<List<UserActivityDTO>>> IRequestHandler<Query, Result<List<UserActivityDTO>>>.Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                            .Where(u => u.AppUser.UserName == request.Username)
                            .OrderBy(a=>a.Activity.Date)
                            .ProjectTo<UserActivityDTO>(_mapper.ConfigurationProvider)
                            .AsQueryable();
                query= request.Predicate switch
                {
                    "past"=>query.Where(a=>a.Date<=DateTime.Now),
                    "hosting"=>query.Where(a=>a.HostUserName==request.Username),
                    _=>query.Where(a=>a.Date>=DateTime.Now)
                };

                var activities = await query.ToListAsync();
                return Result<List<UserActivityDTO>>.Success(activities);


            }
        }
    }
}