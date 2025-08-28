
using Fintcs.Api.DTOs;

namespace Fintcs.Api.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetUsersAsync(string? societyId = null, string? role = null);
        Task<UserDto?> GetUserByIdAsync(string id);
        Task<UserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserDto> UpdateUserAsync(string id, UpdateUserDto updateUserDto);
        Task DeleteUserAsync(string id);
    }
}
