using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class AddProdajnePozicijeDetalji : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackgroundContentType",
                table: "ProdajniLayout",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BackgroundData",
                table: "ProdajniLayout",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BackgroundFileName",
                table: "ProdajniLayout",
                type: "varchar(255)",
                unicode: false,
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BrojPozicije",
                table: "ProdajnaPozicija",
                type: "varchar(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipPozicije",
                table: "ProdajnaPozicija",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Trgovac",
                table: "ProdajnaPozicija",
                type: "varchar(200)",
                unicode: false,
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "VrijednostZakupa",
                table: "ProdajnaPozicija",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VrstaUgovora",
                table: "ProdajnaPozicija",
                type: "varchar(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ZakupDo",
                table: "ProdajnaPozicija",
                type: "datetime",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackgroundContentType",
                table: "ProdajniLayout");

            migrationBuilder.DropColumn(
                name: "BackgroundData",
                table: "ProdajniLayout");

            migrationBuilder.DropColumn(
                name: "BackgroundFileName",
                table: "ProdajniLayout");

            migrationBuilder.DropColumn(
                name: "BrojPozicije",
                table: "ProdajnaPozicija");

            migrationBuilder.DropColumn(
                name: "TipPozicije",
                table: "ProdajnaPozicija");

            migrationBuilder.DropColumn(
                name: "Trgovac",
                table: "ProdajnaPozicija");

            migrationBuilder.DropColumn(
                name: "VrijednostZakupa",
                table: "ProdajnaPozicija");

            migrationBuilder.DropColumn(
                name: "VrstaUgovora",
                table: "ProdajnaPozicija");

            migrationBuilder.DropColumn(
                name: "ZakupDo",
                table: "ProdajnaPozicija");
        }
    }
}
