using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace studentdemo.Models
{

    public class StudentDetailsDto
    {
        public int id { get; set; }
        public string FullName { get; set; }
        public string ClassName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Email { get; set; }
        public string AddressCategory { get; set; }
        public List<AddressDto> Addresses { get; set; }

    }
    public class AddressDto
    {
        public string Addressline1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string CountryName { get; set; }
        public string AddressCategoryName { get; set; }
    }
    public class StudentDto
    {
        public Student Student { get; set; }
        public List<Address> Addresses { get; set; }

    }
    public class StudentQueryParameters
    {
        public string? searchTerm { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public string? sortColumn { get; set; } = null;
        public string? sortDirection { get; set; } = "asc";
    }

    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        [Required(ErrorMessage = "First Name is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "First Name must be between 3 and 100 characters.")]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public int ClassId { get; set; }
        [JsonIgnore]
        public StudentClass? Class { get; set; }
        public List<Address>? Addresses { get; set; }

    }
    public class StudentClass
    {
        [Key]
        public int Id { get; set; }
        public string ClassName { get; set; }
        public List<Student> Students { get; set; }

    }

    public class Subjects
    {
        public int Id { get; set; }
        public string Subject { get; set; }

        public List<Student> Students { get; set; }
    }
    public class StudentSubjects
    {
        public int Id { get; set; }
        public string subjectid { get; set; }
        public int studentid { get; set; }

    }

    public class AddressCategory
    {
        public int Id { get; set; }
        public string AddressCategoryName { get; set; }

        public List<Address> Addresses { get; set; }

    }
    public class Address
    {
        public int Id { get; set; }
        public string Addressline1 { get; set; }
        public string Addressline2 { get; set; }
        public string Addressline3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public int AddressCategoryId { get; set; }
        public int StudentId { get; set; }
        public int CountryId { get; set; }
        [ForeignKey("CountryId")]
        [JsonIgnore]
        public Country? Country { get; set; }
        [ForeignKey("StudentId")]
        [JsonIgnore]
        public Student? Student { get; set; }
        [JsonIgnore]
        public AddressCategory? AddressCategory { get; set; }

    }
    public class Country
    {
        [Key]
        public int Id { get; set; }
        public string CountryName { get; set; }
        public List<Address> Addresses { get; set; }
    }
    public class StudentDataDto
    {
        public int StudentId { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; }
        public string ClassName { get; set; }
        public List<StudentAddressDto> Addresses { get; set; }
    }

    public class StudentAddressDto
    {
        public string Addressline1 { get; set; }
        public string Addressline2 { get; set; }
        public string Addressline3 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string CountryName { get; set; }
        public string AddressCategoryName { get; set; }
        public string PostalCode { get; set; }
    }
}
