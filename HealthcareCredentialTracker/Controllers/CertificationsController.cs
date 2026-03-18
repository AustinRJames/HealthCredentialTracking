using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;
using Microsoft.AspNetCore.Authorization;
using HealthcareCredentialTracker.Services;
using System.Security.Cryptography.X509Certificates;
using System.Reflection.Metadata;

namespace HealthcareCredentialTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificationsController : ControllerBase
{
    private readonly HealthcareContext _context;
    private readonly ICertificationService _certificationService;
    public CertificationsController (HealthcareContext context, ICertificationService certificationService)
    {
        _context = context;
        _certificationService = certificationService;
    }

    // GET: api/certifications
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Certification>>> GetCertifications()
    {
        return await _context.Certifications.ToListAsync();
    }

    // POST: api/certifications
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Certification>> PostCertifications(Certification certification)
    {
        // Add new cert to EF Core's tracking
        _context.Certifications.Add(certification);

        // Save change to actual DB
        await _context.SaveChangesAsync();

        // Return 201 status and newly created cert
        return CreatedAtAction(nameof(GetCertifications), new { id = certification.Id }, certification);
    }

    // Delete: api/certifications//id
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCertification(int id)
    {
        var certification = await _context.Certifications.FindAsync(id);

        if (certification == null)
        {
            return NotFound();
        }

        // Remove Cert
        _context.Certifications.Remove(certification);

        // Save Changes
        await _context.SaveChangesAsync();

        // Return 204
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCertification(int id, Certification cert)
    {
        if (id != cert.Id) return BadRequest("ID does not match cert ID");

        _context.Entry(cert).State = EntityState.Modified;

        // Recalc status for all employees have this cert
        var employeesCerts = await _context.EmployeeCertifications
            .Where(ec => ec.CertificationId == id)
            .Include(ec => ec.Certification)
            .ToListAsync();

        foreach (var ec in employeesCerts)
        {
            _certificationService.UpdateStatus(ec);
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }
}