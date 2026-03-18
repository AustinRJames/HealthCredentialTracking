using HealthcareCredentialTracker.Models;

namespace HealthcareCredentialTracker.Services;

public class CertificationService : ICertificationService
{
    public void UpdateStatus(EmployeeCertification cert)
    {
        // Recalc expiration date from completion date + validity period
        if (cert.Certification != null)
        {
            cert.ExpirationDate = cert.DateCompleted
                .AddMonths(cert.Certification.ValidityPeriodMonth);
        }

        var today = DateTime.Today;
        var daysUntilExpiration = (cert.ExpirationDate - today).TotalDays;

        if (daysUntilExpiration <= 0)
            cert.Status = CertificationStatus.Expired;
        else if (daysUntilExpiration <= 30)
            cert.Status = CertificationStatus.ExpiringSoon;
        else
            cert.Status = CertificationStatus.Valid;

    }
}