using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ServiceInvoiceItemRequest
    {
        [Required]
        [MaxLength(512)]
        public string Description { get; set; } = null!;

        [Range(0.01, double.MaxValue, ErrorMessage = "Količina mora biti veća od 0.")]
        public decimal Quantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Jedinična cijena mora biti veća od 0.")]
        public decimal UnitPrice { get; set; }

        [Range(0, 99.99, ErrorMessage = "Stopa poreza mora biti u rasponu 0-99.99%.")]
        public decimal TaxRate { get; set; }
    }

    public class ServiceInvoiceRequest
    {
        public int? Id { get; set; }

        [MaxLength(64)]
        public string? InvoiceNumber { get; set; }

        [Required]
        public DateTime InvoiceDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        [MaxLength(256)]
        public string CustomerName { get; set; } = null!;

        [MaxLength(256)]
        public string? CustomerAddress { get; set; }

        [MaxLength(128)]
        public string? CustomerCity { get; set; }

        [MaxLength(128)]
        public string? CustomerCountry { get; set; }

        [MaxLength(64)]
        public string? CustomerTaxId { get; set; }

        public int? CustomerId { get; set; }

        [Required]
        [MaxLength(8)]
        public string Currency { get; set; } = "BAM";

        [Range(1, int.MaxValue, ErrorMessage = "ServiceId mora biti postavljen.")]
        public int ServiceId { get; set; } = 1;

        [MaxLength(1024)]
        public string? Notes { get; set; }

        [MaxLength(64)]
        public string? Status { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Potrebno je unijeti barem jednu stavku.")]
        public List<ServiceInvoiceItemRequest> Items { get; set; } = new();
    }

    public class ServiceInvoiceItemResponse
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxRate { get; set; }
        public decimal LineTotalWithoutTax { get; set; }
        public decimal LineTaxAmount { get; set; }
        public decimal LineTotalWithTax { get; set; }
    }

    public class ServiceInvoiceResponse
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerAddress { get; set; }
        public string? CustomerCity { get; set; }
        public string? CustomerCountry { get; set; }
        public string? CustomerTaxId { get; set; }
        public int? CustomerId { get; set; }
        public string Currency { get; set; } = "BAM";
        public int ServiceId { get; set; }
        public decimal SubtotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<ServiceInvoiceItemResponse> Items { get; set; } = new();
        public CompanyInfoDto? CompanyInfo { get; set; }
    }

    public class ServiceInvoiceListItem
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = Array.Empty<T>();
        public int TotalCount { get; set; }
    }
}
