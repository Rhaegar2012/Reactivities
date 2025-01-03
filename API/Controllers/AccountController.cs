using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Domain;
using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager,TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;

        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login (LoginDTO loginDTO)
        {
            var user = await _userManager.Users.Include(p=>p.Photos)
                            .FirstOrDefaultAsync(x=>x.Email==loginDTO.Email);
            if(user ==null)
            {
                return Unauthorized();
            }
            var result = await _userManager.CheckPasswordAsync(user,loginDTO.Password);
            if(result)
            {
                return new UserDTO
                {
                    DisplayName = user.DisplayName,
                    Image = null,
                    Token = _tokenService.CreateToken(user),
                    Username=user.UserName
                };
            }
            return Unauthorized();
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if(await _userManager.Users.AnyAsync(x=>x.Email == registerDTO.Email))
            {
                ModelState.AddModelError("email","Email taken");
                return BadRequest(ModelState);
            }
            if(await _userManager.Users.AnyAsync(x=>x.UserName == registerDTO.UserName))
            {
                ModelState.AddModelError("username","Username taken");
                return BadRequest(ModelState);
            }

            var user = new AppUser
            {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                UserName = registerDTO.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDTO.Password);

            if(result.Succeeded)
            {
                return new UserDTO
                {
                    DisplayName = user.DisplayName,
                    Image = null,
                    Token = _tokenService.CreateToken(user),
                    Username = user.UserName
                };
            }
            return BadRequest(result.Errors);
        }

      


        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x=>x.Email == User.FindFirstValue(ClaimTypes.Email));
            UserDTO userDTO = CreateUserObject(user);
            return userDTO;

        }

        private UserDTO CreateUserObject(AppUser user)
        {
            return new UserDTO
                {
                    DisplayName = user.DisplayName,
                    Image = user?.Photos?.FirstOrDefault(x=>x.IsMain)?.Url,
                    Token = _tokenService.CreateToken(user),
                    Username = user.UserName
                };
        }


    }
}