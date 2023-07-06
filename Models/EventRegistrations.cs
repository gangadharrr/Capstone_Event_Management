using Duende.IdentityServer.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Capstone_Event_Management.Models
{
    public class EventRegistrations
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("CollegeEvents")]
        [Display(Name = "Event ID")]
        [Required(ErrorMessage = "Event ID is Required")]
        public int EventId { get; set; }

        [Display(Name = "Email")]
        [Required(ErrorMessage = "Email is Required")]
        public string Email { get; set; }
        public DateTime DateTimeNow { get; set; } = DateTime.Now;
        public virtual CollegeEvents CollegeEvents { get; set; }
    }
}
