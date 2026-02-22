namespace HealthcareCredentialTracker.Models;

public class EmployeeCertification
{
    public int EmployeeId { get; set; }
    public Employee? Employee { get; set; }

    public int CertificationId { get; set; }
    public Certification? Certification { get; set; }

    public DateTime DateCompleted { get; set; } 
    public DateTime ExpirationDate { get; set; }

    public CertificationStatus Status { get; set; }
}