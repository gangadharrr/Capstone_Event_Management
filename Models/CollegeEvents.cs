using Duende.IdentityServer.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Capstone_Event_Management.Models
{
    public class CollegeEvents
    {
        [Key]
        [Display(Name = "Event ID")]
        [Required(ErrorMessage = "Event ID is Required")]
        public int EventId { get; set; }
        [ForeignKey("Clubs")]
        [Display(Name = "Club ID")]
        [Required(ErrorMessage = "Club ID is Required")]
        public int ClubId { get; set; }
        [Display(Name = "Name")]
        [Required(ErrorMessage = "Name is Required")]
        public string Name { get; set; }
        [Display(Name = "Resource Person")]
        [Required(ErrorMessage = "Resource Person is Required")]
        public string ResourcePerson { get; set; }
        [Display(Name = "Price")]
        [Required(ErrorMessage = "Price is Required")]
        public double Price { get; set; }
        [Display(Name = "DiscountPrice")]
        [Required(ErrorMessage = "DiscountPrice is Required")]
        public double DiscountPrice { get; set; }
        [Display(Name = "Mode of Event")]
        [Required(ErrorMessage = "Mode of Event is Required")]
        public string ModeOfEvent { get; set; }
        [Display(Name = "Start Time of Event")]
        [Required(ErrorMessage = "Start Time of Event is Required")]
        public DateTime StartDateTimeOfEvent { get; set; }
        [Display(Name = "End Time of Event")]
        [Required(ErrorMessage = "End Time of Event is Required")]
        public DateTime EndDateTimeOfEvent { get; set; }
        [Display(Name = "Last Day To Register")]
        [Required(ErrorMessage = "Last Day To Register is Required")]
        public DateTime LastDayToRegister { get; set; }
        [Display(Name = "Picture Url")]
        [Required(ErrorMessage = "Picture Url is Required")]
        public string PictureUrl { get; set; }
        [Display(Name = "Poster Url")]
        [Required(ErrorMessage = "Poster Url is Required")]
        public string PosterUrl { get; set; }
        [Display(Name = "Access Level")]
        [Required(ErrorMessage = "Access Level is Required")]
        public string AccessLevel { get; set; }
        [Display(Name = "Venue")]
        [Required(ErrorMessage = "Venue is Required")]
        public string Venue { get; set; }
        [Display(Name = "Available Seats")]
        [Required(ErrorMessage = "Available Seats is Required")]
        public int AvailableSeats { get; set; }
        public virtual Clubs Clubs { get; set; }
    }
}
