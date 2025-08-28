
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Fintcs.Api.Services;
using Fintcs.Api.DTOs;

namespace Fintcs.Api.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : BaseController
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] string? societyId = null, [FromQuery] string? role = null)
        {
            try
            {
                if (!HasAccess("SuperAdmin", "SocietyAdmin"))
                {
                    return Forbid("Insufficient permissions");
                }

                // Society admins can only see users in their society
                if (IsSocietyAdmin())
                {
                    societyId = GetCurrentUserSocietyId();
                }

                var users = await _userService.GetUsersAsync(societyId, role);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving users", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            try
            {
                if (!HasAccess("SuperAdmin", "SocietyAdmin"))
                {
                    return Forbid("Insufficient permissions");
                }

                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }

                // Society admins can only see users in their society
                if (IsSocietyAdmin() && user.SocietyId?.ToString() != GetCurrentUserSocietyId())
                {
                    return Forbid("Cannot access user from different society");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving user", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                if (!HasAccess("SuperAdmin", "SocietyAdmin"))
                {
                    return Forbid("Insufficient permissions");
                }

                // Society admins can only create users for their society
                if (IsSocietyAdmin())
                {
                    createUserDto.SocietyId = GetCurrentUserSocietyId();
                    
                    // Society admins cannot create SuperAdmin or SocietyAdmin users
                    if (createUserDto.Role == "SuperAdmin" || createUserDto.Role == "SocietyAdmin")
                    {
                        return Forbid("Cannot create admin users");
                    }
                }

                var user = await _userService.CreateUserAsync(createUserDto);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating user", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                if (!HasAccess("SuperAdmin", "SocietyAdmin"))
                {
                    return Forbid("Insufficient permissions");
                }

                var existingUser = await _userService.GetUserByIdAsync(id);
                if (existingUser == null)
                {
                    return NotFound();
                }

                // Society admins can only update users in their society
                if (IsSocietyAdmin() && existingUser.SocietyId?.ToString() != GetCurrentUserSocietyId())
                {
                    return Forbid("Cannot update user from different society");
                }

                var user = await _userService.UpdateUserAsync(id, updateUserDto);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating user", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                if (!IsSuperAdmin())
                {
                    return Forbid("Only SuperAdmin can delete users");
                }

                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting user", error = ex.Message });
            }
        }
    }
}
