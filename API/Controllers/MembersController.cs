using System.Security.Claims;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class MembersController(IMemberRepository memberRepository) : BaseApiController
    {

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            var members = await memberRepository.GetMembersAsync();
            return Ok(members);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member = await memberRepository.GetMembersByIdAsync(id);
            if (member == null)
            {
                return NotFound();
            }
            return Ok(member);
        }

        [Authorize]
        [HttpGet("{memberId}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotosOfMember(string memberId)
        {
            var photos = await memberRepository.GetPhotosOfMembersAsync<Photo>(memberId);
            return Ok(photos);
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            // var memberId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            // if (memberId == null) return BadRequest("Oops - no user id found");
            //repalce this with extension method
            var memberId = User.GetMemberId();
            // var member = await memberRepository.GetMembersByIdAsync(memberId);
            var member = await memberRepository.GetMemberForUpdate(memberId);
            if (memberId == null) return BadRequest("Could not find user");
           

            // Map the updated fields from DTO to the user entity
            if (memberUpdateDto.DisplayName != null)
                member.DisplayName = memberUpdateDto.DisplayName;
            if (memberUpdateDto.Description != null)
                member.Description = memberUpdateDto.Description;
            if (memberUpdateDto.City != null)
                member.City = memberUpdateDto.City;
            if (memberUpdateDto.Country != null)
                member.Country = memberUpdateDto.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;
            // memberRepository.Update(member); //OPTIONAL NOT NEEDED IF PREVENT UPDATE IF NO CHANGES
            var isSaved = await memberRepository.SaveAllAsync();
            if (isSaved) return NoContent();

            return BadRequest("Failed to update member");
        }
    }
}
