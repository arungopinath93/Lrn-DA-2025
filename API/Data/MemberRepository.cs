using System;
using API.Entities;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members.Include(x => x.User).SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        // return await context.Members.Include(x=>x.Photos).ToListAsync();
        return await context.Members.ToListAsync();
    }

    public async Task<Member?> GetMembersByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public Task<IReadOnlyList<Photo>> GetPhotosOfMembersAsync<TResult>(string memberId)
    {
        return context.Members.Where(x => x.Id == memberId)
            .SelectMany(x => x.Photos)
            .ToListAsync()
            .ContinueWith(task => (IReadOnlyList<Photo>)task.Result); 
    }

    public async Task<bool> SaveAllAsync()
    {
        try
        {
            return await context.SaveChangesAsync() > 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred during the delay: {ex.Message}");
            return false;
        }
        
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}
