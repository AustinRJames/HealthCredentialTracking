namespace HealthcareCredentialTracker.Models
{
    public class DepartmentCertification
    {
        public int DepartmentId { get; set; }
        public Department? Department{ get; set; }
        
        public int CertificationId { get; set; }
        public Certification? Certification{ get; set; }
    }
}