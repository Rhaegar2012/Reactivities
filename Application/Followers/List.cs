using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Application.Profiles;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Profile= Application.Profiles.Profile;

namespace Application.Followers
{
    public class List
    {
        public class Query: IRequest<Result<List<Profile>>>
        {
            public string Predicate {get;set;}
            public string Username {get;set;}
        
        }

        public class Handler:IRequestHandler<Query,Result<List<Profile>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context,IMapper mapper )
            {
                _mapper = mapper;
                _context = context; 

            }

            public async Task<Result<List<Profile>>>Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();
                switch(request.Predicate)
                {
                    case "followers":
                        profiles = await _context.UserFollowings.Where(x=> x.Target.UserName == request.Username)
                                                                .Select(u=>u.Observer)
                                                                .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider)
                                                                .ToListAsync();
                                                                break;
                     case "following":
                        profiles = await _context.UserFollowings.Where(x=> x.Observer.UserName == request.Username)
                                                                .Select(u=>u.Target)
                                                                .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider)
                                                                .ToListAsync();
                                                                break;
                    
                }

                return Result<List<Profile>>.Success(profiles);
            }
        }
    }
}