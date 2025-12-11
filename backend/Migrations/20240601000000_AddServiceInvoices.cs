using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
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
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "date", nullable: false),
                    DueDate = table.Column<DateTime>(type: "date", nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    CustomerAddress = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    CustomerCity = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    CustomerCountry = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    CustomerTaxId = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    CustomerId = table.Column<int>(type: "int", nullable: true),
                    Currency = table.Column<string>(type: "nvarchar(8)", maxLength: 8, nullable: false),
                    SubtotalAmount = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    TaxAmount = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false, defaultValue: "Kreirano")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceInvoices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServiceInvoiceItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceInvoiceId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    TaxRate = table.Column<decimal>(type: "decimal(5, 2)", nullable: false),
                    LineTotalWithoutTax = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    LineTaxAmount = table.Column<decimal>(type: "decimal(18, 2)", nullable: false),
                    LineTotalWithTax = table.Column<decimal>(type: "decimal(18, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceInvoiceItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceInvoiceItems_ServiceInvoices_ServiceInvoiceId",
                        column: x => x.ServiceInvoiceId,
                        principalTable: "ServiceInvoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceInvoiceItems_ServiceInvoiceId",
                table: "ServiceInvoiceItems",
                column: "ServiceInvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceInvoices_InvoiceNumber",
                table: "ServiceInvoices",
                column: "InvoiceNumber");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceInvoiceItems");

            migrationBuilder.DropTable(
                name: "ServiceInvoices");
        }
    }
}
