using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace AURO.Migrations
{
    [Migration("20240601000000_AddServiceInvoices")]
    public partial class AddServiceInvoices : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ServiceInvoices",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceId = table.Column<int>(nullable: false),
                    InvoiceNumber = table.Column<string>(maxLength: 50, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Currency = table.Column<string>(maxLength: 3, nullable: false, defaultValue: "EUR"),
                    IssueDate = table.Column<DateTime>(nullable: false),
                    DueDate = table.Column<DateTime>(nullable: true),
                    Paid = table.Column<bool>(nullable: false, defaultValue: false),
                    Notes = table.Column<string>(maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "SYSUTCDATETIME()"),
                    UpdatedAt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceInvoices", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceInvoices_ServiceId",
                table: "ServiceInvoices",
                column: "ServiceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceInvoices");
        }
    }
}
