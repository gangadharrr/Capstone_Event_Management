using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Capstone_Event_Management.Data.Migrations
{
    /// <inheritdoc />
    public partial class Professor_table_added : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Professors",
                columns: table => new
                {
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProfessorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Designation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NormalizedDegree = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NormalizedBranch = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professors", x => x.Email);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Professors_ProfessorId",
                table: "Professors",
                column: "ProfessorId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Professors");
        }
    }
}
