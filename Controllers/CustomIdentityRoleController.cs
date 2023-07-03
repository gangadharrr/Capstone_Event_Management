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
    [Authorize]
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
            try
            {
                var user=await _userManager.FindByNameAsync(id);
                return await _userManager.IsInRoleAsync(user, role);
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet("{details}/{id}/{temp}")]
        public async Task<ActionResult<List<String>>> GetRoles(string id,string details,int temp)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(id);
                var roles= await _userManager.GetRolesAsync(user);
                var result=new List<String>();
                foreach(var role in roles)
                {
                    if(await _userManager.IsInRoleAsync(user, role))
                    {
                        result.Add(role);
                    }
                }
                return result;
            }
            catch
            {
                return BadRequest();
            }
        }
        [HttpGet("{id}/{details}")]
        public async Task<ActionResult<ApplicationUser>> GetDetails(string id,int details)
        {
            var user =await _userManager.FindByNameAsync(id);
            if(user == null)
            {
                return NotFound();
            }
            else
            {
                return user;
            }
        }

    }
}
