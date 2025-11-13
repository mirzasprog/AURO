using System.Data;
using backend.Entities;
using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace backend.Data {
    public class IzvjestajRepository : IIzvjestajRepository
    {
         private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;

        public IzvjestajRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }

        public Tuple<IEnumerable<IzvjestajTrgovackaKnjigaSintetika>?, decimal, decimal, decimal> PreuzmiIzvjestajTrgovackaKnjigaSintetika(DateTime datumOd, DateTime datumDo)
        {
            var prodavnica = new SqlParameter {
                ParameterName = "@prodavnica",
                SqlDbType = SqlDbType.VarChar,
                Direction = ParameterDirection.Input,
                SqlValue = korisnickoIme,
                Size = 4
            };

            var datumPocetka = new SqlParameter {
                ParameterName = "@datumOd",
                SqlDbType = SqlDbType.Date,
                Direction = ParameterDirection.Input,
                SqlValue = datumOd
            };

            
            var datumKraja = new SqlParameter {
                ParameterName = "@datumDo",
                SqlDbType = SqlDbType.Date,
                Direction = ParameterDirection.Input,
                SqlValue = datumDo
            };


            var ukupnaNaknadaDoDatogPerioda = new SqlParameter
            {
                ParameterName = "@ukupnaNaknadaDoDatogPerioda",
                SqlDbType = SqlDbType.Decimal,
                Direction = ParameterDirection.Output,
                Precision = 8,
                Scale = 2
            };

            var ukupnaNaknadaZaDatiPeriod = new SqlParameter
            {
                ParameterName = "@ukupnaNaknadaZaDatiPeriod",
                SqlDbType = SqlDbType.Decimal,
                Direction = ParameterDirection.Output,
                Precision = 8,
                Scale = 2
            };
            
            var naknadaUkupno = new SqlParameter
            {
                ParameterName = "@naknadaUkupno",
                SqlDbType = SqlDbType.Decimal,
                Direction = ParameterDirection.Output,
                Precision = 8,
                Scale = 2
            };
            
            var r = _context.IzvjestajTrgovackaKnjigaSintetika.FromSqlRaw($"EXEC GetTrgovackaKnjigaSintetika @prodavnica, @datumOd, @datumDo, @ukupnaNaknadaDoDatogPerioda OUTPUT,  @ukupnaNaknadaZaDatiPeriod OUTPUT, @naknadaUkupno OUTPUT", prodavnica,  datumPocetka, datumKraja, ukupnaNaknadaDoDatogPerioda, ukupnaNaknadaZaDatiPeriod, naknadaUkupno).AsNoTracking().ToList();
            return new Tuple<IEnumerable<IzvjestajTrgovackaKnjigaSintetika>?, decimal, decimal, decimal>(r, (decimal)ukupnaNaknadaDoDatogPerioda.Value, (decimal)ukupnaNaknadaZaDatiPeriod.Value, (decimal)naknadaUkupno.Value);
        }

        public IEnumerable<IzvjestajTrgovackaKnjigaAnalitika> PreuzmiIzvjestajTrgovackaKnjigaAnalitika(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.IzvjestajTrgovackaKnjigaAnalitika.FromSqlInterpolated($"EXEC GetTrgovackaKnjigaAnalitika {korisnickoIme}, {datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<IzvjestajIzdatnica> PreuzmiIzvjestajIzdatnica(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.IzvjestajIzdatnica.FromSqlInterpolated($"EXEC GetIzvjestajIzdatnica {korisnickoIme}, {datumOd}, {datumDo}");
            return r;
        }
    }
}