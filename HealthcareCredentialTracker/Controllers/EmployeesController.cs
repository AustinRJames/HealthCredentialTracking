using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;

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
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
    {
        // Async/await to free up server thread while waiting for db to response
        return await _context.Employees.ToListAsync();
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

}   
