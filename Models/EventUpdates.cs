using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace Capstone_Event_Management.Models
{
    public class EventUpdates
    {
        [Key]
        public int MessageId { get; set; }

        [ForeignKey("CollegeEvents")]
        [Display(Name = "Event ID")]
        [Required(ErrorMessage = "Event ID is Required")]
        public int EventId { get; set; }
        [Display(Name = "Message")]
        [Required(ErrorMessage = "Message is Required")]
        public string Message { get; set; }
        [Display(Name = "Email")]
        [Required(ErrorMessage = "Email is Required")]
        public string Email { get; set; }
        public DateTime DateTimeNow { get; set; } = DateTime.Now;
        public int ThreadId { get; set; } = -1;
        public Boolean IsEdited { get; set; }=false;
        public virtual CollegeEvents CollegeEvents { get; set; }
    }
}
