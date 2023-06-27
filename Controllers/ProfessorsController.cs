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
    public class ProfessorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProfessorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Professors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Professors>>> GetProfessors()
        {
          if (_context.Professors == null)
          {
              return NotFound();
          }
            return await _context.Professors.ToListAsync();
        }

        // GET: api/Professors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Professors>> GetProfessors(string id)
        {
          if (_context.Professors == null)
          {
              return NotFound();
          }
            var professors = await _context.Professors.FindAsync(id);

            if (professors == null)
            {
                return NotFound();
            }

            return professors;
        }

        // PUT: api/Professors/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProfessors(string id, Professors professors)
        {
            if (id != professors.Email)
            {
                return BadRequest();
            }

            _context.Entry(professors).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProfessorsExists(id))
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

        // POST: api/Professors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Professors>> PostProfessors(Professors professors)
        {
          if (_context.Professors == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Professors'  is null.");
          }
            _context.Professors.Add(professors);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ProfessorsExists(professors.Email))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetProfessors", new { id = professors.Email }, professors);
        }

        // DELETE: api/Professors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProfessors(string id)
        {
            if (_context.Professors == null)
            {
                return NotFound();
            }
            var professors = await _context.Professors.FindAsync(id);
            if (professors == null)
            {
                return NotFound();
            }

            _context.Professors.Remove(professors);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProfessorsExists(string id)
        {
            return (_context.Professors?.Any(e => e.Email == id)).GetValueOrDefault();
        }
    }
}
