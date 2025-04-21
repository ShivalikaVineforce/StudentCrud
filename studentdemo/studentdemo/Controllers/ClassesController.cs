using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentdemo.Data;
using studentdemo.Models;

namespace studentdemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClassesController(AppDbContext context) => _context = context;

        [HttpGet]
        [Route("GetClasses")]
        public async Task<ActionResult<List<StudentClass>>> GetClasses() =>
            await _context.StudentClasses.ToListAsync();



        [HttpPost]
        [Route("AddClasses")]
        public async Task<ActionResult<StudentClass>> AddClasses(StudentClass classes)
        {
            _context.StudentClasses.Add(classes);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetClasses), new { id = classes.Id }, classes);
        }
    }
    }

