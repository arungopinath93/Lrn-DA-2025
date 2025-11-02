using System;
using API.DTO;
using API.Entities;
using API.Interface;

namespace API.Extensions;

public static class AppUserExtensions
{
    public static UserDto UserDto(this AppUser user,ITokenService tokenService)
    {
       return new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email,
                ImageUrl = user.ImageUrl,
                Token = tokenService.CreateToken(user),
            };
    }   
}
