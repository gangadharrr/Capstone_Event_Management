﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Capstone_Event_Management.Models;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using CloudinaryDotNet.Actions;
using static System.Net.WebRequestMethods;

namespace Capstone_Event_Management.Areas.Identity.Pages.Account.Manage
{
    public class IndexModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public Cloudinary cloudinary;

        public IndexModel(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            Environment.SetEnvironmentVariable("CLOUDINARY_URL", "cloudinary://526475314935564:3sqymKRV7iuoERChxKjEEHc7O0A@dujyzevpx");

            cloudinary = new Cloudinary();
        }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [TempData]
        public string StatusMessage { get; set; }

        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        [BindProperty]
        public InputModel Input { get; set; }

        public string profilePicture;
        /// <summary>
        ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
        ///     directly from your code. This API may change or be removed in future releases.
        /// </summary>
        public class InputModel
        {
            /// <summary>
            ///     This API supports the ASP.NET Core Identity default UI infrastructure and is not intended to be used
            ///     directly from your code. This API may change or be removed in future releases.
            /// </summary>
            [Phone]
            [Display(Name = "Phone number")]
            public string PhoneNumber { get; set; }
            public string ProfilePicture { get; set; }
        }

        private async Task LoadAsync(ApplicationUser user)
        {
            var userName = await _userManager.GetUserNameAsync(user);
            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);

            Username = userName;
            profilePicture = user.ProfileUrl;
            
            Input = new InputModel
            {
                PhoneNumber = phoneNumber
            };
        }

        public async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            await LoadAsync(user);
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            if (!ModelState.IsValid)
            {
                await LoadAsync(user);
                return Page();
            }

            var phoneNumber = await _userManager.GetPhoneNumberAsync(user);
            if (Input.PhoneNumber != phoneNumber && Input.PhoneNumber != null)
            {
                var setPhoneResult = await _userManager.SetPhoneNumberAsync(user, Input.PhoneNumber);
                if (!setPhoneResult.Succeeded)
                {
                    StatusMessage = "Unexpected error when trying to set phone number.";
                    return RedirectToPage();
                }
            }
            var profilePicture = await _userManager.GetUserNameAsync(user) + ".jpg";
            if (Request.Form.Files.Count != 0 && Request.Form.Files[0].FileName != profilePicture)
            {
                try
                {
                    using var stream = this.Request.Form.Files[0].OpenReadStream();
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(this.Request.Form.Files[0].FileName, stream),
                        PublicId= user.UserName,
                        Folder = "Images"
                    };
                    var uploadResult = cloudinary.Upload(uploadParams);
                    //var fileName = this.Request.Form.Files[0].FileName.Split('\\').LastOrDefault().Split('/').LastOrDefault();
                    //var filePath = Path.Combine("cloudinary://526475314935564:3sqymKRV7iuoERChxKjEEHc7O0A@dujyzevpx/",profilePicture);

                    //using (var stream = System.IO.File.Create(filePath))
                    //{
                    //    this.Request.Form.Files[0].CopyTo(stream);
                    //}
                    var GetResponse = cloudinary.GetResource($"Images/{user.UserName}");
                    Console.WriteLine($"Images/{user.UserName}"+GetResponse.Url+GetResponse.StatusCode.ToString());
                    if (GetResponse.StatusCode.ToString() == "OK")
                    {
                        profilePicture = GetResponse.Url;
                    }
                    else
                    {
                        throw new Exception("Error in Data Fetching");
                    }

                    user.ProfileUrl = profilePicture;
                    var setProfileUpdateCountResult = await _userManager.UpdateAsync(user);
                    if (!setProfileUpdateCountResult.Succeeded)
                    {
                        StatusMessage = "Unexpected error when trying to set phone number.";
                        return RedirectToPage();
                    }
                    StatusMessage = "File uploaded";

                }
                catch (Exception exception)
                {
                    StatusMessage = "Error uploading the file"+$"({exception.Message})";
                    Console.WriteLine(exception.Message);

                }
                return RedirectToPage();

            }

            await _signInManager.RefreshSignInAsync(user);
            StatusMessage = "Your profile has been updated";
            return RedirectToPage();
        }
    }
}
