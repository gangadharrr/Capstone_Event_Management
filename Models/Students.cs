using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Capstone_Event_Management.Models
{
    [Index(nameof(RollNumber), IsUnique = true)]
    public class Students
    {
        [Display(Name = "Name")]
        [Required(ErrorMessage = "Name is Required")]
        public string Name { get; set; }
        [Key]
        [Display(Name = "Email")]
        [Required(ErrorMessage = "Email is Required")]
        public string Email { get; set; }
        [Display(Name = "Batch")]
        [Required(ErrorMessage = "Batch is Required")]
        public string Batch { get; set; }
        [Display(Name = "Section")]
        [Required(ErrorMessage = "Section is Required")]
        public string Section { get; set; }
        [Display(Name = "RollNumber")]
        [Required(ErrorMessage = "RollNumber is Required")]
        public int RollNumber { get; set; }

        [ForeignKey("Degrees")]
        [Display(Name = "Degree")]
        [Required(ErrorMessage = "Degree is Required")]
        public string NormalizedDegree { get; set; }

        [Display(Name = "Branch")]
        [Required(ErrorMessage = "Branch is Required")]
        public string NormalizedBranch { get; set; }
    }
}
