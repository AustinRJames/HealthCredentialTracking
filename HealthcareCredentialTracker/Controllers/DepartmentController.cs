using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;
using Microsoft.AspNetCore.Authorization;

namespace HealthcareCredentialTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require JWT Token to use these actions
    public class DepartmentController : ControllerBase
    {
        private readonly HealthcareContext _context;

        public DepartmentController(HealthcareContext context)
        {
            _context = context;
        }

        // Get all departments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDepartments()
        {
            var departments = await _context.Departments
                .Include(d => d.RequiredCertifications)
                .ThenInclude(dc => dc.Certification)
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    RequiredCerts = d.RequiredCertifications.Select(dc => new
                    {
                        dc.Certification!.Id,
                        dc.Certification!.Name
                    })
                })
                .ToListAsync();

            return Ok(departments);
        }

        // Create a new department
        [HttpPost]
        [Authorize(Roles = "Admin")] // Only admins can create new depts
        public async Task<ActionResult<Department>> CreateDepartment(Department department)
        {
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDepartments), new { id = department.Id }, department);    
        }

        // Assign required cert to a dept 
        [HttpPost("{departmentId}/require-cert/{certId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RequiredCertification (int departmentId, int certId)
        {
            var ruleExists = await _context.DepartmentCertifications
                .AnyAsync(dc => dc.DepartmentId == departmentId && dc.CertificationId == certId);

            if (ruleExists) return BadRequest("This department already requires this certification.");

            var newRule = new DepartmentCertification
            {
                DepartmentId = departmentId,
                CertificationId = certId
            };

            _context.DepartmentCertifications.Add(newRule);
            await _context.SaveChangesAsync();

            return Ok(new {message = "Rule add successfully!"});
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{departmentId}/require-cert/{certId}")]
        public async Task<IActionResult> UnrequireCert(int departmentId, int certId)
        {
            var record = await _context.DepartmentCertifications
                .FirstOrDefaultAsync(dc => dc.DepartmentId == departmentId && dc.CertificationId == certId);

            if (record == null) return NotFound();

            _context.DepartmentCertifications.Remove(record);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Delete: api/departments/id
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            var employees = await _context.Employees
                .Where(emp => emp.DepartmentId == id)
                .ToListAsync();

            foreach (var emp in employees)
            {
                emp.DepartmentId = null;
            }

            // Remove Department
            _context.Departments.Remove(department);

            // Save Changes
            await _context.SaveChangesAsync();

            // Return 204
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartment(int id, Department department)
        {
            if (id != department.Id) return BadRequest();

            _context.Entry(department).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        
    }
}