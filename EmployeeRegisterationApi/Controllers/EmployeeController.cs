using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeRegisterationApi.Models;

namespace EmployeeRegisterationApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public EmployeeController(EmployeeDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Employee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeModel>>> GetEmployee()
        {
            return await _context.Employee
                .Select(x=> new EmployeeModel()
                {
                    EmployeeID=x.EmployeeID,
                    EmployeeName=x.EmployeeName,
                    Occupation=x.Occupation,
                    ImageName=x.ImageName,
                    ImageSrc= string.Format("{0}://{1}{2}/Images/{3}",Request.Scheme, Request.Host, Request.PathBase, x.ImageName)
                })
                .ToListAsync();
        }

        // GET: api/Employee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeModel>> GetEmployeeModel(int id)
        {
            var employeeModel = await _context.Employee.FindAsync(id);

            if (employeeModel == null)
            {
                return NotFound();
            }

            return employeeModel;
        }

        // PUT: api/Employee/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeModel(int id, EmployeeModel employeeModel)
        {
            if (id != employeeModel.EmployeeID)
            {
                return BadRequest();
            }

            _context.Entry(employeeModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Employee
        [HttpPost]
        public async Task<ActionResult<EmployeeModel>> PostEmployeeModel([FromForm] EmployeeModel employeeModel)
        {
            employeeModel.ImageName = await SaveImage(employeeModel.ImageFile);
            _context.Employee.Add(employeeModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployeeModel), new { id = employeeModel.EmployeeID }, employeeModel);

        }

        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployeeModel(int id)
        {
            var employeeModel = await _context.Employee.FindAsync(id);
            if (employeeModel == null)
            {
                return NotFound();
            }

            _context.Employee.Remove(employeeModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeModelExists(int id)
        {
            return _context.Employee.Any(e => e.EmployeeID == id);
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            if (imageFile == null)
                return null;

            string fileNameWithoutExt = Path.GetFileNameWithoutExtension(imageFile.FileName);
            fileNameWithoutExt = new string(fileNameWithoutExt.Take(10).ToArray()).Replace(" ", "-");

            string extension = Path.GetExtension(imageFile.FileName);
            string imageName = fileNameWithoutExt + DateTime.Now.ToString("yymmssfff") + extension;

            string imagesFolder = Path.Combine(_webHostEnvironment.ContentRootPath, "Images");

            if (!Directory.Exists(imagesFolder))
                Directory.CreateDirectory(imagesFolder);

            string imagePath = Path.Combine(imagesFolder, imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName;
        }
    }
}
