using System.Security.Cryptography;
using System.Text.Json;
using API.DTO;
using API.Entities;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
        if (context.Users.Any()) return;

        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData, options);

        if (members == null) return;

        using var hmac = new HMACSHA512();
        foreach (var member in members)
        {

            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email.ToLower(),
                DisplayName = member.DisplayName,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = member.Id,
                    Description = member.Description,
                    DateOfBirth = member.DateOfBirth,
                    ImageUrl = member.ImageUrl,
                    Created = member.Created,
                    LastActive = member.LastActive,
                    City = member.City,
                    Country = member.Country,
                    Gender = member.Gender,
                    DisplayName = member.DisplayName
                }
            };
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl,
                MemberId = member.Id,
                PublicId = "PublicId"
            });
            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }
}
