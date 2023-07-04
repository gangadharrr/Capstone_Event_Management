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
    public class CollegeEventsMVCController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CollegeEventsMVCController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CollegeEventsMVC
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.CollegeEvents.Include(c => c.Clubs);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: CollegeEventsMVC/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.CollegeEvents == null)
            {
                return NotFound();
            }

            var collegeEvents = await _context.CollegeEvents
                .Include(c => c.Clubs)
                .FirstOrDefaultAsync(m => m.EventId == id);
            if (collegeEvents == null)
            {
                return NotFound();
            }

            return View(collegeEvents);
        }

        // GET: CollegeEventsMVC/Create
        public IActionResult Create()
        {
            ViewData["ClubId"] = new SelectList(_context.Clubs, "ClubId", "ClubEmail");
            return View();
        }

        // POST: CollegeEventsMVC/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EventId,ClubId,Name,ResourcePerson,Price,DiscountPrice,ModeOfEvent,StartDateTimeOfEvent,EndDateTimeOfEvent,LastDayToRegister,PosterUrl,AccessLevel,Venue,AvailableSeats")] CollegeEvents collegeEvents)
        {
            if (ModelState.IsValid)
            {
                _context.Add(collegeEvents);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["ClubId"] = new SelectList(_context.Clubs, "ClubId", "ClubEmail", collegeEvents.ClubId);
            return View(collegeEvents);
        }

        // GET: CollegeEventsMVC/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.CollegeEvents == null)
            {
                return NotFound();
            }

            var collegeEvents = await _context.CollegeEvents.FindAsync(id);
            if (collegeEvents == null)
            {
                return NotFound();
            }
            ViewData["ClubId"] = new SelectList(_context.Clubs, "ClubId", "ClubEmail", collegeEvents.ClubId);
            return View(collegeEvents);
        }

        // POST: CollegeEventsMVC/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("EventId,ClubId,Name,ResourcePerson,Price,DiscountPrice,ModeOfEvent,StartDateTimeOfEvent,EndDateTimeOfEvent,LastDayToRegister,PosterUrl,AccessLevel,Venue,AvailableSeats")] CollegeEvents collegeEvents)
        {
            if (id != collegeEvents.EventId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(collegeEvents);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CollegeEventsExists(collegeEvents.EventId))
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
            ViewData["ClubId"] = new SelectList(_context.Clubs, "ClubId", "ClubEmail", collegeEvents.ClubId);
            return View(collegeEvents);
        }

        // GET: CollegeEventsMVC/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.CollegeEvents == null)
            {
                return NotFound();
            }

            var collegeEvents = await _context.CollegeEvents
                .Include(c => c.Clubs)
                .FirstOrDefaultAsync(m => m.EventId == id);
            if (collegeEvents == null)
            {
                return NotFound();
            }

            return View(collegeEvents);
        }

        // POST: CollegeEventsMVC/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.CollegeEvents == null)
            {
                return Problem("Entity set 'ApplicationDbContext.CollegeEvents'  is null.");
            }
            var collegeEvents = await _context.CollegeEvents.FindAsync(id);
            if (collegeEvents != null)
            {
                _context.CollegeEvents.Remove(collegeEvents);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CollegeEventsExists(int id)
        {
          return (_context.CollegeEvents?.Any(e => e.EventId == id)).GetValueOrDefault();
        }
    }
}
