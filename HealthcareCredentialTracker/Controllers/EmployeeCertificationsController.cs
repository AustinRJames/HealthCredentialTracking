using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;
using HealthcareCredentialTracker.Services;


namespace HealthcareCredentialTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeCertificationController : ControllerBase
{
    private readonly HealthcareContext _context;
    private readonly ICertificationService _certService;
    
    public EmployeeCertificationController(HealthcareContext context, ICertificationService certService)
    {
        _context = context;
        _certService = certService;

    }

    // GET: api/EmployeeCertifications
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeCertification>>> GetEmployeeCertifications()
    {
        return await _context.EmployeeCertifications.ToListAsync();
    }

    // POST: api/EmployeeCertifications
    [HttpPost]
    public async Task<ActionResult<EmployeeCertification>> PostEmployeeCertification(EmployeeCertification employeeCertification)
    {
        // Run cert check service
        _certService.UpdateStatus(employeeCertification);

        // Add link to the db
        _context.EmployeeCertifications.Add(employeeCertification);

        try
        {
            // Try to save it
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // DB rejects it (Employee might already have cert)
            // Catch error and return 408 conflict message
            return Conflict("This employee already has this certification");
        }

        // Use OK because the composite keys make automatic url tricky
        return Ok(employeeCertification);
    } 
}