using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class PrometRangeResponse
    {
        public DateRangeDescriptor? CurrentRange { get; set; }
        public DateRangeDescriptor? PreviousRange { get; set; }
        public PrometRangeSummary? Totals { get; set; }
        public List<PrometRangeStoreRow> Stores { get; set; } = new();
        public List<PrometRangeDayRow> Days { get; set; } = new();
        public List<PrometRangeDayRow> CurrentDays { get; set; } = new();
        public List<PrometRangeDayRow> PreviousDays { get; set; } = new();
    }

    public class DateRangeDescriptor
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class PrometRangeSummary
    {
        public decimal Promet { get; set; }
        public decimal PrometProslaGodina { get; set; }
        public int BrojKupaca { get; set; }
        public int BrojKupacaProslaGodina { get; set; }
    }

    public class PrometRangeStoreRow
    {
        public string? BrojProdavnice { get; set; }
        public string? Adresa { get; set; }
        public string? Format { get; set; }
        public string? Regija { get; set; }
        public decimal Promet { get; set; }
        public decimal PrometProslaGodina { get; set; }
        public int BrojKupaca { get; set; }
        public int BrojKupacaProslaGodina { get; set; }
    }

    public class PrometRangeDayRow
    {
        public DateTime Datum { get; set; }
        public decimal Promet { get; set; }
        public decimal PrometProslaGodina { get; set; }
        public int BrojKupaca { get; set; }
        public int BrojKupacaProslaGodina { get; set; }
    }
}
