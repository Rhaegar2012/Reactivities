using System.Collections.Generic;
using Application.Activities;
using MediatR;
using Application.Core;
using System;
using System.Threading;
using Persistence;
using AutoMapper;
using System.Threading.Tasks;
using System.Linq;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace Application.Comments
{
    public class List
    {
        public class Query: IRequest<Result<List<CommentDTO>>>
        {
            public Guid ActivityId { get; set; }   


        }

        public class Handler : IRequestHandler<Query, Result<List<CommentDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;


            public  Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context=context;

            }

            public async Task<Result<List<CommentDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _context.Comments
                                             .Where(x=>x.Activity.Id==request.ActivityId)
                                             .OrderByDescending(x=>x.CreatedAt)
                                             .ProjectTo<CommentDTO>(_mapper.ConfigurationProvider)
                                             .ToListAsync();

                return Result<List<CommentDTO>>.Success(comments);
            }
        }
    }
}