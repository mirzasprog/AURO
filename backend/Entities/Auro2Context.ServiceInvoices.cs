using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public partial class Auro2Context
    {
        public virtual DbSet<ServiceInvoice> ServiceInvoices { get; set; } = null!;
        public virtual DbSet<ServiceInvoiceItem> ServiceInvoiceItems { get; set; } = null!;
    }
}
