using backend.Entities;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(Auro2Context))]
    [Migration("20250315123000_RemoveShiftEmployeeForeignKey")]
    public partial class RemoveShiftEmployeeForeignKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Shift_Korisnik",
                table: "Shift");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_Shift_Korisnik",
                table: "Shift",
                column: "EmployeeId",
                principalTable: "Korisnik",
                principalColumn: "KorisnikID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
