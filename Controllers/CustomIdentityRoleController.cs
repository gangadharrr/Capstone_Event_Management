using Capstone_Event_Management.Data;
using Capstone_Event_Management.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Security.Claims;

namespace Capstone_Event_Management.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CustomIdentityRoleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public CustomIdentityRoleController(ApplicationDbContext context,
          UserManager<ApplicationUser> userManager
          )
        {
            _userManager = userManager;
            _context = context;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Boolean>> GetCheckRole(string id,string role)
        {
            var user=await _userManager.FindByNameAsync(id);
            return await _userManager.IsInRoleAsync(user, role);
        }

    }
}
