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
using System.Security.Claims;

namespace Capstone_Event_Management.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        { 
            _context = context;
           
        }

        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Students>>> GetStudents()
        {
          if (_context.Students == null)
          {
              return NotFound();
          }
            return await _context.Students.ToListAsync();
        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Students>> GetStudents(string id)
        {
          if (_context.Students == null)
          {
              return NotFound();
          }
            var students = await _context.Students.FindAsync(id);

            if (students == null)
            {
                return NotFound();
            }

            return students;
        }

        // PUT: api/Students/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudents(string id, Students students)
        {
            if (id != students.Email)
            {
                return BadRequest();
            }

            _context.Entry(students).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentsExists(id))
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

        // POST: api/Students
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Students>> PostStudents(Students students)
        {
          if (_context.Students == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Students'  is null.");
          }
            _context.Students.Add(students);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (StudentsExists(students.Email))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetStudents", new { id = students.Email }, students);
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudents(string id)
        {
            if (_context.Students == null)
            {
                return NotFound();
            }
            var students = await _context.Students.FindAsync(id);
            if (students == null)
            {
                return NotFound();
            }

            _context.Students.Remove(students);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentsExists(string id)
        {
            return (_context.Students?.Any(e => e.Email == id)).GetValueOrDefault();
        }
    }
}
