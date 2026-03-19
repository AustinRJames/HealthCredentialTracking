using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;
using System.Runtime.CompilerServices;

namespace HealthcareCredentialTracker.Controllers;

[ApiController] // Tells ASP.NET this class handles API responses, not HTML views
[Route("api/[controller]")] // Automatically maps the route to /api/employees
public class EmployeesController : ControllerBase
{
    private readonly HealthcareContext _context;

    public EmployeesController(HealthcareContext context)
    {
        _context = context;
    }

    // GET: api/employees
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetEmployees()
    {
        var employees = await _context.Employees
            .Include(e => e.Department) 
            .Include(e => e.EmployeeCertifications)
            .ThenInclude(ec => ec.Certification)
            .Select(e => new 
            {
                Id = e.Id,
                
                // (Adjust these to match your actual model properties if needed)
                FirstName = e.FirstName, 
                LastName = e.LastName, 

                Role = e.Role,
                Email = e.Email,
                
                // We grab the Name from the Department object now
                DepartmentId = e.DepartmentId,
                DepartmentName = e.Department != null ? e.Department.Name : "Unassigned",                
                Certifications = e.EmployeeCertifications.Select(ec => new 
                {
                    Id = ec.Certification!.Id,
                    Name = ec.Certification.Name
                }).ToList()
            })
            .ToListAsync();

        return Ok(employees);
    }

    // POST: api/employees
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
    {
        // Add new employee to EF Core's tracking
        _context.Employees.Add(employee);

        // Save change to actual SQL DB
        await _context.SaveChangesAsync();

        // return 201 status and newly crate employee
        return CreatedAtAction(nameof(GetEmployees), new { id = employee.Id }, employee);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        // Find employee in db
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            return NotFound(); // Return 404 if not found
        }

        // Remove employee
        _context.Employees.Remove(employee);

        // Save Changes
        await _context.SaveChangesAsync();

        // Return 204 with no content
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutEmployee(int id, Employee employee)
    {
        if (id != employee.Id) return BadRequest();

        _context.Entry(employee).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

}   
