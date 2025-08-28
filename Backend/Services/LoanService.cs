
using Microsoft.EntityFrameworkCore;
using Fintcs.Api.Data;
using Fintcs.Api.Models;

namespace Fintcs.Api.Services
{
    public class LoanService : ILoanService
    {
        private readonly FintcsDbContext _context;

        public LoanService(FintcsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Loan>> GetAllAsync()
        {
            return await _context.Loans.ToListAsync();
        }

        public async Task<Loan?> GetByIdAsync(Guid id)
        {
            return await _context.Loans.FindAsync(id);
        }

        public async Task<Loan> CreateAsync(Loan loan)
        {
            // Auto-generate loan number
            var lastLoan = await _context.Loans
                .OrderByDescending(l => l.CreatedAt)
                .FirstOrDefaultAsync();

            var nextNumber = 1;
            if (lastLoan != null && lastLoan.LoanNo.StartsWith("LN"))
            {
                if (int.TryParse(lastLoan.LoanNo.Substring(2), out var lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            loan.LoanNo = $"LN{nextNumber:D6}";
            loan.NetLoan = loan.LoanAmount - loan.PreviousLoan;
            
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            return loan;
        }

        public async Task<Loan?> UpdateAsync(Guid id, Loan loan)
        {
            var existingLoan = await _context.Loans.FindAsync(id);
            if (existingLoan == null) return null;

            existingLoan.LoanAmount = loan.LoanAmount;
            existingLoan.Purpose = loan.Purpose;
            existingLoan.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingLoan;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null) return false;

            _context.Loans.Remove(loan);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
