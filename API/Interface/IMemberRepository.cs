using System;
using API.Entities;

namespace API.Interface;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<Member> GetMembersByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosOfMembersAsync<TResult>(string memberId);
}
