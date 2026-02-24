using Microsoft.EntityFrameworkCore;
using HealthcareCredentialTracker.Data;
using HealthcareCredentialTracker.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddDbContext<HealthcareContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ICertificationService, CertificationService>(); // Link interface to class


// Build app
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    // app.MapOpenApi();
}
app.UseSwagger();
app.UseSwaggerUI();
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
