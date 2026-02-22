using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Models;

namespace HealthcareCredentialTracker.Data;

public class HealthcareContext : DbContext
{
    // Ctor accepts config options and pass them to base DbContext class
    public HealthcareContext(DbContextOptions<HealthcareContext> options) : base(options) { }

    // Set up actual tables in Db
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<EmployeeCertification> EmployeeCertifications { get; set; }

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

    }

}