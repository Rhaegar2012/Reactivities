using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using SQLitePCL;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using System.Linq;



namespace Application.Activities
{
    public class List
    {
        public class Query: IRequest<Result<PagedList<ActivityDTO>>>
        {
            public ActivityParams Params {get;set;}
        }
        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            private readonly Application.Interfaces.IUserAccessor _userAccessor;
            public Handler(DataContext context, ILogger<List> logger, IMapper mapper,Application.Interfaces.IUserAccessor userAccesor)
            {
                _context = context;
                _logger  = logger;
                _mapper = mapper;
                _userAccessor = userAccesor;
            }
            public async Task<Result<PagedList<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                
                var query =  _context.Activities
                                .Where(d => d.Date>= request.Params.StartDate)
                                .OrderBy(d => d.Date)
                                .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider,new {currentUserName = _userAccessor.GetUserName() })
                                .AsQueryable();
                if(request.Params.IsGoing && !request.Params.IsHost)
                {
                    query=query.Where(x=>x.Attendees.Any(a=>a.Username == _userAccessor.GetUserName()));
                }

                if(request.Params.IsHost && request.Params.IsGoing)
                {
                    query=query.Where(x=>x.HostUsername==_userAccessor.GetUserName());
                }


                return Result<PagedList<ActivityDTO>>.Success(
                    await PagedList<ActivityDTO>.CreateAsync(query,request.Params.PageNumber,request.Params.PageSize)
                );
            }

            

        }
    }
}