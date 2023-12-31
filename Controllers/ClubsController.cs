﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Capstone_Event_Management.Data;
using Capstone_Event_Management.Models;
using Microsoft.AspNetCore.Authorization;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.IO;
using System.Text.RegularExpressions;
using System.Collections;
using Humanizer;
using Microsoft.AspNetCore.Identity;
using System.Security.Principal;
using System.Security.Claims;
using System.Data;
using static System.Reflection.Metadata.BlobBuilder;
using static Duende.IdentityServer.Models.IdentityResources;

namespace Capstone_Event_Management.Controllers
{
    
    [Route("[controller]")]
    [ApiController]
    public class ClubsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public Cloudinary cloudinary;

        public ClubsController(ApplicationDbContext context, 
            UserManager<ApplicationUser> userManager
            )
        {
            _context = context;
            _userManager= userManager;
            Environment.SetEnvironmentVariable("CLOUDINARY_URL", "cloudinary://526475314935564:3sqymKRV7iuoERChxKjEEHc7O0A@dujyzevpx");
            cloudinary = new Cloudinary();
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
        [Authorize]
        [HttpGet("{email}/{idd}")]
        public async Task<ActionResult<IEnumerable<Clubs>>> GetClubs(string email,int idd)
        {
            if (_context.Clubs == null)
            {
                return NotFound();
            }
            var user=await _userManager.FindByEmailAsync(email);
            List<Clubs> clubs=null;
            if(user != null && await _userManager.IsInRoleAsync(user,"Admin"))
            {
                 clubs = await _context.Clubs.ToListAsync();
            }
            else
            {

                 clubs = await _context.Clubs.Where(e=>e.President==email).ToListAsync();
            }

            if (clubs == null)
            {
                return NotFound();
            }

            return clubs;
        }

        // PUT: api/Clubs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{userName}/{id}")]
        public async Task<IActionResult> PutClubs(int id,string userName,Clubs clubs)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (await _userManager.IsInRoleAsync(user, "Admin") || userName==clubs.President.Split('@').FirstOrDefault())
            {
                if (id != clubs.ClubId)
                {
                    return BadRequest();
                }
                clubs.Students = await _context.Students.FindAsync(clubs.President);
                clubs.Professors = await _context.Professors.FindAsync(clubs.ProfessorIncharge);
                if (clubs.Students == null || clubs.Professors == null)
                {
                    return Problem("Entity set 'Email of student or Professor'  is null.");

                }
                _context.Entry(clubs).State = EntityState.Modified;


                try
                {
                    await _context.SaveChangesAsync();
                    await AssignRole();
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
            else
            {
                return StatusCode(401, "UnAuthorized Access");
            }
        }
        private async Task<int> AssignRole()
        {
            var presidents = await _userManager.GetUsersInRoleAsync("President");
            if(presidents != null)
            {
                var presidentEmails=presidents.Select(x => x.Email).ToList();
                var _clubsEmails =  _context.Clubs.Select(e=>e.President).ToList();
                var emailsIntersection=presidentEmails.Intersect(_clubsEmails);
                foreach (var email in _clubsEmails) 
                {
                    if(!emailsIntersection.Contains(email))
                    {
                        var _userCurrentPresident = await _userManager.FindByEmailAsync(email);
                        if (_userCurrentPresident != null )
                        {
                            IdentityResult roleresult = await _userManager.AddToRoleAsync(_userCurrentPresident, "President");
                        }
                    }
                }
                foreach(var email in presidentEmails)
                {
                    if(!emailsIntersection.Contains(email))
                    {
                        var _userPreviousPresident = await _userManager.FindByEmailAsync(email);

                        if (_userPreviousPresident != null)
                        {
                            await _userManager.RemoveFromRoleAsync(_userPreviousPresident, "President");
                        }
                    }
                }
           
            }
            else
            {
                var _clubsEmails = _context.Clubs.Select(e => e.President).ToList();
                foreach(var email in _clubsEmails)
                {

                    var _userCurrentPresident = await _userManager.FindByEmailAsync(email);
                    if (_userCurrentPresident != null)
                    {
                        IdentityResult roleresult = await _userManager.AddToRoleAsync(_userCurrentPresident, "President");
                    }
                }
            }
            _context.SaveChanges();
            return 0;
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<Clubs>> PutClubsWithSeats(int id,Clubs clubs)
        {
                if (id != clubs.ClubId)
                {
                    return BadRequest();
                }
                clubs.Students = await _context.Students.FindAsync(clubs.President);
                clubs.Professors = await _context.Professors.FindAsync(clubs.ProfessorIncharge);
                if (clubs.Students == null || clubs.Professors == null)
                {
                    return Problem("Entity set 'Email of student or Professor'  is null.");

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
        [Authorize]
        [HttpPost("{userName}")]
        public async Task<ActionResult<Clubs>> PostClubs(string userName,Clubs clubs)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (await _userManager.IsInRoleAsync(user, "Admin"))
            {
                if (_context.Clubs == null || _context.Students == null || _context.Professors == null)
                {
                    return Problem("Entity set 'ApplicationDbContext.Clubs'  is null.");
                }
                clubs.Students = await _context.Students.FindAsync(clubs.President);
                clubs.Professors = await _context.Professors.FindAsync(clubs.ProfessorIncharge);
                if (clubs.Students == null || clubs.Professors == null)
                {
                    return Problem("Entity set 'Email of student or Professor'  is null.");

                }
                _context.Clubs.Add(clubs);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetClubs", new { id = clubs.ClubId }, clubs);
            }
            else
            {
                return StatusCode(401, "UnAuthorized Access");
            }
        }

        // DELETE: api/Clubs/5
        [Authorize]
        [HttpDelete("{userName}/{id}")]
        public async Task<IActionResult> DeleteClubs(int id,string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if( await _userManager.IsInRoleAsync(user, "Admin"))
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
            else
            {
                return StatusCode(401, "UnAuthorized Access");
            }
        }

        private bool ClubsExists(int id)
        {
            return (_context.Clubs?.Any(e => e.ClubId == id)).GetValueOrDefault();
        }
    }
}
