using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Capstone_Event_Management.Data;
using Capstone_Event_Management.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using static IdentityModel.OidcConstants;

namespace Capstone_Event_Management.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CollegeEventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CollegeEventsController(ApplicationDbContext context,UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/CollegeEvents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CollegeEvents>>> GetCollegeEvents()
        {
          if (_context.CollegeEvents == null)
          {
              return NotFound();
          }
            return await _context.CollegeEvents.ToListAsync();
        }

        // GET: api/CollegeEvents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CollegeEvents>> GetCollegeEvents(int id)
        {
          if (_context.CollegeEvents == null)
          {
              return NotFound();
          }
            var collegeEvents = await _context.CollegeEvents.FindAsync(id);

            if (collegeEvents == null)
            {
                return NotFound();
            }

            return collegeEvents;
        }

        // PUT: api/CollegeEvents/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{userName}/{id}")]
        public async Task<IActionResult> PutCollegeEvents(int id, string userName,CollegeEvents collegeEvents)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var clubs = await _context.Clubs.FindAsync(collegeEvents.ClubId);
            if (await _userManager.IsInRoleAsync(user, "Admin") || userName == clubs.President.Split('@').FirstOrDefault())
            {
                if (id != collegeEvents.EventId)
                {
                    return BadRequest();
                }
                collegeEvents.Clubs = await _context.Clubs.FindAsync(collegeEvents.ClubId);
                _context.Entry(collegeEvents).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CollegeEventsExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }
            else
            {

                return StatusCode(401, "UnAuthorized Access");
            }    
        }

        // POST: api/CollegeEvents
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost("{userName}")]
        public async Task<ActionResult<CollegeEvents>> PostCollegeEvents(string userName,CollegeEvents collegeEvents)
        {
            var user = await _userManager.FindByNameAsync(userName);
            var clubs = await _context.Clubs.FindAsync(collegeEvents.ClubId);
            if (await _userManager.IsInRoleAsync(user, "Admin") || userName == clubs.President.Split('@').FirstOrDefault())
            {
                if (_context.CollegeEvents == null)
                {
                    return Problem("Entity set 'ApplicationDbContext.CollegeEvents'  is null.");
                }
                collegeEvents.Clubs = await _context.Clubs.FindAsync(collegeEvents.ClubId);
                _context.CollegeEvents.Add(collegeEvents);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCollegeEvents", new { id = collegeEvents.EventId }, collegeEvents);
            }
            else
            {
                return Problem("UnAuthorized Access");
            }
        }

        // DELETE: api/CollegeEvents/5
        [Authorize]
        [HttpDelete("{userName}/{id}")]
        public async Task<IActionResult> DeleteCollegeEvents(int id,string userName)
        {
            if (_context.CollegeEvents == null)
            {
                return NotFound();
            }
            var user = await _userManager.FindByNameAsync(userName);
            var collegeEvents = await _context.CollegeEvents.FindAsync(id);
            var clubs = await _context.Clubs.FindAsync(collegeEvents.ClubId);
            if (await _userManager.IsInRoleAsync(user, "Admin") || userName == clubs.President.Split('@').FirstOrDefault())
            {
                if (collegeEvents == null)
                {
                    return NotFound();
                }
               
                _context.CollegeEvents.Remove(collegeEvents);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            else
            {
                return StatusCode(401, "UnAuthorized Access");
            }
        }

        private bool CollegeEventsExists(int id)
        {
            return (_context.CollegeEvents?.Any(e => e.EventId == id)).GetValueOrDefault();
        }
    }
}
