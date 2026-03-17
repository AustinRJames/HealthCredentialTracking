using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;
using System.Runtime.Versioning;
using System.Security.Cryptography.X509Certificates;

namespace HealthcareCredentialTracking.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificationsController : ControllerBase
{
    private readonly HealthcareContext _context;
    public CertificationsController (HealthcareContext context)
    {
        _context = context;
    }

    // GET: api/certifications
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Certification>>> GetCertifications()
    {
        return await _context.Certifications.ToListAsync();
    }

    // POST: api/certifications
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

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCertification(int id, Certification cert)
    {
        if (id != cert.Id) return BadRequest("ID does not match cert ID");

        _context.Entry(cert).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

}