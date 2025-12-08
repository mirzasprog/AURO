using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class AddKnowledgeTopicsIfMissing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID('dbo.KnowledgeTopics', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[KnowledgeTopics](
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Tema] NVARCHAR(200) NOT NULL,
        [Upute] NVARCHAR(MAX) NOT NULL
    );
END
");

            migrationBuilder.Sql(@"
IF OBJECT_ID('dbo.UnansweredQuestions', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[UnansweredQuestions](
        [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Question] NVARCHAR(500) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_UnansweredQuestions_CreatedAt] DEFAULT(GETUTCDATE())
    );
END
");

            migrationBuilder.Sql(@"
IF OBJECT_ID('dbo.KnowledgeTopics', 'U') IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [KnowledgeTopics] WHERE [Tema] = 'Inventura')
    BEGIN
        INSERT INTO [KnowledgeTopics] ([Tema], [Upute]) VALUES
        ('Inventura', 'Za pokretanje inventure otvori modul Inventure i klikni na ''Unos''. Odaberi prodavnicu i datum inventure, zatim dodaj artikle za popis. Kada provjeriš količine, sačuvaj unos i prati odobrenje u tabu ''Pregled''.');
    END

    IF NOT EXISTS (SELECT 1 FROM [KnowledgeTopics] WHERE [Tema] = 'Redovni otpis')
    BEGIN
        INSERT INTO [KnowledgeTopics] ([Tema], [Upute]) VALUES
        ('Redovni otpis', 'Za redovni otpis idi na Otpis > Redovni. Unesi artikle koje treba otpisati, provjeri količine i spremi zahtjev. Ako nema otpisa za dan, koristi dugme ''Nema otpisa'' da evidentiraš stanje.');
    END

    IF NOT EXISTS (SELECT 1 FROM [KnowledgeTopics] WHERE [Tema] = 'Vanredni otpis')
    BEGIN
        INSERT INTO [KnowledgeTopics] ([Tema], [Upute]) VALUES
        ('Vanredni otpis', 'Vanredni otpis otvaraš kroz Otpis > Vanredni. Popuni obrazac sa opisom razloga, artiklima i pratećom dokumentacijom. Nakon spremanja zahtjev ide na odobrenje odgovornoj osobi.');
    END

    IF NOT EXISTS (SELECT 1 FROM [KnowledgeTopics] WHERE [Tema] = 'Izdatnica troška')
    BEGIN
        INSERT INTO [KnowledgeTopics] ([Tema], [Upute]) VALUES
        ('Izdatnica troška', 'Za kreiranje izdatnice troška otvori Izdatnice > Nova izdatnica. Odaberi prodavnicu i vrstu troška, zatim dodaj artikle i iznose. Nakon provjere pošalji na odobrenje i prati status u listi izdatnica.');
    END
END
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF OBJECT_ID('dbo.KnowledgeTopics', 'U') IS NOT NULL
BEGIN
    DELETE FROM [KnowledgeTopics] WHERE [Tema] IN ('Inventura', 'Redovni otpis', 'Vanredni otpis', 'Izdatnica troška');
END
");

            migrationBuilder.Sql(@"
IF OBJECT_ID('dbo.UnansweredQuestions', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[UnansweredQuestions];
END
");

            migrationBuilder.Sql(@"
IF OBJECT_ID('dbo.KnowledgeTopics', 'U') IS NOT NULL
BEGIN
    DROP TABLE [dbo].[KnowledgeTopics];
END
");
        }
    }
}
