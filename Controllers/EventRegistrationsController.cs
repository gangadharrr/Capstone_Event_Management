using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Capstone_Event_Management.Data;
using Capstone_Event_Management.Models;
using static Duende.IdentityServer.Models.IdentityResources;
using Microsoft.AspNetCore.Authorization;

namespace Capstone_Event_Management.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class EventRegistrationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventRegistrationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/EventRegistrations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventRegistrations>>> GetEventRegistrations()
        {
            if (_context.EventRegistrations == null)
            {
                return NotFound();
            }
            return await _context.EventRegistrations.ToListAsync();
        }

        // GET: api/EventRegistrations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EventRegistrations>> GetEventRegistrations(int id)
        {
            if (_context.EventRegistrations == null)
            {
                return NotFound();
            }
            var eventRegistrations = await _context.EventRegistrations.FindAsync(id);

            if (eventRegistrations == null)
            {
                return NotFound();
            }

            return eventRegistrations;
        }

        [HttpGet("{email}/{eventId}")]
        public async Task<ActionResult<Boolean>> EventRegistered(string email, int eventId) 
        {
            var eventregistrations = await _context.EventRegistrations.ToListAsync();
            if(eventregistrations != null)
            {
                return eventregistrations.Any(e=>e.Email == email&&e.EventId==eventId);
            }
            else
            {
                return false;
            }
        }

        // PUT: api/EventRegistrations/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEventRegistrations(int id, EventRegistrations eventRegistrations)
        {
            if (id != eventRegistrations.Id)
            {
                return BadRequest();
            }

            _context.Entry(eventRegistrations).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventRegistrationsExists(id))
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

        // POST: api/EventRegistrations
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<EventRegistrations>> PostEventRegistrations(EventRegistrations eventRegistrations)
        {
          if (_context.EventRegistrations == null)
          {
              return Problem("Entity set 'ApplicationDbContext.EventRegistrations'  is null.");
          }
            _context.EventRegistrations.Add(eventRegistrations);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEventRegistrations", new { id = eventRegistrations.Id }, eventRegistrations);
        }

        // DELETE: api/EventRegistrations/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEventRegistrations(int id)
        {
            if (_context.EventRegistrations == null)
            {
                return NotFound();
            }
            var eventRegistrations = await _context.EventRegistrations.FindAsync(id);
            if (eventRegistrations == null)
            {
                return NotFound();
            }

            _context.EventRegistrations.Remove(eventRegistrations);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [Authorize]
        [HttpDelete("{eventId}/{email}")]
        public async Task<IActionResult> DeleteEventRegistrations(int eventId,string email)
        {
            if (_context.EventRegistrations == null)
            {
                return NotFound();
            }
            var eventRegistrations = await _context.EventRegistrations.Where(e => e.EventId == eventId && e.Email == email).FirstOrDefaultAsync();
            if (eventRegistrations == null)
            {
                return NotFound();
            }

            _context.EventRegistrations.Remove(eventRegistrations);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool EventRegistrationsExists(int id)
        {
            return (_context.EventRegistrations?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
