// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Capstone_Event_Management.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;
using Capstone_Event_Management.Data;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace Capstone_Event_Management.Areas.Identity.Pages.Account
{
    public class ConfirmEmailModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<RegisterModel> _logger;
        private readonly IEmailSender _emailSender;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public ConfirmEmailModel(
           UserManager<ApplicationUser> userManager,
           SignInManager<ApplicationUser> signInManager,
           ILogger<RegisterModel> logger,
           RoleManager<IdentityRole> roleManager,
           ApplicationDbContext context,
           IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _roleManager = roleManager;
            _emailSender = emailSender;
            _context = context;
        }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [TempData]
        public string StatusMessage { get; set; }
        public async Task<IActionResult> OnGetAsync(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return RedirectToPage("/Index");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{userId}'.");
            }

            code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code));
            var result = await _userManager.ConfirmEmailAsync(user, code);
            StatusMessage = result.Succeeded ? "Thank you for confirming your email." : "Error confirming your email.";
            if (ModelState.IsValid)
            {
                var _professor = _context.Professors.Find(user.Email);
                var _student = _context.Students.Find(user.Email);
                if (_professor != null)
                {
                    var role = _context.Roles.Find("Professor");
                    var defaultrole1 = _roleManager.FindByNameAsync(role.Name).Result;
                    if (defaultrole1 != null)
                    {
                        IdentityResult roleresult = await _userManager.AddToRoleAsync(user, defaultrole1.Name);
                    }
                    var defaultrole = _roleManager.FindByNameAsync("Member").Result;
                    if (defaultrole != null)
                    {
                        IdentityResult roleresult = await _userManager.AddToRoleAsync(user, defaultrole.Name);
                    }
                }
                else if (_student != null)
                {
                    var defaultrole1 = _roleManager.FindByNameAsync("Student").Result;
                    if (defaultrole1 != null)
                    {
                        IdentityResult roleresult = await _userManager.AddToRoleAsync(user, defaultrole1.Name);
                    }
                    var defaultrole = _roleManager.FindByNameAsync("Member").Result;
                    if (defaultrole != null)
                    {
                        IdentityResult roleresult = await _userManager.AddToRoleAsync(user, defaultrole.Name);
                    }
                }
                else
                {
                    var defaultrole = _roleManager.FindByNameAsync("Member").Result;
                    if (defaultrole != null)
                    {
                        IdentityResult roleresult = await _userManager.AddToRoleAsync(user, defaultrole.Name);
                    }
                }
                if(_context.Clubs.Select((e) => e.President).ToList().Contains(user.Email))
                {
                    var defaultrole = _roleManager.FindByNameAsync("President").Result;
                    if (defaultrole != null)
                    {
                        IdentityResult roleresult = await _userManager.AddToRoleAsync(user, defaultrole.Name);
                    }
                }

            }
            return Page();
        }
    }
}
