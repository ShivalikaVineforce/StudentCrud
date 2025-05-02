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
            catch (Exception ce)
            {



            }

        }
        [HttpPost("AddStudentsInfo")]
        public async Task<ActionResult<Student>> AddStudentsInfo([FromBody] Student student)


        {
            if (student == null)
                throw new UserFriendlyException("Student information is missing.");


            try
            {
                if (student.DateOfBirth == default)
                    throw new UserFriendlyException("Date of birth cannot be empty.");

                if (string.IsNullOrWhiteSpace(student.FirstName))
                    throw new UserFriendlyException("First name is required.");

                if (string.IsNullOrWhiteSpace(student.LastName))
                    throw new UserFriendlyException("Last name is required.");

                if (student.ClassId == 0)
                    throw new UserFriendlyException("Please select a class.");

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
                        Addressline1 = addressDto.Addressline1, 
                        Addressline2 = addressDto.Addressline2,
                        Addressline3 = addressDto.Addressline3,
                        City = addressDto.City,
                        State = addressDto.State,
                        PostalCode = addressDto.PostalCode,
                        CountryId = addressDto.CountryId, 
                        AddressCategoryId = addressDto.AddressCategoryId 
                    };

                 
                    student1.Addresses.Add(address);


                }
                ;
                if (!student1.Addresses.Any())
                    throw new UserFriendlyException("Please provide at least one valid address.");


                _context.Students.Add(student1);
                await _context.SaveChangesAsync();
               
                return Ok(student1);

            }
            catch (UserFriendlyException uex)
            {
                return BadRequest(new { message = uex.Message });
            }
            catch (DbUpdateException dbex)
            {
                Console.WriteLine("DB ERROR: " + dbex.InnerException?.Message);
                return StatusCode(500, new { message = "A database error occurred while saving the student." });
            }
            catch (Exception ex)
            {
                Console.WriteLine("UNHANDLED: " + ex.Message);
                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
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
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
               

                if (studentDto == null)
                    throw new UserFriendlyException("Student data is missing.");

                if (studentDto.DateOfBirth == default)
                    throw new UserFriendlyException("Date of birth cannot be empty.");

                if (string.IsNullOrWhiteSpace(studentDto.FirstName))
                    throw new UserFriendlyException("First name is required.");

                if (string.IsNullOrWhiteSpace(studentDto.LastName))
                    throw new UserFriendlyException("Last name is required.");

                if (studentDto.ClassId == 0)
                    throw new UserFriendlyException("Please select a class.");


               var  existingStudent = await _context.Students
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

               
                if (existingStudent.Addresses != null && existingStudent.Addresses.Any())
                {
                    _context.Addresses.RemoveRange(existingStudent.Addresses);
                    await _context.SaveChangesAsync(); // Ensure they are removed from the tracking
                }

              
                var newAddresses = new List<Address>();
                foreach (var addr in studentDto.Addresses)
                {
                   
                    addr.Id = 0;
                    addr.StudentId = existingStudent.StudentId;
                    addr.Student = null;
                    addr.Country = null;
                    addr.AddressCategory = null;

                    newAddresses.Add(addr);
                }
                if (!newAddresses.Any())
                    throw new UserFriendlyException("Please provide at least one valid address.");

                existingStudent.Addresses = newAddresses;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (UserFriendlyException uex)
            {
                return BadRequest(new { message = uex.Message });
            }
            catch (DbUpdateException dbex)
            {
                Console.WriteLine("DB ERROR: " + dbex.InnerException?.Message);
                return StatusCode(500, new { message = "A database error occurred while updating the student." });
            }
            catch (Exception ex)
            {
                Console.WriteLine("UNHANDLED ERROR: " + ex.Message);
                return StatusCode(500, new { message = "An unexpected error occurred. Please try again later." });
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

            _context.Students.Remove(student); 
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

        [HttpGet("GetStudentsSearch")]
        public async Task<IActionResult> GetStudents([FromQuery] StudentQueryParameters queryParams)
        {
            var query = _context.Students
                .Include(s => s.Class)
                .Include(s => s.Addresses)
                    .ThenInclude(a => a.Country)
                .Include(s => s.Addresses)
                    .ThenInclude(a => a.AddressCategory)
                .AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(queryParams.searchTerm))
            {
                var name = queryParams.searchTerm.ToLower();
                query = query.Where(s =>
                    s.FirstName.ToLower().Contains(name) ||
                    s.LastName.ToLower().Contains(name) ||
                    s.Email.ToLower().Contains(name));
            }

            // Sorting
            if (!string.IsNullOrEmpty(queryParams.sortColumn))
            {
                bool ascending = queryParams.sortDirection?.ToLower() != "desc";

                query = queryParams.sortColumn.ToLower() switch
                {
                    "firstname" => ascending ? query.OrderBy(s => s.FirstName) : query.OrderByDescending(s => s.FirstName),
                    "lastname" => ascending ? query.OrderBy(s => s.LastName) : query.OrderByDescending(s => s.LastName),
                    "email" => ascending ? query.OrderBy(s => s.Email) : query.OrderByDescending(s => s.Email),
                    "dateofbirth" => ascending ? query.OrderBy(s => s.DateOfBirth) : query.OrderByDescending(s => s.DateOfBirth),
                    _ => query.OrderBy(s => s.FirstName)
                };
            }
            else
            {
               
                query = query.OrderByDescending(s => s.StudentId);
            }

            var totalCount = await query.CountAsync();

            var students = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .Select(s => new StudentDataDto
                {
                    StudentId = s.StudentId,
                    FullName = s.FirstName + " " + s.LastName,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Email = s.Email,
                    DateOfBirth = s.DateOfBirth,
                    ClassName = s.Class.ClassName,
                    Addresses = s.Addresses.Select(a => new StudentAddressDto
                    {
                        Addressline1 = a.Addressline1,
                        Addressline2 = a.Addressline2,
                        Addressline3 = a.Addressline3,
                        City = a.City,
                        State = a.State,
                        PostalCode = a.PostalCode,
                        CountryName = a.Country.CountryName,
                        AddressCategoryName = a.AddressCategory.AddressCategoryName
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new
            {
                TotalCount = totalCount,
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize,
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