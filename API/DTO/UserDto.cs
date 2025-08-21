using System;

namespace API.DTO;

public class UserDto
{
    public string Id { get; set; }
    public required string? DisplayName { get; set; }
    public required string? Email { get; set; }
    public string? Token { get; set; }
    public string? ImageUrl { get; set; }
}
