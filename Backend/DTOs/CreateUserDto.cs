
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.DTOs
{
    public class CreateUserDto
    {
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = string.Empty;

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

        public string? SocietyId { get; set; }
    }
}
