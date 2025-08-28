
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.Models
{
    public class Loan
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(20)]
        public string LoanNo { get; set; } = string.Empty;
        
        public Guid LoanTypeId { get; set; }
        
        public DateTime LoanDate { get; set; } = DateTime.UtcNow;
        
        [StringLength(20)]
        public string? EdpNo { get; set; }
        
        [StringLength(100)]
        public string? Name { get; set; }
        
        public decimal LoanAmount { get; set; }
        
        public decimal PreviousLoan { get; set; } = 0;
        
        public decimal? NetLoan { get; set; }
        
        public int? Installments { get; set; }
        
        public decimal? InstallmentAmount { get; set; }
        
        public string? Purpose { get; set; }
        
        [StringLength(100)]
        public string? AuthorizedBy { get; set; }
        
        [StringLength(20)]
        public string? PaymentMode { get; set; }
        
        public Guid? BankId { get; set; }
        
        [StringLength(50)]
        public string? ChequeNo { get; set; }
        
        public DateTime? ChequeDate { get; set; }
        
        public Guid SocietyId { get; set; }
        
        public bool IsValidated { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
