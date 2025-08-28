
using Microsoft.EntityFrameworkCore;
using Fintcs.Api.Data;
using Fintcs.Api.Models;

namespace Fintcs.Api.Services
{
    public class VoucherService : IVoucherService
    {
        private readonly FintcsDbContext _context;

        public VoucherService(FintcsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Voucher>> GetAllAsync()
        {
            return await _context.Vouchers.Include(v => v.Lines).ToListAsync();
        }

        public async Task<Voucher?> GetByIdAsync(Guid id)
        {
            return await _context.Vouchers.Include(v => v.Lines).FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Voucher> CreateAsync(Voucher voucher)
        {
            // Auto-generate voucher number
            var lastVoucher = await _context.Vouchers
                .OrderByDescending(v => v.CreatedAt)
                .FirstOrDefaultAsync();

            var nextNumber = 1;
            if (lastVoucher != null && lastVoucher.VoucherNo.StartsWith("V"))
            {
                if (int.TryParse(lastVoucher.VoucherNo.Substring(1), out var lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            voucher.VoucherNo = $"V{nextNumber:D6}";
            
            _context.Vouchers.Add(voucher);
            await _context.SaveChangesAsync();
            return voucher;
        }

        public async Task<Voucher?> UpdateAsync(Guid id, Voucher voucher)
        {
            var existingVoucher = await _context.Vouchers.FindAsync(id);
            if (existingVoucher == null) return null;

            existingVoucher.Narration = voucher.Narration;
            existingVoucher.Remarks = voucher.Remarks;
            existingVoucher.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingVoucher;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var voucher = await _context.Vouchers.FindAsync(id);
            if (voucher == null) return false;

            _context.Vouchers.Remove(voucher);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
