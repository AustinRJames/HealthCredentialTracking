using HealthcareCredentialTracker.Models;

namespace HealthcareCredentialTracker.Services;

public interface ICertificationService
{
    void UpdateStatus(EmployeeCertification cert);
}