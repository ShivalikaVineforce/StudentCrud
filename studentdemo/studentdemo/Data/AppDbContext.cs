using Microsoft.EntityFrameworkCore;
using studentdemo.Models;

namespace studentdemo.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentClass> StudentClasses { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<AddressCategory> AddressCategory { get; set; }
        public DbSet<Country> Countries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            try
            {
                // Relationship: Student -> Address
                modelBuilder.Entity<Address>()
                    .HasOne(a => a.Student)
                    .WithMany(s => s.Addresses)
                    .HasForeignKey(a => a.StudentId)
                     .OnDelete(DeleteBehavior.Cascade); 

                // Relationship: AddressCategory -> Address
                modelBuilder.Entity<Address>()
                    .HasOne(a => a.AddressCategory)
                    .WithMany(ac => ac.Addresses)
                    .HasForeignKey(a => a.AddressCategoryId);

                // Relationship: Country -> Address
                modelBuilder.Entity<Address>()
                    .HasOne(a => a.Country)
                    .WithMany(c => c.Addresses)
                    .HasForeignKey(a => a.CountryId);

                // Relationship: Student -> StudentClass
                modelBuilder.Entity<Student>()
                    .HasOne(s => s.Class)
                    .WithMany(sc => sc.Students)
                    .HasForeignKey(s => s.ClassId);
            }
            catch(Exception ced)
            {

            }
            }

    }
}