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
        [IsRecurring] BIT NOT NULL CONSTRAINT [DF_DailyTask_IsRecurring] DEFAULT(0),
        CONSTRAINT [PK_DailyTask] PRIMARY KEY CLUSTERED ([ID] ASC),
        CONSTRAINT [FK_DailyTask_CreatedBy] FOREIGN KEY([CreatedById]) REFERENCES [dbo].[Korisnik]([KorisnikID]),
        CONSTRAINT [FK_DailyTask_CompletedBy] FOREIGN KEY([CompletedById]) REFERENCES [dbo].[Korisnik]([KorisnikID]),
        CONSTRAINT [FK_DailyTask_Prodavnica] FOREIGN KEY([ProdavnicaID]) REFERENCES [dbo].[Prodavnica]([KorisnikID]),
        CONSTRAINT [FK_DailyTask_Template] FOREIGN KEY([TemplateId]) REFERENCES [dbo].[DailyTaskTemplate]([ID])
    );

    CREATE INDEX [IX_DailyTask_ProdavnicaID_Date] ON [dbo].[DailyTask]([ProdavnicaID], [Date]);
END";

        private const string EnsureDailyTaskRecurringColumnSql = @"
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'DailyTask' AND schema_id = SCHEMA_ID('dbo'))
    AND NOT EXISTS (
        SELECT 1 FROM sys.columns WHERE Name = 'IsRecurring' AND Object_ID = OBJECT_ID('[dbo].[DailyTask]')
    )
BEGIN
    ALTER TABLE [dbo].[DailyTask] ADD [IsRecurring] BIT NOT NULL CONSTRAINT [DF_DailyTask_IsRecurring] DEFAULT(0);
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

        private const string EnsureVipZaglavljeTableSql = @"
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'VIPZaglavlje' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [dbo].[VIPZaglavlje]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Opis] NVARCHAR(MAX) NULL,
        [Pocetak] DATETIME NOT NULL,
        [Kraj] DATETIME NOT NULL,
        [Status] NVARCHAR(MAX) NULL,
        [UniqueId] NVARCHAR(64) NULL,
        CONSTRAINT [PK_VIPZaglavlje] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END";

        private const string EnsureVipStavkesTableSql = @"
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'VIPStavkes' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [dbo].[VIPStavkes]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [SifraArtikla] NVARCHAR(MAX) NULL,
        [NazivArtikla] NVARCHAR(MAX) NULL,
        [Kolicina] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_VIPStavkes_Kolicina] DEFAULT(0),
        [Prodavnica] NVARCHAR(MAX) NULL,
        [VIPZaglavlje_Id] INT NULL,
        [VrijemeUnosaSaSourcea] DATETIME NULL,
        [VrijemeUnosaIzProdavnice] DATETIME NULL,
        CONSTRAINT [PK_VIPStavkes] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_dbo.VIPStavkes_dbo.VIPZaglavlje_VIPZaglavlje_Id] FOREIGN KEY([VIPZaglavlje_Id])
            REFERENCES [dbo].[VIPZaglavlje]([Id])
    );
END";

        private const string EnsureVipZaglavljeUniqueIdColumnSql = @"
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'UniqueId' AND Object_ID = OBJECT_ID('dbo.VIPZaglavlje'))
BEGIN
    ALTER TABLE [dbo].[VIPZaglavlje]
    ADD [UniqueId] NVARCHAR(64) NULL;
END";

        private const string EnsureVipZaglavljeUniqueIdIndexSql = @"
IF EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'UniqueId' AND Object_ID = OBJECT_ID('dbo.VIPZaglavlje'))
BEGIN
    UPDATE [dbo].[VIPZaglavlje]
    SET [UniqueId] = ISNULL([UniqueId], CONVERT(varchar(64), NEWID()))
    WHERE [UniqueId] IS NULL OR LTRIM(RTRIM([UniqueId])) = '';

    IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_VIPZaglavlje_UniqueId')
    BEGIN
        CREATE UNIQUE NONCLUSTERED INDEX [UX_VIPZaglavlje_UniqueId]
        ON [dbo].[VIPZaglavlje]([UniqueId]);
    END
END";

        private const string EnsureVipArtikliTableSql = @"
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'VIPArtikli' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [dbo].[VIPArtikli]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [IDAkcije] NVARCHAR(64) NOT NULL,
        [NazivArtk] NVARCHAR(MAX) NULL,
        [SifraArtk] NVARCHAR(MAX) NULL,
        [BarKod] NVARCHAR(128) NULL,
        [Dobavljac] NVARCHAR(256) NULL,
        [AsSa] DECIMAL(18, 2) NULL,
        [AsMo] DECIMAL(18, 2) NULL,
        [AsBl] DECIMAL(18, 2) NULL,
        [Opis] NVARCHAR(MAX) NULL,
        [Status] NVARCHAR(128) NULL,
        [AkcijskaMpc] DECIMAL(18, 2) NULL,
        [Zaliha] DECIMAL(18, 2) NULL,
        CONSTRAINT [PK_VIPArtikli] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END";

        private const string EnsureVipArtikliExtendedColumnsSql = @"
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'VIPArtikli' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'BarKod' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [BarKod] NVARCHAR(128) NULL;
    END
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'Dobavljac' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [Dobavljac] NVARCHAR(256) NULL;
    END
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'AsSa' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [AsSa] DECIMAL(18, 2) NULL;
    END
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'AsMo' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [AsMo] DECIMAL(18, 2) NULL;
    END
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'AsBl' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [AsBl] DECIMAL(18, 2) NULL;
    END
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'Opis' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [Opis] NVARCHAR(MAX) NULL;
    END
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'Status' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [Status] NVARCHAR(128) NULL;
    END
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'AkcijskaMpc' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [AkcijskaMpc] DECIMAL(18, 2) NULL;
    END
    IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE Name = 'Zaliha' AND Object_ID = OBJECT_ID('dbo.VIPArtikli'))
    BEGIN
        ALTER TABLE [dbo].[VIPArtikli] ADD [Zaliha] DECIMAL(18, 2) NULL;
    END
END";

        private const string EnsureServiceInvoicesTableSql = @"
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ServiceInvoices' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [dbo].[ServiceInvoices]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [InvoiceNumber] NVARCHAR(64) NOT NULL,
        [InvoiceDate] DATE NOT NULL,
        [DueDate] DATE NOT NULL,
        [CustomerName] NVARCHAR(256) NOT NULL,
        [CustomerAddress] NVARCHAR(256) NULL,
        [CustomerCity] NVARCHAR(128) NULL,
        [CustomerCountry] NVARCHAR(128) NULL,
        [CustomerTaxId] NVARCHAR(64) NULL,
        [CustomerId] INT NULL,
        [Currency] NVARCHAR(8) NOT NULL,
        [SubtotalAmount] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_ServiceInvoices_SubtotalAmount] DEFAULT(0),
        [TaxAmount] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_ServiceInvoices_TaxAmount] DEFAULT(0),
        [TotalAmount] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_ServiceInvoices_TotalAmount] DEFAULT(0),
        [Notes] NVARCHAR(1024) NULL,
        [Status] NVARCHAR(64) NOT NULL CONSTRAINT [DF_ServiceInvoices_Status] DEFAULT('Kreirano'),
        [ServiceId] INT NOT NULL CONSTRAINT [DF_ServiceInvoices_ServiceId] DEFAULT(1),
        CONSTRAINT [PK_ServiceInvoices] PRIMARY KEY CLUSTERED ([Id] ASC)
    );

    CREATE UNIQUE INDEX [IX_ServiceInvoices_InvoiceNumber] ON [dbo].[ServiceInvoices]([InvoiceNumber]);
END";

        private const string EnsureServiceInvoiceServiceIdColumnSql = @"
IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ServiceInvoices' AND schema_id = SCHEMA_ID('dbo'))
    AND NOT EXISTS (
        SELECT 1 FROM sys.columns WHERE Name = 'ServiceId' AND Object_ID = OBJECT_ID('[dbo].[ServiceInvoices]')
    )
BEGIN
    ALTER TABLE [dbo].[ServiceInvoices]
    ADD [ServiceId] INT NOT NULL CONSTRAINT [DF_ServiceInvoices_ServiceId] DEFAULT(1);
END";

        private const string EnsureServiceInvoiceItemsTableSql = @"
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ServiceInvoiceItems' AND schema_id = SCHEMA_ID('dbo'))
BEGIN
    CREATE TABLE [dbo].[ServiceInvoiceItems]
    (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [ServiceInvoiceId] INT NOT NULL,
        [Description] NVARCHAR(512) NOT NULL,
        [Quantity] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_ServiceInvoiceItems_Quantity] DEFAULT(0),
        [UnitPrice] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_ServiceInvoiceItems_UnitPrice] DEFAULT(0),
        [TaxRate] DECIMAL(5, 2) NOT NULL CONSTRAINT [DF_ServiceInvoiceItems_TaxRate] DEFAULT(0),
        [LineTotalWithoutTax] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_ServiceInvoiceItems_LineTotalWithoutTax] DEFAULT(0),
        [LineTaxAmount] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_ServiceInvoiceItems_LineTaxAmount] DEFAULT(0),
        [LineTotalWithTax] DECIMAL(18, 2) NOT NULL CONSTRAINT [DF_ServiceInvoiceItems_LineTotalWithTax] DEFAULT(0),
        CONSTRAINT [PK_ServiceInvoiceItems] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_ServiceInvoiceItems_ServiceInvoices_ServiceInvoiceId] FOREIGN KEY([ServiceInvoiceId])
            REFERENCES [dbo].[ServiceInvoices]([Id]) ON DELETE CASCADE
    );

    CREATE INDEX [IX_ServiceInvoiceItems_ServiceInvoiceId] ON [dbo].[ServiceInvoiceItems]([ServiceInvoiceId]);
END";

        public static async Task EnsureDailyTaskTablesAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<Auro2Context>();

            await context.Database.ExecuteSqlRawAsync(EnsureDailyTaskTemplateSql);
            await context.Database.ExecuteSqlRawAsync(EnsureDailyTaskTableSql);
            await context.Database.ExecuteSqlRawAsync(EnsureDailyTaskRecurringColumnSql);
            await context.Database.ExecuteSqlRawAsync(SeedDailyTaskTemplatesSql);
        }

        public static async Task EnsureVipTablesAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<Auro2Context>();

            await context.Database.ExecuteSqlRawAsync(EnsureVipZaglavljeTableSql);
            await context.Database.ExecuteSqlRawAsync(EnsureVipStavkesTableSql);
            await context.Database.ExecuteSqlRawAsync(EnsureVipZaglavljeUniqueIdColumnSql);
            await context.Database.ExecuteSqlRawAsync(EnsureVipZaglavljeUniqueIdIndexSql);
            await context.Database.ExecuteSqlRawAsync(EnsureVipArtikliTableSql);
            await context.Database.ExecuteSqlRawAsync(EnsureVipArtikliExtendedColumnsSql);
        }

        public static async Task EnsureServiceInvoiceTablesAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<Auro2Context>();

            await context.Database.ExecuteSqlRawAsync(EnsureServiceInvoicesTableSql);
            await context.Database.ExecuteSqlRawAsync(EnsureServiceInvoiceServiceIdColumnSql);
            await context.Database.ExecuteSqlRawAsync(EnsureServiceInvoiceItemsTableSql);
        }
    }
}
