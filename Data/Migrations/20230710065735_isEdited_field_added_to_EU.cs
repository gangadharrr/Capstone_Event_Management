using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Capstone_Event_Management.Migrations
{
    /// <inheritdoc />
    public partial class isEdited_field_added_to_EU : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEdited",
                table: "EventUpdates",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEdited",
                table: "EventUpdates");
        }
    }
}
