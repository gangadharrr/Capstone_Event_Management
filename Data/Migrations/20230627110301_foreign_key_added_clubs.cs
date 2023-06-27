using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Capstone_Event_Management.Data.Migrations
{
    /// <inheritdoc />
    public partial class foreign_key_added_clubs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProfessorIncharge",
                table: "Clubs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "President",
                table: "Clubs",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_President",
                table: "Clubs",
                column: "President");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_ProfessorIncharge",
                table: "Clubs",
                column: "ProfessorIncharge");

            migrationBuilder.AddForeignKey(
                name: "FK_Clubs_Professors_ProfessorIncharge",
                table: "Clubs",
                column: "ProfessorIncharge",
                principalTable: "Professors",
                principalColumn: "Email",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Clubs_Students_President",
                table: "Clubs",
                column: "President",
                principalTable: "Students",
                principalColumn: "Email",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clubs_Professors_ProfessorIncharge",
                table: "Clubs");

            migrationBuilder.DropForeignKey(
                name: "FK_Clubs_Students_President",
                table: "Clubs");

            migrationBuilder.DropIndex(
                name: "IX_Clubs_President",
                table: "Clubs");

            migrationBuilder.DropIndex(
                name: "IX_Clubs_ProfessorIncharge",
                table: "Clubs");

            migrationBuilder.AlterColumn<string>(
                name: "ProfessorIncharge",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "President",
                table: "Clubs",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
