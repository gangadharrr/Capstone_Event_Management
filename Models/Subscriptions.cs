using Duende.IdentityServer.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Capstone_Event_Management.Models
{
    public class Subscriptions
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Clubs")]
        [Display(Name = "Club ID")]
        [Required(ErrorMessage = "Club ID is Required")]
        public int ClubId { get; set; }
        [Display(Name = "Email")]
        [Required(ErrorMessage = "Email is Required")]
        public string Email { get; set; }
        public DateTime DateTimeNow { get; set; }= DateTime.Now;
        public virtual Clubs Clubs { get; set; }
    }
}
