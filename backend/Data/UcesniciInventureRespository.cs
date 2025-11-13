using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class UcesniciInventureRepository : IUcesniciInventureRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? prodavnica;

        public UcesniciInventureRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            prodavnica = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }
        public UneseniUcesniciInventure? DodajUnos(UnosUcesnikaInventure i)
        {
            return new UneseniUcesniciInventure
            {
                Ime = i.Ime,
                Prezime = i.Prezime,
                BrojProdavniceUcesnika = i.BrojProdavniceUcesnika,
                VrijemePocetka= i.VrijemePocetka,
                VrijemeZavrsetka= i.VrijemeZavrsetka,
                RolaNaInventuri = i.RolaNaInventuri
            };
        }

        public void SpremiListuUcesnika(IEnumerable<UnosUcesnikaInventure> ucesnici)
        {

            foreach (var i in ucesnici)
            {
                _context.UcesniciInventure.Add(new UcesniciInventure
                {
                    Datum = DateTime.Now,
                    Ime = i.Ime,
                    Prezime = i.Prezime,
                    BrojProdavnice = prodavnica,
                    BrojProdavniceUcesnika = i.BrojProdavniceUcesnika,
                    VrijemePocetka= i.VrijemePocetka.ToLocalTime(),
                    VrijemeZavrsetka= i.VrijemeZavrsetka.ToLocalTime(),
                    RolaNaInventuri = i.RolaNaInventuri
                });
            }
            _context.SaveChanges();
        }

        public IEnumerable<PregledUcesnika> PregledajUcesnikeInvenure(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledUcesnika.FromSqlInterpolated($"EXEC PregledUcesnikaInventure {prodavnica}, {datumOd}, {datumDo}");
            return r;
        }

    }
}
