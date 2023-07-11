using Capstone_Event_Management.Models;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Capstone_Event_Management.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
        }
        public DbSet<Students> Students { get; set; }
        public DbSet<Professors> Professors { get; set;}
        public DbSet<Clubs> Clubs { get; set; }
        public DbSet<ClubMembers> ClubMembers { get; set; }
        public DbSet<Subscriptions> Subscriptions { get; set; }
        public DbSet<CollegeEvents> CollegeEvents { get; set; }
        public DbSet<EventRegistrations> EventRegistrations { get; set; }
        public DbSet<EventUpdates> EventUpdates { get; set; }
        
    }
}