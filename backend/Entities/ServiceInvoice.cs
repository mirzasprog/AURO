using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public partial class ServiceInvoice
    {
        public ServiceInvoice()
        {
            Items = new HashSet<ServiceInvoiceItem>();
        }

        public int Id { get; set; }

        [MaxLength(64)]
        public string InvoiceNumber { get; set; } = null!;

        public DateTime InvoiceDate { get; set; }

        public DateTime DueDate { get; set; }

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

        [MaxLength(8)]
        public string Currency { get; set; } = "BAM";

        public decimal SubtotalAmount { get; set; }

        public decimal TaxAmount { get; set; }

        public decimal TotalAmount { get; set; }

        [MaxLength(1024)]
        public string? Notes { get; set; }

        [MaxLength(64)]
        public string Status { get; set; } = "Kreirano";

        public virtual ICollection<ServiceInvoiceItem> Items { get; set; }
    }
}
