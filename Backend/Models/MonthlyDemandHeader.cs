
using System.ComponentModel.DataAnnotations;

namespace Fintcs.Api.Models
{
    public class MonthlyDemandHeader
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [StringLength(20)]
        public string Month { get; set; } = string.Empty;
        
        public int Year { get; set; }
        
        public Guid SocietyId { get; set; }
        
        public int TotalMembers { get; set; } = 0;
        
        public decimal TotalAmount { get; set; } = 0;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public List<MonthlyDemandRow> Rows { get; set; } = new();
    }
}
