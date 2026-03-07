using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HealthcareCredentialTracker.Data;
using Microsoft.EntityFrameworkCore;

namespace HealthcareCredentialTracker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly HealthcareContext _context;

        public AuthController(IConfiguration configuration, HealthcareContext context)
        {
            _configuration = configuration;
            _context = context;
            
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            //  Ask the Database if this Username exists
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            //  If no user is found, OR if BCrypt says the password doesn't match the hash -> Kick them out!
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password.");
            }

            //  Grab the Secret Key from appsettings.json
            var secretKey = _configuration["Jwt:Key"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //  Create the Claims using the REAL database data!
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role) //  Automatically stamps "Admin" or "Employee" based on SQL
            };

            //  Forge the Token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials);

            var jwtString = new JwtSecurityTokenHandler().WriteToken(token);
            
            return Ok(new { token = jwtString });
        }
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; 
    }
}