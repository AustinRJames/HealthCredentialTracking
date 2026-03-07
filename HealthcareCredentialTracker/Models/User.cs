namespace HealthcareCredentialTracker.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role {get; set; } = "Employee";

        // Link the User acc to their employee profile
        public int? EmployeeId { get; set; }
        public Employee? Employee {get; set; }
    }
}