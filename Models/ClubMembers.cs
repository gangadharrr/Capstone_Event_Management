using Duende.IdentityServer.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Capstone_Event_Management.Models
{
    public class ClubMembers
    {

        [Key]
        public int Id { get; set; }

        [ForeignKey("Clubs")]
        [Display(Name = "Club ID")]
        [Required(ErrorMessage = "Club ID is Required")]
        public int ClubId { get; set; }

        [ForeignKey("Students")]
        [Display(Name = "Email")]
        [Required(ErrorMessage = "Email is Required")]
        public string Email { get; set; }
        public DateTime DateTimeNow { get; set; }= DateTime.Now; 
        public virtual Clubs Clubs { get; set; }
        public virtual Students Students { get; set; }
    }
}
