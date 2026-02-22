using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;
using System.Runtime.Versioning;

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

}