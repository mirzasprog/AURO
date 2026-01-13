using System;
using backend.Entities;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(Auro2Context))]
    [Migration("20250315090000_AddShifts")]
    public partial class AddShifts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Shift",
                columns: table => new
                {
                    ShiftId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StoreId = table.Column<int>(type: "int", nullable: false),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    ShiftDate = table.Column<DateTime>(type: "date", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    BreakMinutes = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    ShiftType = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Note = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shift", x => x.ShiftId);
                    table.ForeignKey(
                        name: "FK_Shift_Korisnik",
                        column: x => x.EmployeeId,
                        principalTable: "Korisnik",
                        principalColumn: "KorisnikID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Shift_Prodavnica",
                        column: x => x.StoreId,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ShiftAudit",
                columns: table => new
                {
                    AuditId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EntityName = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    EntityId = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Action = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    BeforeJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AfterJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ActorUserId = table.Column<int>(type: "int", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftAudit", x => x.AuditId);
                });

            migrationBuilder.CreateTable(
                name: "ShiftRequest",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StoreId = table.Column<int>(type: "int", nullable: false),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    RelatedShiftId = table.Column<int>(type: "int", nullable: true),
                    RequestedDate = table.Column<DateTime>(type: "date", nullable: true),
                    Message = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    ManagerNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ApprovedBy = table.Column<int>(type: "int", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftRequest", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_ShiftRequest_Korisnik",
                        column: x => x.EmployeeId,
                        principalTable: "Korisnik",
                        principalColumn: "KorisnikID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ShiftRequest_Prodavnica",
                        column: x => x.StoreId,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ShiftRequest_Shift",
                        column: x => x.RelatedShiftId,
                        principalTable: "Shift",
                        principalColumn: "ShiftId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Shift_EmployeeId_ShiftDate",
                table: "Shift",
                columns: new[] { "EmployeeId", "ShiftDate" });

            migrationBuilder.CreateIndex(
                name: "IX_Shift_Status",
                table: "Shift",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Shift_StoreId_ShiftDate",
                table: "Shift",
                columns: new[] { "StoreId", "ShiftDate" });

            migrationBuilder.CreateIndex(
                name: "IX_ShiftRequest_StoreId_Status",
                table: "ShiftRequest",
                columns: new[] { "StoreId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_ShiftRequest_EmployeeId",
                table: "ShiftRequest",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftRequest_RelatedShiftId",
                table: "ShiftRequest",
                column: "RelatedShiftId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShiftAudit");

            migrationBuilder.DropTable(
                name: "ShiftRequest");

            migrationBuilder.DropTable(
                name: "Shift");
        }
    }
}
