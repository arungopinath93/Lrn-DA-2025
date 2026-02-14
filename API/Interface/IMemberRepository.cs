using System;
using API.Entities;
using API.Helpers;

namespace API.Interface;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<PaginatedResult<Member?>> GetMembersAsync(PagingParams pagingParams);
    Task<Member?> GetMembersByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosOfMembersAsync<TResult>(string memberId);
    Task<Member?> GetMemberForUpdate(string id);
}
