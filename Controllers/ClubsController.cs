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

namespace Capstone_Event_Management.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ClubsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClubsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Clubs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Clubs>>> GetClubs()
        {
          if (_context.Clubs == null)
          {
              return NotFound();
          }
            return await _context.Clubs.ToListAsync();
        }

        // GET: api/Clubs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Clubs>> GetClubs(int id)
        {
          if (_context.Clubs == null)
          {
              return NotFound();
          }
            var clubs = await _context.Clubs.FindAsync(id);

            if (clubs == null)
            {
                return NotFound();
            }

            return clubs;
        }

        // PUT: api/Clubs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClubs(int id, Clubs clubs)
        {
            if (id != clubs.ClubId)
            {
                return BadRequest();
            }

            _context.Entry(clubs).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClubsExists(id))
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

        // POST: api/Clubs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Clubs>> PostClubs(Clubs clubs)
        {
          if (_context.Clubs == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Clubs'  is null.");
          }
            _context.Clubs.Add(clubs);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClubs", new { id = clubs.ClubId }, clubs);
        }

        // DELETE: api/Clubs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClubs(int id)
        {
            if (_context.Clubs == null)
            {
                return NotFound();
            }
            var clubs = await _context.Clubs.FindAsync(id);
            if (clubs == null)
            {
                return NotFound();
            }

            _context.Clubs.Remove(clubs);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClubsExists(int id)
        {
            return (_context.Clubs?.Any(e => e.ClubId == id)).GetValueOrDefault();
        }
    }
}
