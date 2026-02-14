using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController(AppDbContext context,ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(EmailExists(registerDto.Email).Result)
            {
                return BadRequest("Email already exists");
            }
            // Registration logic here
            var hmac = new HMACSHA512();

            var user = new AppUser
            {
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    DisplayName = registerDto.DisplayName,
                    City = registerDto.City,
                    Country = registerDto.Country,
                    Gender = registerDto.Gender,
                    ImageUrl = "https://res.cloudinary.com/dyriolrju/image/upload/v1767170886/296fe121-5dfa-43f4-98b5-db50019738a7_rv9i7m.jpg",
                    DateOfBirth = registerDto.DateOfBirth,
                }
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Ok(user.UserDto(tokenService));
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Email.ToLower() == loginDto.Email.ToLower());
            if (user == null) return Unauthorized("Invalid User Cerdentials");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid User Cerdentials");
            }
            //     var userDto =  new UserDto
            //     {
            //         Id = user.Id,
            //         DisplayName = user.DisplayName,
            //         Email = user.Email,
            //         Token = tokenService.CreateToken(user),
            //     };
            // return Ok(userDto);
            return Ok(user.UserDto(tokenService));
        }

        [HttpGet("update/imageUrl/{id}")]
        public async Task<ActionResult> Update(string id, [FromQuery] string ImageUrl)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Id == id);
            if (user == null) return NotFound("User not found");

          
            user.ImageUrl = ImageUrl;

            context.Users.Update(user);
            await context.SaveChangesAsync();

            return Ok("ImageUrl updated successfully");
        }
        private async Task<bool> EmailExists(string email)
        {
            return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
    }
}
