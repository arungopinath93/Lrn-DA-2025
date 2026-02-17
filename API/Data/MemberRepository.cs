using System;
using API.Entities;
using API.Helpers;
using API.Interface;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members.Include(x => x.User).Include(x => x.Photos).SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members.AsQueryable();
        query = query.Where(x => x.Id != memberParams.CurrentMemberId);
        if (!string.IsNullOrEmpty(memberParams.Gender))
            query = query.Where(x => x.Gender == memberParams.Gender);
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1)) ;
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));
        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PaginationHelper.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
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
