-- Osnovna sredstva - kreiranje tabela i inicijalne kategorije

CREATE TABLE [dbo].[FixedAssetCategories](
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(150) NOT NULL,
    [Description] NVARCHAR(400) NULL,
    [ParentCategoryId] INT NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [DF_FixedAssetCategories_IsActive] DEFAULT (1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_FixedAssetCategories_CreatedAt] DEFAULT (GETDATE()),
    [UpdatedAt] DATETIME2 NULL,
    CONSTRAINT [FK_FixedAssetCategories_Parent] FOREIGN KEY ([ParentCategoryId]) REFERENCES [dbo].[FixedAssetCategories]([Id])
);

CREATE TABLE [dbo].[FixedAssets](
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [CategoryId] INT NOT NULL,
    [Name] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [InventoryNumber] NVARCHAR(100) NOT NULL,
    [SerialNumber] NVARCHAR(100) NOT NULL,
    [PurchasePrice] DECIMAL(18,2) NOT NULL,
    [Supplier] NVARCHAR(200) NOT NULL,
    [PurchaseDate] DATE NOT NULL,
    [WarrantyUntil] DATE NULL,
    [Location] NVARCHAR(150) NULL,
    [Department] NVARCHAR(150) NULL,
    [Status] NVARCHAR(50) NULL,
    [AssignedTo] NVARCHAR(150) NULL,
    [Notes] NVARCHAR(1000) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [DF_FixedAssets_IsActive] DEFAULT (1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_FixedAssets_CreatedAt] DEFAULT (GETDATE()),
    [UpdatedAt] DATETIME2 NULL,
    CONSTRAINT [FK_FixedAssets_Category] FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[FixedAssetCategories]([Id]),
    CONSTRAINT [UQ_FixedAssets_InventoryNumber] UNIQUE ([InventoryNumber]),
    CONSTRAINT [UQ_FixedAssets_SerialNumber] UNIQUE ([SerialNumber])
);

CREATE TABLE [dbo].[FixedAssetAssignments](
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [AssetId] INT NOT NULL,
    [AssignedTo] NVARCHAR(150) NOT NULL,
    [AssignedBy] NVARCHAR(150) NULL,
    [Department] NVARCHAR(150) NULL,
    [Location] NVARCHAR(150) NULL,
    [StartDate] DATE NOT NULL,
    [EndDate] DATE NULL,
    [Status] NVARCHAR(50) NULL,
    [Note] NVARCHAR(500) NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_FixedAssetAssignments_CreatedAt] DEFAULT (GETDATE()),
    CONSTRAINT [FK_FixedAssetAssignments_Asset] FOREIGN KEY ([AssetId]) REFERENCES [dbo].[FixedAssets]([Id])
);

CREATE TABLE [dbo].[FixedAssetServiceRecords](
    [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [AssetId] INT NOT NULL,
    [ServiceDate] DATE NOT NULL,
    [Vendor] NVARCHAR(200) NULL,
    [Description] NVARCHAR(500) NULL,
    [Cost] DECIMAL(18,2) NULL,
    [NextServiceDate] DATE NULL,
    [DocumentNumber] NVARCHAR(100) NULL,
    [Status] NVARCHAR(50) NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_FixedAssetServiceRecords_CreatedAt] DEFAULT (GETDATE()),
    CONSTRAINT [FK_FixedAssetServiceRecords_Asset] FOREIGN KEY ([AssetId]) REFERENCES [dbo].[FixedAssets]([Id])
);

CREATE VIEW [dbo].[FixedAssetSummaryByCategory] AS
SELECT
    c.Id AS CategoryId,
    c.Name AS CategoryName,
    COUNT(a.Id) AS TotalAssets,
    SUM(CASE WHEN a.IsActive = 1 THEN 1 ELSE 0 END) AS ActiveAssets,
    SUM(CASE WHEN a.AssignedTo IS NOT NULL AND a.AssignedTo <> '' THEN 1 ELSE 0 END) AS AssignedAssets,
    SUM(a.PurchasePrice) AS TotalPurchasePrice
FROM [dbo].[FixedAssetCategories] c
LEFT JOIN [dbo].[FixedAssets] a ON a.CategoryId = c.Id
GROUP BY c.Id, c.Name;

-- Inicijalne kategorije i podkategorije (retail kompanija)
INSERT INTO [dbo].[FixedAssetCategories] ([Name], [Description], [ParentCategoryId]) VALUES
(N'IT oprema', N'Računari, mrežna i POS oprema', NULL),
(N'Maloprodajna oprema', N'Oprema u prodajnim objektima', NULL),
(N'Hladni lanac', N'Rashladna i zamrzivačka oprema', NULL),
(N'Logistika i transport', N'Vozila, paletari, dostavna oprema', NULL),
(N'Sigurnost i zaštita', N'Video nadzor, alarmi, protivpožarna zaštita', NULL),
(N'Administracija', N'Kancelarijska i administrativna oprema', NULL);

DECLARE @itId INT = (SELECT TOP 1 Id FROM [dbo].[FixedAssetCategories] WHERE [Name] = N'IT oprema');
DECLARE @retailId INT = (SELECT TOP 1 Id FROM [dbo].[FixedAssetCategories] WHERE [Name] = N'Maloprodajna oprema');
DECLARE @coldChainId INT = (SELECT TOP 1 Id FROM [dbo].[FixedAssetCategories] WHERE [Name] = N'Hladni lanac');
DECLARE @logisticsId INT = (SELECT TOP 1 Id FROM [dbo].[FixedAssetCategories] WHERE [Name] = N'Logistika i transport');
DECLARE @securityId INT = (SELECT TOP 1 Id FROM [dbo].[FixedAssetCategories] WHERE [Name] = N'Sigurnost i zaštita');
DECLARE @adminId INT = (SELECT TOP 1 Id FROM [dbo].[FixedAssetCategories] WHERE [Name] = N'Administracija');

INSERT INTO [dbo].[FixedAssetCategories] ([Name], [Description], [ParentCategoryId]) VALUES
(N'PC', N'Desktop računari', @itId),
(N'Lap-top', N'Prenosni računari', @itId),
(N'Monitor', N'LCD/LED monitori', @itId),
(N'POS kasa', N'Blagajne i POS uređaji', @itId),
(N'Vage', N'Vage za maloprodaju', @itId),
(N'Police', N'Gondole i zidne police', @retailId),
(N'Regali', N'Magacinski i prodajni regali', @retailId),
(N'Rashladni frižideri', N'Frižideri za rashlađene proizvode', @coldChainId),
(N'Zamrzivači', N'Duboki zamrzivači', @coldChainId),
(N'Paletari', N'Ručni i električni paletari', @logisticsId),
(N'Dostavna vozila', N'Kombi i dostavna vozila', @logisticsId),
(N'Video nadzor', N'Kamere i snimači', @securityId),
(N'Protivpožarna oprema', N'Aparati, hidranti, senzori', @securityId),
(N'Kancelarijska oprema', N'Stampaci, skeneri, telefoni', @adminId),
(N'Namještaj', N'Kancelarijski namještaj', @adminId);
