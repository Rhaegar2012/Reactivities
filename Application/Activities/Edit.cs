using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using Domain;
using MediatR;
using Persistence;
using Application.Core;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity {get; set;}
        }

        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x=> x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler: IRequestHandler<Command,Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler (DataContext context,IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
            {
                
                var activity = await _context.Activities.FindAsync(request.Activity.Id);
                if(activity == null)
                {
                    return null;
                }
                _mapper.Map(request.Activity,activity);
                var result = await _context.SaveChangesAsync()>0;

                if(!result)
                {
                    return Result<Unit>.Failure("Failed to update activity");
                }

                return Result<Unit>.Success(Unit.Value);
                
                
            }
        }
    }
}