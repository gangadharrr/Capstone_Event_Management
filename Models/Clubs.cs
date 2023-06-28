using Duende.IdentityServer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Capstone_Event_Management.Models
{
    [Index(nameof(ClubEmail), IsUnique = true)]
    public class Clubs
    {
        [Key]
        [Display(Name = "Club ID")]
        [Required(ErrorMessage = "Club ID is Required")]
        public int ClubId { get; set; }
        [Display(Name = "Name")]
        [Required(ErrorMessage = "Name is Required")]
        public string Name { get; set; }
        [Display(Name = "Description")]
        [Required(ErrorMessage = "Description is Required")]
        public string Description { get; set; }
        [Display(Name = "President")]
        [Required(ErrorMessage = "President Email is Required")]
        [ForeignKey("Students")]
        public string President { get; set; }
        [Display(Name = "Professor Incharge")]
        [Required(ErrorMessage = "Professor Incharge Email is Required")]
        [ForeignKey("Professors")]
        public string ProfessorIncharge { get; set; }
        [Display(Name = "Club Email")]
        [Required(ErrorMessage = "Club Email is Required")]
        public string ClubEmail { get; set; }
        [Display(Name = "Price")]
        [Required(ErrorMessage = "Price is Required")]
        public double? Price { get; set; } = 0;
        [Display(Name = "Available Seats")]
        [Required(ErrorMessage = "Available Seats is Required")]
        public int? AvailableSeats { get; set; } = int.MaxValue;
        [Display(Name = "ClubPicture")]
        [Required(ErrorMessage = "ClubPictureis Required")]
        public string? ClubPicture { get; set; } = "https://res.cloudinary.com/dujyzevpx/image/upload/v1687345454/Images/HomePageBG_glzmob.jpg";

        public virtual Students Students { get; set; }
        public virtual Professors Professors { get; set; }

    }
}
