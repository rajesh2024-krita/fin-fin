
using Microsoft.EntityFrameworkCore;
using Fintcs.Api.Data;
using Fintcs.Api.Models;
using Fintcs.Api.DTOs;
using BCrypt.Net;

namespace Fintcs.Api.Services
{
    public class UserService : IUserService
    {
        private readonly FintcsDbContext _context;

        public UserService(FintcsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetUsersAsync(string? societyId = null, string? role = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(societyId))
            {
                if (Guid.TryParse(societyId, out var societyGuid))
                {
                    query = query.Where(u => u.SocietyId == societyGuid);
                }
            }

            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(u => u.Role == role);
            }

            var users = await query
                .Where(u => u.IsActive)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Name = u.Name,
                    Role = u.Role,
                    EdpNo = u.EdpNo,
                    SocietyId = u.SocietyId,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return users;
        }

        public async Task<UserDto?> GetUserByIdAsync(string id)
        {
            if (!Guid.TryParse(id, out var userId))
                return null;

            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Name = u.Name,
                    Role = u.Role,
                    EdpNo = u.EdpNo,
                    AddressOffice = u.AddressOffice,
                    AddressResidence = u.AddressResidence,
                    Designation = u.Designation,
                    PhoneOffice = u.PhoneOffice,
                    PhoneResidence = u.PhoneResidence,
                    Mobile = u.Mobile,
                    SocietyId = u.SocietyId,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            // Check if username already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == createUserDto.Username);

            if (existingUser != null)
            {
                throw new InvalidOperationException("Username already exists");
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                Role = createUserDto.Role,
                EdpNo = createUserDto.EdpNo,
                Name = createUserDto.Name,
                AddressOffice = createUserDto.AddressOffice,
                AddressResidence = createUserDto.AddressResidence,
                Designation = createUserDto.Designation,
                PhoneOffice = createUserDto.PhoneOffice,
                PhoneResidence = createUserDto.PhoneResidence,
                Mobile = createUserDto.Mobile,
                SocietyId = string.IsNullOrEmpty(createUserDto.SocietyId) ? null : Guid.Parse(createUserDto.SocietyId),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                EdpNo = user.EdpNo,
                SocietyId = user.SocietyId,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto> UpdateUserAsync(string id, UpdateUserDto updateUserDto)
        {
            if (!Guid.TryParse(id, out var userId))
                throw new ArgumentException("Invalid user ID");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            // Update fields if provided
            if (!string.IsNullOrEmpty(updateUserDto.Email))
                user.Email = updateUserDto.Email;
            
            if (!string.IsNullOrEmpty(updateUserDto.Role))
                user.Role = updateUserDto.Role;
            
            if (!string.IsNullOrEmpty(updateUserDto.EdpNo))
                user.EdpNo = updateUserDto.EdpNo;
            
            if (!string.IsNullOrEmpty(updateUserDto.Name))
                user.Name = updateUserDto.Name;
            
            if (updateUserDto.AddressOffice != null)
                user.AddressOffice = updateUserDto.AddressOffice;
            
            if (updateUserDto.AddressResidence != null)
                user.AddressResidence = updateUserDto.AddressResidence;
            
            if (!string.IsNullOrEmpty(updateUserDto.Designation))
                user.Designation = updateUserDto.Designation;
            
            if (!string.IsNullOrEmpty(updateUserDto.PhoneOffice))
                user.PhoneOffice = updateUserDto.PhoneOffice;
            
            if (!string.IsNullOrEmpty(updateUserDto.PhoneResidence))
                user.PhoneResidence = updateUserDto.PhoneResidence;
            
            if (!string.IsNullOrEmpty(updateUserDto.Mobile))
                user.Mobile = updateUserDto.Mobile;
            
            if (updateUserDto.IsActive.HasValue)
                user.IsActive = updateUserDto.IsActive.Value;

            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                EdpNo = user.EdpNo,
                SocietyId = user.SocietyId,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task DeleteUserAsync(string id)
        {
            if (!Guid.TryParse(id, out var userId))
                throw new ArgumentException("Invalid user ID");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found");

            // Soft delete
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
        }
    }
}
