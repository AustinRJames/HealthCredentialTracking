namespace HealthcareCredentialTracker.Models
{
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Department has many employees and many certs
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public ICollection<DepartmentCertification> RequiredCertifications { get; set; } = new List<DepartmentCertification>();
    }
}