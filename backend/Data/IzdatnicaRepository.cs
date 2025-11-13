using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class IzdatnicaRepository : IIzdatnicaRepository
    {
        private readonly Auro2Context _context;
        public readonly int? korisnikID;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;
        public IzdatnicaRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }

        

        public UnesenaIzdatnica? DodajIzdatnicu(NovaIzdatnica i)
        {
            var artikal = _context.Artikal.Single(a => a.Sifra == i.Sifra);

            if (artikal.JedinicaMjere == "KO" && !(i.Kolicina % 1 == 0))
                return null;

            return new UnesenaIzdatnica
            {
                Sifra = i.Sifra,
                Naziv = artikal.Naziv,
                JedinicaMjere = artikal.JedinicaMjere,
                Kolicina = i.Kolicina,
                Cijena = artikal.Cijena,
                UkupnaVrijednostMPC = Decimal.Round(i.Kolicina * artikal.Cijena, 2),
                NabavnaCijena = artikal.NabavnaCijena,
                UkupnaVrijednostNC = Decimal.Round(i.Kolicina * artikal.NabavnaCijena, 2),
                Razlog = i.Razlog,
                Komentar = i.Komentar,
                DatumIzradeIzdatnice = i.DatumIzradeIzdatnice

            };
        }

        public void SpremiListuIzdatnica(IEnumerable<NovaIzdatnica> izdatnice)
        {
            int prodavnicaId = _context.Prodavnica.Single(p => p.BrojProdavnice == korisnickoIme).KorisnikId;
            string generisaniBrojIzdatnice = DateTime.Today.ToString("ddMMyyyy") + "30" + korisnickoIme?.Substring(1, korisnickoIme.Length - 1);

            foreach (var i in izdatnice)
            {
                var uneseniArtikal = _context.Artikal.Single(t => t.Sifra == i.Sifra);

                bool postojiIzdatnica = _context.Izdatnica.Any(i => i.ArtikalId == uneseniArtikal.ArtikalId
                   && i.ProdavnicaId == prodavnicaId && i.DatumKreiranja == DateTime.Today);

                if (!postojiIzdatnica)
                {
                    _context.Izdatnica.Add(new Izdatnica
                    {
                        ArtikalId = uneseniArtikal.ArtikalId,
                        DatumKreiranja = DateTime.Today,
                        Razlog = i.Razlog,
                        Kolicina = i.Kolicina,
                        Komentar = i.Komentar,
                        ProdavnicaId = prodavnicaId,
                        BrojIzdatnice = generisaniBrojIzdatnice,
                        UkupnaVrijednost = Decimal.Round(i.Kolicina * uneseniArtikal.NabavnaCijena, 2),
                        DatumIzradeIzdatnice = i.DatumIzradeIzdatnice.ToLocalTime()
                    });
                }
                else
                {
                    var postojecaIzdatnica = _context.Izdatnica.Single(i => i.ProdavnicaId == prodavnicaId && i.DatumKreiranja == DateTime.Today &&
                    i.ArtikalId == uneseniArtikal.ArtikalId);

                    decimal ukupnaKolicina = i.Kolicina + postojecaIzdatnica.Kolicina;

                    var trenutnaIzdatnica = _context.Izdatnica.Single(i => i.Id == postojecaIzdatnica.Id);

                    trenutnaIzdatnica.DatumKreiranja = DateTime.Today;
                    trenutnaIzdatnica.DatumIzradeIzdatnice = i.DatumIzradeIzdatnice;
                    trenutnaIzdatnica.Razlog = i.Razlog;
                    trenutnaIzdatnica.ArtikalId = postojecaIzdatnica.ArtikalId;
                    trenutnaIzdatnica.Kolicina = ukupnaKolicina;
                    trenutnaIzdatnica.Komentar = i.Komentar;
                }
            }
            _context.SaveChanges();
        }

        public bool ArtikalPostoji(string? sifraArtikla)
        {
            bool artikalPostoji = _context.Artikal.Any(a => a.Sifra == sifraArtikla);
            return artikalPostoji;
        }
        public IEnumerable<PregledIzdatnica> PreuzmiIzdatnice(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledIzdatnica.FromSqlInterpolated($"EXEC PregledIzdatnicaTroska { korisnickoIme },{datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<IzvjestajIzdatnica> PreuzmiIzvjestajIzdatnica(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.IzvjestajIzdatnica.FromSqlInterpolated($"EXEC GetIzvjestajIzdatnica {korisnickoIme}, {datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<ZahtjeviIzdatniceDetalji> PregledajZahtjeveIzdatniceDetalji(string brojIzdatnice)
        {
            var r = _context.ZahtjeviIzdatniceDetalji.FromSqlInterpolated($"EXEC ZahtjeviIzdatniceArtikli {brojIzdatnice}, {korisnikID}");
            return (IEnumerable<ZahtjeviIzdatniceDetalji>)r;
        }

        public IEnumerable<ZahtjeviIzdatnice> PregledajZahtjeveIzdatnica()
        {
            var r = _context.ZahtjeviIzdatnice.FromSqlInterpolated($"EXEC ZahtjeviIzdatniceMenadzer {korisnickoIme}");
            return r;
        }
        public IEnumerable<ArtikliIzdatniceDetalji> PreuzmiArtikleIzdatnice(string brojIzdatnice)
        {
            var r = _context.ArtikliIzdatniceDetalji.FromSqlInterpolated($"EXEC ArtikliIzdatniceTroska {brojIzdatnice}");
            return r;
        }
        public IEnumerable<PregledIzdatnicaInterna> PregledajIzdatniceInterna(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledIzdatnicaInterna.FromSqlInterpolated($"EXEC PregledIzdatnicaTroskaInterna {datumOd}, {datumDo}");
            return r;
        }
    }
}