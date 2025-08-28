
using Microsoft.EntityFrameworkCore;
using Fintcs.Api.Data;
using Fintcs.Api.Models;

namespace Fintcs.Api.Services
{
    public class SocietyService : ISocietyService
    {
        private readonly FintcsDbContext _context;

        public SocietyService(FintcsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Society>> GetAllAsync()
        {
            return await _context.Societies.Where(s => s.IsActive).ToListAsync();
        }

        public async Task<Society?> GetByIdAsync(Guid id)
        {
            return await _context.Societies.FindAsync(id);
        }

        public async Task<Society> CreateAsync(Society society)
        {
            _context.Societies.Add(society);
            await _context.SaveChangesAsync();
            return society;
        }

        public async Task<Society?> UpdateAsync(Guid id, Society society)
        {
            var existingSociety = await _context.Societies.FindAsync(id);
            if (existingSociety == null) return null;

            existingSociety.Name = society.Name;
            existingSociety.Address = society.Address;
            existingSociety.City = society.City;
            existingSociety.Phone = society.Phone;
            existingSociety.Email = society.Email;
            existingSociety.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingSociety;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var society = await _context.Societies.FindAsync(id);
            if (society == null) return false;

            society.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
