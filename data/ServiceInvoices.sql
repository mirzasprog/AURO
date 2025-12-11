-- SQL Server DDL for ServiceInvoices table
CREATE TABLE dbo.ServiceInvoices (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ServiceId INT NOT NULL,
    InvoiceNumber NVARCHAR(50) NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Currency NVARCHAR(3) NOT NULL DEFAULT 'EUR',
    IssueDate DATETIME2(0) NOT NULL,
    DueDate DATETIME2(0) NULL,
    Paid BIT NOT NULL DEFAULT 0,
    Notes NVARCHAR(500) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NULL
);
GO

CREATE INDEX IX_ServiceInvoices_ServiceId ON dbo.ServiceInvoices(ServiceId);
GO
