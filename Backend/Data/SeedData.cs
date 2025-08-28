
using Microsoft.EntityFrameworkCore;
using Fintcs.Api.Models;
using BCrypt.Net;

namespace Fintcs.Api.Data
{
    public class SeedData
    {
        private readonly FintcsDbContext _context;

        public SeedData(FintcsDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Check if super admin exists
            var existingAdmin = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == "admin");

            if (existingAdmin == null)
            {
                // Create super admin
                var superAdmin = new User
                {
                    Id = Guid.NewGuid(),
                    Username = "admin",
                    Email = "admin@fintcs.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "SuperAdmin",
                    Name = "Super Administrator",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Users.Add(superAdmin);
                await _context.SaveChangesAsync();
                Console.WriteLine("Super admin created successfully");
            }

            // Create default society if none exists
            var existingSociety = await _context.Societies.FirstOrDefaultAsync();
            if (existingSociety == null)
            {
                var defaultSociety = new Society
                {
                    Id = Guid.NewGuid(),
                    Name = "Default Society",
                    Code = "DEF001",
                    Address = "Default Address",
                    ContactPerson = "Admin",
                    Phone = "1234567890",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Societies.Add(defaultSociety);
                await _context.SaveChangesAsync();
                Console.WriteLine("Default society created successfully");
            }
        }
    }
}
