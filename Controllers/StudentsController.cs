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
   
    [Route("[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public StudentsController(ApplicationDbContext context,UserManager<ApplicationUser> userManager)
        { 
            _context = context;
            _userManager = userManager;
           
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
        public async Task<ActionResult<Students>> GetStudent(string id)
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
        [Authorize]
        [HttpPut("{userName}/{id}")]
        public async Task<IActionResult> PutStudents(string id,string userName,Students students)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (await _userManager.IsInRoleAsync(user, "Admin"))
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
            else
            {
                return StatusCode(401, "UnAuthorized Access");
            }
        }

        // POST: api/Students
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPost("{userName}")]
        public async Task<ActionResult<Students>> PostStudents(string userName,Students students)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (await _userManager.IsInRoleAsync(user, "Admin"))
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
            else 
            {
                return NoContent(); 
            }
        }

        // DELETE: api/Students/5
        [Authorize]
        [HttpDelete("{userName}/{id}")]
        public async Task<IActionResult> DeleteStudents(string id,string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (await _userManager.IsInRoleAsync(user, "Admin"))
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
            else { return StatusCode(401,"UnAuthorized Access"); }
        }

        private bool StudentsExists(string id)
        {
            return (_context.Students?.Any(e => e.Email == id)).GetValueOrDefault();
        }
    }
}
