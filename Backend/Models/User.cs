
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [EmailAddress]
        public string? Email { get; set; }
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Role { get; set; } = string.Empty; // SuperAdmin, SocietyAdmin, User, Member
        
        [StringLength(20)]
        public string? EdpNo { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public string? AddressOffice { get; set; }
        
        public string? AddressResidence { get; set; }
        
        [StringLength(100)]
        public string? Designation { get; set; }
        
        [StringLength(20)]
        public string? PhoneOffice { get; set; }
        
        [StringLength(20)]
        public string? PhoneResidence { get; set; }
        
        [StringLength(20)]
        public string? Mobile { get; set; }
        
        public Guid? SocietyId { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
