using Microsoft.EntityFrameworkCore;

namespace backend.Entities
{
    public partial class Auro2Context
    {
        public virtual DbSet<Shift> Shift { get; set; } = null!;
        public virtual DbSet<ShiftRequest> ShiftRequest { get; set; } = null!;
        public virtual DbSet<ShiftAudit> ShiftAudit { get; set; } = null!;
    }
}
