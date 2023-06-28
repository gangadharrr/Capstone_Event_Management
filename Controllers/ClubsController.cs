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
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.IO;
using System.Text.RegularExpressions;
using System.Collections;
using Humanizer;

namespace Capstone_Event_Management.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class ClubsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public Cloudinary cloudinary;
        public ClubsController(ApplicationDbContext context)
        {
            _context = context;
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

        // PUT: api/Clubs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClubs(int id, Clubs clubs)
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
            var dataUrl = clubs.ClubPicture;
            var matchGroups = Regex.Match(dataUrl, @"^data:((?<type>[\w\/]+))?;base64,(?<data>.+)$").Groups;
            var base64Data = matchGroups["data"].Value;
            if (base64Data!="")
            {
                var binData = Convert.FromBase64String(base64Data);
                Stream stream = new MemoryStream(binData);
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription($"Club_{clubs.ClubEmail}_{clubs.Name}_DisplayPicture", stream),
                    PublicId = $"Club_{clubs.ClubEmail}_{clubs.Name}_DisplayPicture",
                    Folder = "Images"

                };
                var uploadResult = cloudinary.Upload(uploadParams);
                var GetResponse = cloudinary.GetResource($"Images/Club_{clubs.ClubEmail}_{clubs.Name}_DisplayPicture");
                Console.WriteLine($"Images/Club_{clubs.ClubEmail}_{clubs.Name}_DisplayPicture" + GetResponse.Url + GetResponse.StatusCode.ToString());
                if (GetResponse.StatusCode.ToString() == "OK")
                {
                    clubs.ClubPicture = GetResponse.Url;
                }
                else
                {
                    throw new Exception("Error in Data Fetching");
                }
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
          if (_context.Clubs == null || _context.Students==null || _context.Professors==null)
          {
              return Problem("Entity set 'ApplicationDbContext.Clubs'  is null.");
          }
            clubs.Students = await _context.Students.FindAsync(clubs.President);
            clubs.Professors = await _context.Professors.FindAsync(clubs.ProfessorIncharge);
            if(clubs.Students ==null || clubs.Professors == null)
            {
                return Problem("Entity set 'Email of student or Professor'  is null.");

            }
            var dataUrl = clubs.ClubPicture;
            var matchGroups = Regex.Match(dataUrl, @"^data:((?<type>[\w\/]+))?;base64,(?<data>.+)$").Groups;
            var base64Data = matchGroups["data"].Value;
            var binData = Convert.FromBase64String(base64Data);
            Stream stream = new MemoryStream(binData);
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription($"Club_{clubs.ClubEmail}_{clubs.Name}_DisplayPicture", stream),
                PublicId = $"Club_{clubs.ClubEmail}_{clubs.Name}_DisplayPicture",
                Folder = "Images"

            };
            var uploadResult = cloudinary.Upload(uploadParams);
            var GetResponse = cloudinary.GetResource($"Images/Club_{clubs.ClubEmail}_{clubs.Name}_DisplayPicture");
            Console.WriteLine($"Images/Club_{clubs.ClubEmail}_{clubs.Name}_DisplayPicture" + GetResponse.Url + GetResponse.StatusCode.ToString());
            if (GetResponse.StatusCode.ToString() == "OK")
            {
                clubs.ClubPicture = GetResponse.Url;
            }
            else
            {
                throw new Exception("Error in Data Fetching");
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
