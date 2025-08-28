
using Fintcs.Api.Models;
using BCrypt.Net;

namespace Fintcs.Api.Data
{
    public static class SeedData
    {
        public static async Task Initialize(FintcsDbContext context)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if super admin already exists
            if (context.Users.Any(u => u.Username == "admin"))
            {
                return; // DB has been seeded
            }

            // Create super admin
            var superAdmin = new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                Name = "Super Administrator",
                Role = "SuperAdmin",
                Email = "admin@fintcs.com",
                IsActive = true
            };

            context.Users.Add(superAdmin);

            // Seed lookup data
            var loanTypes = new List<LoanType>
            {
                new() { Name = "Personal Loan", IsActive = true },
                new() { Name = "Home Loan", IsActive = true },
                new() { Name = "Vehicle Loan", IsActive = true },
                new() { Name = "Emergency Loan", IsActive = true },
                new() { Name = "Education Loan", IsActive = true }
            };

            context.LoanTypes.AddRange(loanTypes);

            var banks = new List<Bank>
            {
                new() { Name = "State Bank of India", IsActive = true },
                new() { Name = "HDFC Bank", IsActive = true },
                new() { Name = "ICICI Bank", IsActive = true },
                new() { Name = "Punjab National Bank", IsActive = true },
                new() { Name = "Bank of Baroda", IsActive = true }
            };

            context.Banks.AddRange(banks);

            var voucherTypes = new List<VoucherType>
            {
                new() { Name = "Receipt Voucher", IsActive = true },
                new() { Name = "Payment Voucher", IsActive = true },
                new() { Name = "Journal Voucher", IsActive = true },
                new() { Name = "Contra Voucher", IsActive = true }
            };

            context.VoucherTypes.AddRange(voucherTypes);

            await context.SaveChangesAsync();
        }
    }
}
