using API.Data;
using API.Interface;
using API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors();

builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(x=>
    x.AllowAnyHeader()
     .AllowAnyMethod()
     .WithOrigins("https://localhost:4200", "http://localhost:4200"));

app.MapControllers();

app.Run();
