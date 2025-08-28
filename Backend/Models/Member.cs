
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.Models
{
    public class Member
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(20)]
        public string MemNo { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? FatherHusbandName { get; set; }
        
        public string? OfficeAddress { get; set; }
        
        [StringLength(100)]
        public string? City { get; set; }
        
        [StringLength(20)]
        public string? PhoneOffice { get; set; }
        
        [StringLength(100)]
        public string? Branch { get; set; }
        
        [StringLength(20)]
        public string? PhoneResidence { get; set; }
        
        [StringLength(20)]
        public string? Mobile { get; set; }
        
        [StringLength(100)]
        public string? Designation { get; set; }
        
        public string? ResidenceAddress { get; set; }
        
        public DateTime? DOB { get; set; }
        
        public DateTime? DOJSociety { get; set; }
        
        [EmailAddress]
        public string? Email { get; set; }
        
        public DateTime? DOJOrg { get; set; }
        
        public DateTime? DOR { get; set; }
        
        [StringLength(100)]
        public string? Nominee { get; set; }
        
        [StringLength(50)]
        public string? NomineeRelation { get; set; }
        
        public decimal? OpeningBalanceShare { get; set; }
        
        public decimal? Value { get; set; }
        
        [StringLength(10)]
        public string? CrDrCd { get; set; }
        
        [StringLength(100)]
        public string? BankName { get; set; }
        
        [StringLength(100)]
        public string? PayableAt { get; set; }
        
        [StringLength(50)]
        public string? AccountNo { get; set; }
        
        [StringLength(20)]
        public string Status { get; set; } = "Active";
        
        public DateTime? StatusDate { get; set; }
        
        public string? PhotoUrl { get; set; }
        
        public string? SignatureUrl { get; set; }
        
        public Guid SocietyId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
