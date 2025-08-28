
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.Models
{
    public class MonthlyDemandRow
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid HeaderId { get; set; }
        
        [StringLength(20)]
        public string? EdpNo { get; set; }
        
        [StringLength(100)]
        public string? MemberName { get; set; }
        
        public decimal LoanAmt { get; set; } = 0;
        
        public decimal CD { get; set; } = 0;
        
        public decimal Loan { get; set; } = 0;
        
        public decimal Interest { get; set; } = 0;
        
        public decimal ELoan { get; set; } = 0;
        
        public decimal InterestExtra { get; set; } = 0;
        
        public decimal Net { get; set; } = 0;
        
        public decimal IntDue { get; set; } = 0;
        
        public decimal PInt { get; set; } = 0;
        
        public decimal PDed { get; set; } = 0;
        
        public decimal LAS { get; set; } = 0;
        
        public decimal Int { get; set; } = 0;
        
        public decimal LASIntDue { get; set; } = 0;
        
        public decimal TotalAmount { get; set; } = 0;
    }
}
