
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.DTOs
{
    public class UpdateUserDto
    {
        [EmailAddress]
        public string? Email { get; set; }

        [StringLength(20)]
        public string? Role { get; set; }

        [StringLength(20)]
        public string? EdpNo { get; set; }

        [StringLength(100)]
        public string? Name { get; set; }

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

        public bool? IsActive { get; set; }
    }
}
