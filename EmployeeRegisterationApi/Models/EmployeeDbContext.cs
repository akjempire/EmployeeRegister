using Microsoft.EntityFrameworkCore;

namespace EmployeeRegisterationApi.Models
{
    public class EmployeeDbContext : DbContext
    {
        public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options)
            : base(options)
        {
        }

        public DbSet<EmployeeModel> Employee { get; set; }
    }
}
