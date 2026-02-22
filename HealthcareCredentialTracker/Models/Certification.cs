namespace HealthcareCredentialTracker.Models;

public class Certification
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int ValidityPeriodMonth { get; set; }

    public ICollection<EmployeeCertification> EmployeeCertifications { get; set; } = new List<EmployeeCertification>();
}