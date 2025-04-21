using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace studentdemo.Migrations
{
    /// <inheritdoc />
    public partial class dfk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "AddressCategory",
                newName: "AddressCategoryName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AddressCategoryName",
                table: "AddressCategory",
                newName: "Name");
        }
    }
}
