using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Capstone_Event_Management.Data;
using Capstone_Event_Management.Models;

namespace Capstone_Event_Management.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubscriptionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Subscriptions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subscriptions>>> GetSubscriptions()
        {
          if (_context.Subscriptions == null)
          {
              return NotFound();
          }
            return await _context.Subscriptions.ToListAsync();
        }

        // GET: api/Subscriptions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Subscriptions>> GetSubscriptions(int id)
        {
          if (_context.Subscriptions == null)
          {
              return NotFound();
          }
            var subscriptions = await _context.Subscriptions.FindAsync(id);

            if (subscriptions == null)
            {
                return NotFound();
            }

            return subscriptions;
        }
        [HttpGet("{email}/{clubId}")]
        public async Task<ActionResult<Boolean>> MemberSubscription(int clubId, string email)
        {
            if (_context.Subscriptions == null)
            {
                return false;
            }
            else
            {
                return _context.Subscriptions.Any((e) => e.ClubId == clubId && e.Email == email);
            }
        }
        // PUT: api/Subscriptions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubscriptions(int id, Subscriptions subscriptions)
        {
            if (id != subscriptions.Id)
            {
                return BadRequest();
            }

            _context.Entry(subscriptions).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubscriptionsExists(id))
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

        // POST: api/Subscriptions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Subscriptions>> PostSubscriptions(Subscriptions subscriptions)
        {
          if (_context.Subscriptions == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Subscriptions'  is null.");
          }
            subscriptions.Clubs = await _context.Clubs.FindAsync(subscriptions.ClubId);
            _context.Subscriptions.Add(subscriptions);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubscriptions", new { id = subscriptions.Id }, subscriptions);
        }

        // DELETE: api/Subscriptions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscriptions(int id)
        {
            if (_context.Subscriptions == null)
            {
                return NotFound();
            }
            var subscriptions = await _context.Subscriptions.FindAsync(id);
            if (subscriptions == null)
            {
                return NotFound();
            }

            _context.Subscriptions.Remove(subscriptions);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("{clubId}/{email}")]
        public async Task<IActionResult> DeleteSubscriptions(int clubId, string email)
        {
            if (_context.Subscriptions == null)
            {
                return NotFound();
            }
            var subscriptions = await _context.Subscriptions.Where(e => e.ClubId == clubId && e.Email == email).FirstOrDefaultAsync();
            if (subscriptions == null)
            {
                return NotFound();
            }

            _context.Subscriptions.Remove(subscriptions);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool SubscriptionsExists(int id)
        {
            return (_context.Subscriptions?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
