using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Capstone_Event_Management.Data;
using Capstone_Event_Management.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using static Duende.IdentityServer.Models.IdentityResources;

namespace Capstone_Event_Management.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EventUpdatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public EventUpdatesController(ApplicationDbContext context,UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: api/EventUpdates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventUpdates>>> GetEventUpdates()
        {
          if (_context.EventUpdates == null)
          {
              return NotFound();
          }
            return await _context.EventUpdates.ToListAsync();
        }

        // GET: api/EventUpdates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventUpdates>> GetEventUpdates(int id)
        {
          if (_context.EventUpdates == null)
          {
              return NotFound();
          }
            var eventUpdates = await _context.EventUpdates.FindAsync(id);

            if (eventUpdates == null)
            {
                return NotFound();
            }

            return eventUpdates;
        }

        // PUT: api/EventUpdates/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{email}/{id}")]
        public async Task<IActionResult> PutEventUpdates(int id,string email,EventUpdates eventUpdates)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (await _userManager.IsInRoleAsync(user, "Admin") || (await _userManager.IsInRoleAsync(user, "President") && eventUpdates.Email == email)) { 
                if (id != eventUpdates.MessageId)
                {
                    return BadRequest();
                }
                eventUpdates.CollegeEvents = await _context.CollegeEvents.FindAsync(eventUpdates.EventId);
                _context.Entry(eventUpdates).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventUpdatesExists(id))
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
                return StatusCode(StatusCodes.Status401Unauthorized);
            }
        }

        // POST: api/EventUpdates
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EventUpdates>> PostEventUpdates(EventUpdates eventUpdates)
        {
            var user = await _userManager.FindByEmailAsync(eventUpdates.Email);
            if (await _userManager.IsInRoleAsync(user, "President"))
            {

              if (_context.EventUpdates == null)
              {
                  return Problem("Entity set 'ApplicationDbContext.EventUpdates'  is null.");
              }
                eventUpdates.CollegeEvents =await _context.CollegeEvents.FindAsync(eventUpdates.EventId);
                _context.EventUpdates.Add(eventUpdates);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetEventUpdates", new { id = eventUpdates.MessageId }, eventUpdates);
            }
            else
            {
                return Problem("Unauthorized Access");
            }
        }

        // DELETE: api/EventUpdates/5
        [Authorize]
        [HttpDelete("{email}/{id}")]
        public async Task<IActionResult> DeleteEventUpdates(int id,string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            
            if (_context.EventUpdates == null)
            {
                return NotFound();
            }
            var eventUpdates = await _context.EventUpdates.FindAsync(id);
            if (eventUpdates == null)
            {
                return NotFound();
            }
            if (await _userManager.IsInRoleAsync(user, "Admin") || (await _userManager.IsInRoleAsync(user, "President") && eventUpdates.Email == email))
            { 
                _context.EventUpdates.Remove(eventUpdates);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            else
            {
                return StatusCode(StatusCodes.Status401Unauthorized);
            }

        }

        private bool EventUpdatesExists(int id)
        {
            return (_context.EventUpdates?.Any(e => e.MessageId == id)).GetValueOrDefault();
        }
    }
}
