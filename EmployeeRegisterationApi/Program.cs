using EmployeeRegisterationApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

namespace EmployeeRegisterationApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Configure SQL Server DbContext
            builder.Services.AddDbContext<EmployeeDbContext>(
                options => options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnectionString")
                )
            );

            // Configure CORS to allow React app
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:5173") // React dev server
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });
            

            var app = builder.Build();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(
             Path.Combine(builder.Environment.ContentRootPath, "Images")),
                RequestPath = "/Images"
            });

            // Enable CORS
            app.UseCors("AllowReactApp");

            app.UseHttpsRedirection();
            app.UseAuthorization();

            // Map controllers (your WeatherForecastController will work)
            app.MapControllers();

            app.Run();
        }
    }
}
