using System;
using System.Collections.Generic;

namespace backend.Entities
{
    public partial class DailyTaskTemplate
    {
        public DailyTaskTemplate()
        {
            DailyTasks = new HashSet<DailyTask>();
        }

        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public bool ImageAllowed { get; set; }
        public bool IsActive { get; set; }
        public string? DefaultStatus { get; set; }

        public virtual ICollection<DailyTask> DailyTasks { get; set; }
    }
}
