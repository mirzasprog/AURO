using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class AddLocalChatbot : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KnowledgeTopics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tema = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Upute = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KnowledgeTopics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UnansweredQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnansweredQuestions", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "KnowledgeTopics",
                columns: new[] { "Tema", "Upute" },
                values: new object[,]
                {
                    {
                        "Inventura",
                        "Za pokretanje inventure otvori modul Inventure i klikni na 'Unos'. Odaberi prodavnicu i datum inventure, zatim dodaj artikle za popis. Kada provjeriš količine, sačuvaj unos i prati odobrenje u tabu 'Pregled'."
                    },
                    {
                        "Redovni otpis",
                        "Za redovni otpis idi na Otpis > Redovni. Unesi artikle koje treba otpisati, provjeri količine i spremi zahtjev. Ako nema otpisa za dan, koristi dugme 'Nema otpisa' da evidentiraš stanje."
                    },
                    {
                        "Vanredni otpis",
                        "Vanredni otpis otvaraš kroz Otpis > Vanredni. Popuni obrazac sa opisom razloga, artiklima i pratećom dokumentacijom. Nakon spremanja zahtjev ide na odobrenje odgovornoj osobi."
                    },
                    {
                        "Izdatnica troška",
                        "Za kreiranje izdatnice troška otvori Izdatnice > Nova izdatnica. Odaberi prodavnicu i vrstu troška, zatim dodaj artikle i iznose. Nakon provjere pošalji na odobrenje i prati status u listi izdatnica."
                    }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KnowledgeTopics");

            migrationBuilder.DropTable(
                name: "UnansweredQuestions");
        }
    }
}
