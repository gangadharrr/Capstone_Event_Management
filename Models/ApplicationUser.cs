using Microsoft.AspNetCore.Identity;

namespace Capstone_Event_Management.Models
{
    public class ApplicationUser : IdentityUser
    {
       public string DisplayName { get; set; }
       public string ProfileUrl { get; set; } = "https://res.cloudinary.com/dujyzevpx/image/upload/v1687345453/Images/Account_Logo_jton6z.png";
    }
}