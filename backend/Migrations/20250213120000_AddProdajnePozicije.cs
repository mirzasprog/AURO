using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class AddProdajnePozicije : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProdajniLayout",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProdavnicaID = table.Column<int>(type: "int", nullable: false),
                    Sirina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Duzina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DatumKreiranja = table.Column<DateTime>(type: "datetime", nullable: true),
                    DatumIzmjene = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProdajniLayout", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProdajniLayout_Prodavnica",
                        column: x => x.ProdavnicaID,
                        principalTable: "Prodavnica",
                        principalColumn: "KorisnikID");
                });

            migrationBuilder.CreateTable(
                name: "ProdajnaPozicija",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LayoutID = table.Column<int>(type: "int", nullable: false),
                    Tip = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Naziv = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    Sirina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Duzina = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PozicijaX = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PozicijaY = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rotacija = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Zona = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    DatumKreiranja = table.Column<DateTime>(type: "datetime", nullable: true),
                    DatumIzmjene = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProdajnaPozicija", x => x.ID);
                    table.ForeignKey(
                        name: "FK_ProdajnaPozicija_ProdajniLayout",
                        column: x => x.LayoutID,
                        principalTable: "ProdajniLayout",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProdajnaPozicija_LayoutID",
                table: "ProdajnaPozicija",
                column: "LayoutID");

            migrationBuilder.CreateIndex(
                name: "IX_ProdajniLayout_ProdavnicaID",
                table: "ProdajniLayout",
                column: "ProdavnicaID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProdajnaPozicija");

            migrationBuilder.DropTable(
                name: "ProdajniLayout");
        }
    }
}
