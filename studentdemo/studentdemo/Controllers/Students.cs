using System.Diagnostics.Metrics;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentdemo.Data;
using studentdemo.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace studentdemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Students : ControllerBase
    {
        private readonly AppDbContext _context;

        public Students(AppDbContext context)
        {
            try { _context = context; } 
            catch(Exception ce) {
            
            
            
            }
           
        }

        

        [HttpPost("Addstudent")]
        public async Task<ActionResult<Student>> AddStudent([FromBody] Student studentDto)
        {


            var student = new Student
            {
                FirstName = studentDto.FirstName,
                LastName = studentDto.LastName,
                Email = studentDto.FirstName,
                ClassId = studentDto.ClassId,
                DateOfBirth = studentDto.DateOfBirth
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            foreach (var address in studentDto.Addresses)
            {


                address.StudentId = student.StudentId;
                _context.Addresses.AddAsync(address);
            }


            await _context.SaveChangesAsync();


            return Ok();
        }

        

      

        [HttpPost("AddStudentsInfo")]
        public async Task<ActionResult<Student>> AddStudentsInfo([FromBody] Student student)


        {
            if (student == null)
                return BadRequest("Student cannot be null.");


            try
            {
                var student1 = new Student
                {
                    FirstName = student.FirstName,
                    LastName = student.LastName,
                    Email = student.Email,
                    ClassId = student.ClassId,
                    DateOfBirth = student.DateOfBirth,

                    Addresses = new List<Address>()
                        
                 };

                foreach (var addressDto in student.Addresses)
                {
                    var address = new Address
                    {
                        Addressline1 = addressDto.Addressline1, // Use dynamic address data
                        Addressline2 = addressDto.Addressline2,
                        Addressline3 = addressDto.Addressline3,
                        City = addressDto.City,
                        State = addressDto.State,
                        PostalCode = addressDto.PostalCode,
                        CountryId = addressDto.CountryId, // Use countryId dynamically fetched or passed
                        AddressCategoryId = addressDto.AddressCategoryId // Use address category id fetched dynamically or passed
                    };

                    // Add the address to the student's address list
                    student1.Addresses.Add(address);


                }
                ;

                _context.Students.Add(student1);
                await _context.SaveChangesAsync();

                return Ok();
                //return CreatedAtAction(nameof(AddStudentsInfo), new { id = student1.StudentId }, student1);


            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine("ERROR: " + ex.InnerException?.Message);
                return StatusCode(500, "An error occurred while saving the student.");

            }
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.Addresses)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }
       


      
        [HttpPut("UpdateStudent")]
        public async Task<IActionResult> UpdateStudent([FromBody] Student studentDto)
        {
            try
            {
                var existingStudent = await _context.Students
                    .Include(s => s.Addresses)
                    .FirstOrDefaultAsync(s => s.StudentId == studentDto.StudentId);

                if (existingStudent == null)
                    return NotFound();

                // Update basic fields
                existingStudent.FirstName = studentDto.FirstName;
                existingStudent.LastName = studentDto.LastName;
                existingStudent.Email = studentDto.Email;
                existingStudent.DateOfBirth = studentDto.DateOfBirth;
                existingStudent.ClassId = studentDto.ClassId;

                // === Remove old addresses safely ===
                if (existingStudent.Addresses != null && existingStudent.Addresses.Any())
                {
                    _context.Addresses.RemoveRange(existingStudent.Addresses);
                    await _context.SaveChangesAsync(); // Ensure they are removed from the tracking
                }

                // === Add new addresses ===
                var newAddresses = new List<Address>();
                foreach (var addr in studentDto.Addresses)
                {
                    // Detach navigation props to avoid tracking issues
                    addr.Id = 0; // Treat it as a new record
                    addr.StudentId = existingStudent.StudentId;
                    addr.Student = null;
                    addr.Country = null;
                    addr.AddressCategory = null;

                    newAddresses.Add(addr);
                }

                existingStudent.Addresses = newAddresses;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine("ERROR: " + ex.InnerException?.Message);
                return StatusCode(500, "An error occurred while saving the student.");
            }
        }


        [HttpDelete("DeleteStudent/{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.Addresses)
                .FirstOrDefaultAsync(s => s.StudentId == id);

            if (student == null)
                return NotFound();

            _context.Students.Remove(student); // EF will also delete related Addresses
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("GetStudents")]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            var students = await _context.Students
                .Include(s => s.Class)
                .Include(s => s.Addresses)
                    .ThenInclude(a => a.Country)
                .Include(s => s.Addresses)
                    .ThenInclude(a => a.AddressCategory)
                .ToListAsync();

            return Ok(students);
        }

        //[HttpGet("GetStudentsSearch")]
        //public async Task<IActionResult> GetStudents([FromQuery] StudentQueryParameters queryParams)
        //{
        //    var query = _context.Students
        //        .Include(s => s.Addresses)
        //        .AsQueryable();

        //    // Filter by SearchTerm
        //    if (!string.IsNullOrWhiteSpace(queryParams.SearchTerm))
        //    {
        //        string searchTerm = queryParams.SearchTerm.ToLower();
        //        query = query.Where(s =>
        //            s.FirstName.ToLower().Contains(searchTerm) ||
        //            s.LastName.ToLower().Contains(searchTerm) ||
        //            s.Email.ToLower().Contains(searchTerm));
        //    }

        //    // Total count before pagination (for frontend pagination controls)
        //    var totalCount = await query.CountAsync();

        //    // Apply pagination
        //    var students = await query
        //        .OrderBy(s => s.FirstName) // Optional: for consistent ordering
        //        .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
        //        .Take(queryParams.PageSize)
        //        .ToListAsync();

        //    // Create DTOs
        //    //var result = students.Select(s => new StudentDto
        //    //{
        //    //    Student = s
        //    //   // Addresses = s.Addresses ?? new List<Address>()
        //    //}).ToList();

        //    return Ok(new
        //    {
        //        TotalCount = totalCount,
        //        PageNumber = queryParams.PageNumber,
        //        PageSize = queryParams.PageSize,
        //        //
        //      //  Students = result
        //        Students = students
        //    });
        //}
        [HttpGet("GetStudentsSearch")]
        public async Task<IActionResult> GetStudents([FromQuery] StudentQueryParameters queryParams)
        {
            var query = _context.Students
                .Include(s => s.Addresses)
                .AsQueryable();

            // Filter by SearchTerm

            // Filter by name (first or last)
            if (!string.IsNullOrWhiteSpace(queryParams.Name))
            {
                var name = queryParams.Name.ToLower();
                query = query.Where(s =>
                    s.FirstName.ToLower().Contains(name) ||
                    s.LastName.ToLower().Contains(name));
            }

            // Filter by email
            if (!string.IsNullOrWhiteSpace(queryParams.Email))
            {
                var email = queryParams.Email.ToLower();
                query = query.Where(s => s.Email.ToLower().Contains(email));
            }

            // Total count before pagination (for frontend pagination controls)
            var totalCount = await query.CountAsync();

            // Apply pagination
            var students = await query
                .OrderBy(s => s.FirstName) // Optional: for consistent ordering
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            // Create DTOs
            //var result = students.Select(s => new StudentDto
            //{
            //    Student = s
            //   // Addresses = s.Addresses ?? new List<Address>()
            //}).ToList();

            return Ok(new
            {
                TotalCount = totalCount,
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
                //
                //  Students = result
                Students = students
            });
        }



        [HttpGet("StudentsInfo")]
        public async Task<ActionResult<IEnumerable<StudentDto>>> GetStudentsInfo(int studentId)
        {
            var result = await _context.Students
                .Where(student => student.StudentId == studentId)
                .Include(s => s.Addresses)
                    .ThenInclude(a => a.Country)
                .Include(s => s.Addresses)
                    .ThenInclude(a => a.AddressCategory)
                .Select(student => new StudentDto
                {
                    Student = new Student
                    {
                        StudentId = student.StudentId,
                        FirstName = student.FirstName,
                        LastName = student.LastName,
                        Email = student.Email,
                        DateOfBirth = student.DateOfBirth,
                        ClassId = student.ClassId
                        // You can add ClassName if you include it above
                    },
                    Addresses = student.Addresses.Select(address => new Address
                    {
                        Id = address.Id,
                        Addressline1 = address.Addressline1,
                        Addressline2 = address.Addressline2,
                        Addressline3 = address.Addressline3,
                        City = address.City,
                        State = address.State,
                        PostalCode = address.PostalCode,

                        CountryId = address.Country != null ? address.Country.Id : 0,
                        AddressCategoryId = address.AddressCategoryId,
                        Country = new Country
                        {
                            Id = address.Country.Id,
                            CountryName = address.Country.CountryName
                        },
                        AddressCategory = new AddressCategory
                        {
                            Id = address.AddressCategory.Id,
                            AddressCategoryName = address.AddressCategory.AddressCategoryName
                        }
                    }).ToList()
                })
                .ToListAsync();

            return Ok(result);
        }


    }
}