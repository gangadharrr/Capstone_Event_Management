using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Capstone_Event_Management.Migrations
{
    /// <inheritdoc />
    public partial class event_updates_table_added : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EventUpdates",
                columns: table => new
                {
                    MessageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateTimeNow = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ThreadId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventUpdates", x => x.MessageId);
                    table.ForeignKey(
                        name: "FK_EventUpdates_CollegeEvents_EventId",
                        column: x => x.EventId,
                        principalTable: "CollegeEvents",
                        principalColumn: "EventId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventUpdates_EventId",
                table: "EventUpdates",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventUpdates");
        }
    }
}
