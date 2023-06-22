using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Capstone_Event_Management.Data.Migrations
{
    /// <inheritdoc />
    public partial class Student_Table_Added : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Batch = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Section = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RollNumber = table.Column<int>(type: "int", nullable: false),
                    NormalizedDegree = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NormalizedBranch = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Email);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Students_RollNumber",
                table: "Students",
                column: "RollNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Students");
        }
    }
}
