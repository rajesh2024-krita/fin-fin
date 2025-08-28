
using Microsoft.EntityFrameworkCore;
using Fintcs.Api.Data;
using Fintcs.Api.Models;

namespace Fintcs.Api.Services
{
    public class MemberService : IMemberService
    {
        private readonly FintcsDbContext _context;

        public MemberService(FintcsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Member>> GetAllAsync()
        {
            return await _context.Members.Where(m => m.Status == "Active").ToListAsync();
        }

        public async Task<Member?> GetByIdAsync(Guid id)
        {
            return await _context.Members.FindAsync(id);
        }

        public async Task<Member> CreateAsync(Member member)
        {
            // Auto-generate member number
            var lastMember = await _context.Members
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync();

            var nextNumber = 1;
            if (lastMember != null && lastMember.MemNo.StartsWith("MEM_"))
            {
                if (int.TryParse(lastMember.MemNo.Substring(4), out var lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            member.MemNo = $"MEM_{nextNumber:D3}";
            
            _context.Members.Add(member);
            await _context.SaveChangesAsync();
            return member;
        }

        public async Task<Member?> UpdateAsync(Guid id, Member member)
        {
            var existingMember = await _context.Members.FindAsync(id);
            if (existingMember == null) return null;

            existingMember.Name = member.Name;
            existingMember.Email = member.Email;
            existingMember.Mobile = member.Mobile;
            existingMember.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingMember;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null) return false;

            member.Status = "Inactive";
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
