using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Capstone_Event_Management.Data;
using Capstone_Event_Management.Models;

namespace Capstone_Event_Management.Controllers
{
    public class ProfessorsMVCController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProfessorsMVCController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: ProfessorsMVC
        public async Task<IActionResult> Index()
        {
              return _context.Professors != null ? 
                          View(await _context.Professors.ToListAsync()) :
                          Problem("Entity set 'ApplicationDbContext.Professors'  is null.");
        }

        // GET: ProfessorsMVC/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null || _context.Professors == null)
            {
                return NotFound();
            }

            var professors = await _context.Professors
                .FirstOrDefaultAsync(m => m.Email == id);
            if (professors == null)
            {
                return NotFound();
            }

            return View(professors);
        }

        // GET: ProfessorsMVC/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: ProfessorsMVC/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ProfessorId,Name,Email,Designation,NormalizedDegree,NormalizedBranch")] Professors professors)
        {
            if (ModelState.IsValid)
            {
                _context.Add(professors);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(professors);
        }

        // GET: ProfessorsMVC/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null || _context.Professors == null)
            {
                return NotFound();
            }

            var professors = await _context.Professors.FindAsync(id);
            if (professors == null)
            {
                return NotFound();
            }
            return View(professors);
        }

        // POST: ProfessorsMVC/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("ProfessorId,Name,Email,Designation,NormalizedDegree,NormalizedBranch")] Professors professors)
        {
            if (id != professors.Email)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(professors);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProfessorsExists(professors.Email))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(professors);
        }

        // GET: ProfessorsMVC/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null || _context.Professors == null)
            {
                return NotFound();
            }

            var professors = await _context.Professors
                .FirstOrDefaultAsync(m => m.Email == id);
            if (professors == null)
            {
                return NotFound();
            }

            return View(professors);
        }

        // POST: ProfessorsMVC/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (_context.Professors == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Professors'  is null.");
            }
            var professors = await _context.Professors.FindAsync(id);
            if (professors != null)
            {
                _context.Professors.Remove(professors);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ProfessorsExists(string id)
        {
          return (_context.Professors?.Any(e => e.Email == id)).GetValueOrDefault();
        }
    }
}
