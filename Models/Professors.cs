using Duende.IdentityServer.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Capstone_Event_Management.Models
{
    [Index(nameof(ProfessorId), IsUnique = true)]
    public class Professors
    {
        [Display(Name = "Employee ID")]
        [Required(ErrorMessage = "Employee ID is Required")]
        public string? ProfessorId { get; set; }
        [Display(Name = "Name")]
        [Required(ErrorMessage = "Name is Required")]
        public string? Name { get; set; }
        [Key]
        [Display(Name = "Email")]
        [Required(ErrorMessage = "Email is Required")]
        public string? Email { get; set; }
        [Display(Name = "Designation")]
        [Required(ErrorMessage = "Designation is Required")]
        public string? Designation { get; set; }
        [Display(Name = "Degree")]
        [Required(ErrorMessage = "Degree is Required")]
        public string? NormalizedDegree { get; set; }

        [Display(Name = "Branch")]
        [Required(ErrorMessage = "Branch is Required")]
        public string? NormalizedBranch { get; set; }
    }
}
