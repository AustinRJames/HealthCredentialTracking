using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Models;
using System.Data.Common;

namespace HealthcareCredentialTracker.Data;

public class HealthcareContext : DbContext
{
    // Ctor accepts config options and pass them to base DbContext class
    public HealthcareContext(DbContextOptions<HealthcareContext> options) : base(options) { }

    // Set up actual tables in Db
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<EmployeeCertification> EmployeeCertifications { get; set; }

    public DbSet<User> Users { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<DepartmentCertification> DepartmentCertifications { get; set;}

    // Override default database schema generation
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Config Composite primary key for the Join Table. Employees can only have cert once so both are unique
        modelBuilder.Entity<EmployeeCertification>()
            .HasKey(ec => new { ec.EmployeeId, ec.CertificationId});

        // Config the one to many relationship (Employee -> Employee Certs)
        modelBuilder.Entity<EmployeeCertification>()
            .HasOne(ec => ec.Employee)
            .WithMany(e => e.EmployeeCertifications)
            .HasForeignKey(ec => ec.EmployeeId);

        // Config one to many relationship (Cert -> EmployeeCerts)
        modelBuilder.Entity<EmployeeCertification>()
            .HasOne(ec => ec.Certification)
            .WithMany(e => e.EmployeeCertifications)
            .HasForeignKey(ec => ec.CertificationId);

        // Config Composite key for dept rules join table
        modelBuilder.Entity<DepartmentCertification>()
            .HasKey(dc => new { dc.DepartmentId, dc.CertificationId});

        // Seed admin user so we aren't locked out
        var adminHash  = "$2a$10$kypbnGGCpJ7UQlysnqzJG.6H.dUewn7UPVWA3Ip.E.8U4jlVnFNnu";

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = adminHash,
                Role = "Admin"
            }
        );

    }

}