
using Fintcs.Api.DTOs;

namespace Fintcs.Api.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(string username, string password);
        string GenerateJwtToken(UserDto user);
        bool ValidatePassword(string password, string hash);
        string HashPassword(string password);
    }
}
