using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Models;
using System.Runtime.CompilerServices;

namespace HealthcareCredentialTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly HealthcareContext _context;

    public UserController(HealthcareContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> RegisterUser(CreateUserDto dto)
    {
        // Check if employee exists
        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Email == dto.Email);
        if (employee == null) return NotFound("Employee not found");

        // Check if username is taken
        var exists = await _context.Users.AnyAsync(u => u.Username == dto.Username);
        if (exists) return BadRequest("Username already taken");

        // Create the user
        var user = new User
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Employee",
            EmployeeId = employee.Id
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var username = User.Identity?.Name;

        var user = await _context.Users
            .Include(u => u.Employee)
                .ThenInclude(e => e!.EmployeeCertifications)
                    .ThenInclude(ec => ec.Certification)
            .Include(u => u.Employee)
                .ThenInclude(e=> e!.Department)
                    .ThenInclude(d => d!.RequiredCertifications)
                        .ThenInclude(dc => dc.Certification)
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null || user.Employee == null) return NotFound();

        var emp = user.Employee;

        return Ok(new
        {
            emp.FirstName,
            emp.LastName,
            emp.Email,
            emp.Role,
            DepartmentName = emp.Department != null ? emp.Department.Name : "Unassigned",
            Certifications = emp.EmployeeCertifications.Select(ec => new
            {
                ec.Certification!.Name,
                ec.DateCompleted,
                ec.ExpirationDate,
                ec.Status
            }).ToList(),
            RequiredCertifications = emp.Department?.RequiredCertifications.Select(dc => new
            {
                dc.Certification!.Name
            }).ToList()
        });
    }

    public class CreateUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; 
    }
}