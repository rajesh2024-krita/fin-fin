
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.Models
{
    public class Voucher
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(20)]
        public string VoucherNo { get; set; } = string.Empty;
        
        public Guid VoucherTypeId { get; set; }
        
        public DateTime Date { get; set; } = DateTime.UtcNow;
        
        [StringLength(50)]
        public string? ChequeNo { get; set; }
        
        public DateTime? ChequeDate { get; set; }
        
        public string? Narration { get; set; }
        
        public string? Remarks { get; set; }
        
        public DateTime? PassDate { get; set; }
        
        public decimal TotalDebit { get; set; } = 0;
        
        public decimal TotalCredit { get; set; } = 0;
        
        public bool IsBalanced { get; set; } = false;
        
        public Guid SocietyId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public List<VoucherLine> Lines { get; set; } = new();
    }
}
