
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.Models
{
    public class Society
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        public string? Address { get; set; }
        
        [StringLength(100)]
        public string? City { get; set; }
        
        [StringLength(20)]
        public string? Phone { get; set; }
        
        [StringLength(20)]
        public string? Fax { get; set; }
        
        [EmailAddress]
        public string? Email { get; set; }
        
        [StringLength(200)]
        public string? Website { get; set; }
        
        [StringLength(100)]
        public string? RegistrationNo { get; set; }
        
        // Interest rates
        public decimal? InterestDividend { get; set; }
        public decimal? InterestOD { get; set; }
        public decimal? InterestCD { get; set; }
        public decimal? InterestLoan { get; set; }
        public decimal? InterestEmergencyLoan { get; set; }
        public decimal? InterestLAS { get; set; }
        
        // Limits
        public decimal? LimitShare { get; set; }
        public decimal? LimitLoan { get; set; }
        public decimal? LimitEmergencyLoan { get; set; }
        
        // Bounce charge
        public decimal? ChBounceChargeAmount { get; set; }
        
        [StringLength(50)]
        public string? ChBounceChargeMode { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
