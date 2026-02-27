using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;
using HealthcareCredentialTracker.Services;
using System.Security.Cryptography;


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
        return await _context.EmployeeCertifications
            .Include(ec => ec.Employee) // JOIN employee table
            .Include(ec => ec.Certification) // JOIN cert table
            .ToListAsync();
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

    // Delete: api/EmployeeCertifications/empId/certId
    [HttpDelete("{employeeId}/{certificationId}")]
    public async Task<IActionResult> RevokeCertification(int employeeId, int certificationId)
    {
        // Look for exact combination of Employee + Cert
        var employeeCert = await _context.EmployeeCertifications.FirstOrDefaultAsync(ec => ec.EmployeeId == employeeId && ec.CertificationId == certificationId);

        if (employeeCert == null)
        {
            return NotFound();
        }

        _context.EmployeeCertifications.Remove(employeeCert);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}