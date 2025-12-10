using System.ComponentModel.DataAnnotations;

namespace backend.Entities
{
    public partial class ServiceInvoiceItem
    {
        public int Id { get; set; }

        public int ServiceInvoiceId { get; set; }

        [MaxLength(512)]
        public string Description { get; set; } = null!;

        public decimal Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TaxRate { get; set; }

        public decimal LineTotalWithoutTax { get; set; }

        public decimal LineTaxAmount { get; set; }

        public decimal LineTotalWithTax { get; set; }

        public virtual ServiceInvoice ServiceInvoice { get; set; } = null!;
    }
}
