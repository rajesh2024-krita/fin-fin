
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.Models
{
    public class VoucherLine
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid VoucherId { get; set; }
        
        [StringLength(200)]
        public string? Particulars { get; set; }
        
        public decimal Debit { get; set; } = 0;
        
        public decimal Credit { get; set; } = 0;
        
        [StringLength(10)]
        public string? DbCr { get; set; }
        
        public int LineOrder { get; set; } = 0;
    }
}
