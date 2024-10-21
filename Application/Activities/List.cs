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

namespace Application.Activities
{
    public class List
    {
        public class Query: IRequest<Result<List<ActivityDTO>>>{}
        public class Handler : IRequestHandler<Query, Result<List<ActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
            {
                _context = context;
                _logger  = logger;
                _mapper = mapper;
            }
            public async Task<Result<List<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                
                var activities = await _context.Activities
                                .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider)
                                .ToListAsync(cancellationToken);

                return Result<List<ActivityDTO>>.Success(activities);
            }

            

        }
    }
}