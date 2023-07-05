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
    
    [Route("[controller]")]
    [ApiController]
    public class ClubMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClubMembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ClubMembers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClubMembers>>> GetClubMembers()
        {
          if (_context.ClubMembers == null)
          {
              return NotFound();
          }
            return await _context.ClubMembers.ToListAsync();
        }

        // GET: api/ClubMembers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClubMembers>> GetClubMembers(int id)
        {
          if (_context.ClubMembers == null)
          {
              return NotFound();
          }
            var clubMembers = await _context.ClubMembers.FindAsync(id);

            if (clubMembers == null)
            {
                return NotFound();
            }

            return clubMembers;
        }
        [HttpGet("{email}/{clubId}")]
        public async  Task<ActionResult<Boolean>> MemberRegistered(string email,int clubId)
        {
            var members = await _context.ClubMembers.ToListAsync();
            if(members!=null)
            {

                return members.Any((e) => e.ClubId == clubId && e.Email == email);
            }
            else
            {

                return false;
            }
        }

        // PUT: api/ClubMembers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClubMembers(int id, ClubMembers clubMembers)
        {
            if (id != clubMembers.Id)
            {
                return BadRequest();
            }

            _context.Entry(clubMembers).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClubMembersExists(id))
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

        // POST: api/ClubMembers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ClubMembers>> PostClubMembers(ClubMembers clubMembers)
        {
          if (_context.ClubMembers == null)
          {
              return Problem("Entity set 'ApplicationDbContext.ClubMembers'  is null.");
          }
            clubMembers.Clubs = await _context.Clubs.FindAsync(clubMembers.ClubId);
            clubMembers.Students = await _context.Students.FindAsync(clubMembers.Email);
            _context.ClubMembers.Add(clubMembers);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClubMembers", new { id = clubMembers.Id }, clubMembers);
        }

        // DELETE: api/ClubMembers/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClubMembers(int id)
        {
            if (_context.ClubMembers == null)
            {
                return NotFound();
            }
            var clubMembers = await _context.ClubMembers.FindAsync(id);
            if (clubMembers == null)
            {
                return NotFound();
            }

            _context.ClubMembers.Remove(clubMembers);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("{clubId}/{email}")]
        public async Task<IActionResult> DeleteClubMembers(int clubId, string email)
        {
            if (_context.ClubMembers == null)
            {
                return NotFound();
            }
            var clubMembers = await _context.ClubMembers.Where(e=>e.ClubId==clubId&&e.Email==email).FirstOrDefaultAsync();
            if (clubMembers == null)
            {
                return NotFound();
            }

            _context.ClubMembers.Remove(clubMembers);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClubMembersExists(int id)
        {
            return (_context.ClubMembers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
