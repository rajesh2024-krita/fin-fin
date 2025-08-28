
using Fintcs.Api.Models;

namespace Fintcs.Api.Services
{
    public interface ISocietyService
    {
        Task<IEnumerable<Society>> GetAllAsync();
        Task<Society?> GetByIdAsync(Guid id);
        Task<Society> CreateAsync(Society society);
        Task<Society?> UpdateAsync(Guid id, Society society);
        Task<bool> DeleteAsync(Guid id);
    }
}
