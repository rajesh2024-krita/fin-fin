
using Fintcs.Api.Models;

namespace Fintcs.Api.Services
{
    public interface ILoanService
    {
        Task<IEnumerable<Loan>> GetAllAsync();
        Task<Loan?> GetByIdAsync(Guid id);
        Task<Loan> CreateAsync(Loan loan);
        Task<Loan?> UpdateAsync(Guid id, Loan loan);
        Task<bool> DeleteAsync(Guid id);
    }
}
