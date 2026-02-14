using System.Security.Claims;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class MembersController(
        IMemberRepository memberRepository,
        IPhotoService photoService) : BaseApiController
    {

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers([FromQuery] PagingParams pagingParams)
        {
            var result = await memberRepository.GetMembersAsync(pagingParams);
            return Ok(result);
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

        [Authorize]
        [HttpPost("add-photos")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Could not find user");
            var result = await photoService.UploadPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };
            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }
            member.Photos.Add(photo);
            var isSaved = await memberRepository.SaveAllAsync();
            if (isSaved)
            {
                return CreatedAtAction(
                    nameof(GetMember),
                    new { id = member.Id },
                    photo);
            }
            else
            {
                return BadRequest("Problem adding photo");
            }
        }

        [Authorize]
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Could not find user");
            var photo = member.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null) return BadRequest("Could not find photo");
            if (photo.Url == member.ImageUrl) return BadRequest("This is already the main photo");

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
            var isSaved = await memberRepository.SaveAllAsync();
            if (isSaved) return NoContent();
            return BadRequest("Failed to set main photo");
        }

        [Authorize]
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Could not find user");
            var photo = member.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null) return BadRequest("Could not find photo");
            if (photo.Url == member.ImageUrl) return BadRequest("You cannot delete your main photo");

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            member.Photos.Remove(photo);
            var isSaved = await memberRepository.SaveAllAsync();
            if (isSaved) return Ok();
            return BadRequest("Failed to delete photo");
        }
    }
}