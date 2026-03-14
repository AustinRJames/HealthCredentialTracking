namespace HealthcareCredentialTracker.Models;

public class Employee
{
    public int Id { get; set; } 
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set;} = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }
    

    public ICollection<EmployeeCertification> EmployeeCertifications { get; set; } = new List<EmployeeCertification>();
}