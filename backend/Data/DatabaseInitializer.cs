using System.Threading.Tasks;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Data
{
    public static class DatabaseInitializer
    {
        private const string EnsureDailyTaskTemplateSql = @"
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'DailyTaskTemplate' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [dbo].[DailyTaskTemplate]
    (
        [ID] INT IDENTITY(1,1) NOT NULL,
        [Title] VARCHAR(200) NOT NULL,
        [Description] VARCHAR(1000) NULL,
        [ImageAllowed] BIT NOT NULL CONSTRAINT [DF_DailyTaskTemplate_ImageAllowed] DEFAULT(0),
        [IsActive] BIT NOT NULL CONSTRAINT [DF_DailyTaskTemplate_IsActive] DEFAULT(1),
        [DefaultStatus] VARCHAR(50) NULL,
        CONSTRAINT [PK_DailyTaskTemplate] PRIMARY KEY CLUSTERED ([ID] ASC)
    );
END";

        private const string EnsureDailyTaskTableSql = @"
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'DailyTask' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [dbo].[DailyTask]
    (
        [ID] INT IDENTITY(1,1) NOT NULL,
        [Title] VARCHAR(200) NOT NULL,
        [Description] VARCHAR(1000) NULL,
        [Type] VARCHAR(20) NOT NULL,
        [CreatedById] INT NULL,
        [ProdavnicaID] INT NOT NULL,
        [Date] DATE NOT NULL,
        [Status] VARCHAR(20) NOT NULL,
        [CompletedAt] DATETIME NULL,
        [CompletedById] INT NULL,
        [CompletionNote] VARCHAR(2000) NULL,
        [ImageAllowed] BIT NOT NULL CONSTRAINT [DF_DailyTask_ImageAllowed] DEFAULT(0),
        [ImageAttachment] VARCHAR(500) NULL,
        [TemplateId] INT NULL,
        CONSTRAINT [PK_DailyTask] PRIMARY KEY CLUSTERED ([ID] ASC),
        CONSTRAINT [FK_DailyTask_CreatedBy] FOREIGN KEY([CreatedById]) REFERENCES [dbo].[Korisnik]([KorisnikID]),
        CONSTRAINT [FK_DailyTask_CompletedBy] FOREIGN KEY([CompletedById]) REFERENCES [dbo].[Korisnik]([KorisnikID]),
        CONSTRAINT [FK_DailyTask_Prodavnica] FOREIGN KEY([ProdavnicaID]) REFERENCES [dbo].[Prodavnica]([KorisnikID]),
        CONSTRAINT [FK_DailyTask_Template] FOREIGN KEY([TemplateId]) REFERENCES [dbo].[DailyTaskTemplate]([ID])
    );

    CREATE INDEX [IX_DailyTask_ProdavnicaID_Date] ON [dbo].[DailyTask]([ProdavnicaID], [Date]);
END";

        private const string SeedDailyTaskTemplatesSql = @"
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'DailyTaskTemplate' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    IF NOT EXISTS (SELECT 1 FROM [dbo].[DailyTaskTemplate] WHERE [Title] = 'Naručivanje robe za market')
    BEGIN
        INSERT INTO [dbo].[DailyTaskTemplate] ([Title], [Description], [ImageAllowed], [IsActive], [DefaultStatus])
        VALUES ('Naručivanje robe za market', 'Provjeriti zalihe i naručiti potrebnu robu za market.', 0, 1, 'OPEN');
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[DailyTaskTemplate] WHERE [Title] = 'Provjera cijena')
    BEGIN
        INSERT INTO [dbo].[DailyTaskTemplate] ([Title], [Description], [ImageAllowed], [IsActive], [DefaultStatus])
        VALUES ('Provjera cijena', 'Provjeriti da li su cijene na policama usklađene sa sistemom.', 1, 1, 'OPEN');
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[DailyTaskTemplate] WHERE [Title] = 'Narudžba za VIP odjel do 10 sati')
    BEGIN
        INSERT INTO [dbo].[DailyTaskTemplate] ([Title], [Description], [ImageAllowed], [IsActive], [DefaultStatus])
        VALUES ('Narudžba za VIP odjel do 10 sati', 'Osigurati da su sve narudžbe za VIP odjel završene do 10 sati.', 0, 1, 'OPEN');
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[DailyTaskTemplate] WHERE [Title] = 'Provjera funkcionalnosti uređaja u marketu')
    BEGIN
        INSERT INTO [dbo].[DailyTaskTemplate] ([Title], [Description], [ImageAllowed], [IsActive], [DefaultStatus])
        VALUES ('Provjera funkcionalnosti uređaja u marketu', 'Provjeriti sve uređaje u marketu i evidentirati eventualne kvarove.', 1, 1, 'OPEN');
    END
END";

        public static async Task EnsureDailyTaskTablesAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<Auro2Context>();

            await context.Database.ExecuteSqlRawAsync(EnsureDailyTaskTemplateSql);
            await context.Database.ExecuteSqlRawAsync(EnsureDailyTaskTableSql);
            await context.Database.ExecuteSqlRawAsync(SeedDailyTaskTemplatesSql);
        }
    }
}

