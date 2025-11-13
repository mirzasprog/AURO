using System.Data;
using backend.Entities;
using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class RedovniOtpisRepository : IRedovniOtpisRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;
        public readonly int? korisnikID;
        private readonly string? nazivCjenika;

        public RedovniOtpisRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            korisnikID = _context.Korisnik.AsNoTracking().SingleOrDefault(k => k.Aktivan == true && k.KorisnickoIme == korisnickoIme)?.KorisnikId;
            nazivCjenika = _context.Prodavnica.AsNoTracking().SingleOrDefault(p => p.BrojProdavnice == korisnickoIme)?.NazivCjenika;
        }

        public bool ArtikalPostoji(string? sifraArtikla)
        {
            bool artikalPostoji = _context.Artikal.Any(a => a.Sifra == sifraArtikla || a.Barkod == sifraArtikla);
            return artikalPostoji;
        }

        public UneseniRedovniOtpis? DodajOtpis(NoviRedovniOtpis o)
        {
            int artikalId = _context.Artikal.Single(a => a.Sifra == o.Sifra || a.Barkod == o.Sifra).ArtikalId;
            string? jedinicaMjere = _context.Artikal.SingleOrDefault(a => a.ArtikalId == artikalId)?.JedinicaMjere;

            if (jedinicaMjere == "KO" && !(o.Kolicina % 1 == 0))
                return null;
            decimal nabavnaCijena = _context.Artikal.Single(a => a.ArtikalId == artikalId).NabavnaCijena;

            return new UneseniRedovniOtpis
            {
                Sifra = o.Sifra,
                Naziv = _context.Artikal.SingleOrDefault(a => a.ArtikalId == artikalId)?.Naziv,
                ProvedenoSnizenje = o.ProvedenoSnizenje,
                Razlog = o.Razlog,
                JedinicaMjere = _context.Artikal.SingleOrDefault(a => a.ArtikalId == artikalId)?.JedinicaMjere,
                Kolicina = o.Kolicina,
                NabavnaVrijednost = nabavnaCijena,
                UkupnaVrijednost = Decimal.Round(o.Kolicina * nabavnaCijena, 2),
                DatumIstekaRoka = o.DatumIstekaRoka
            };
        }

        public void SpremiListuOtpisa(IEnumerable<NoviRedovniOtpis> otpisi)
        {
            int korisnikID = _context.Korisnik.AsNoTracking().Single(k => k.Aktivan && k.KorisnickoIme == this.korisnickoIme).KorisnikId;
            int dnevniRedniBroj = 1;
            //int dnevniRedniBroj = _context.Otpis.Count(o => o.DatumKreiranja == DateTime.Today) + 1;
            bool postojiRedniBroj = _context.Otpis.Any(o => o.DatumKreiranja == DateTime.Today && o.TipOtpisaId == 1);
            if (postojiRedniBroj)
            {
                string redniBroj = _context.Otpis.OrderByDescending(o => o.Id).First(o => o.DatumKreiranja == DateTime.Today && o.TipOtpisaId == 1).BrojOtpisa;
                redniBroj = redniBroj.Substring(13);
                dnevniRedniBroj = Convert.ToInt32(redniBroj) + 1;
            }
            string generisaniBrojOtpisa = DateTime.Today.ToString("ddMMyyyy") + "10" + korisnickoIme?.Substring(1, korisnickoIme.Length - 1) + dnevniRedniBroj;
            foreach (var uneseniOtpis in otpisi)
            {
                var otpisaniArtikal = _context.Artikal.Single(t => t.Sifra == uneseniOtpis.Sifra || t.Barkod == uneseniOtpis.Sifra);
                Otpis trenutniOtpis;

                DateTime? uneseniDatumIsteka = (uneseniOtpis.DatumIstekaRoka.HasValue ? uneseniOtpis.DatumIstekaRoka.Value.ToLocalTime() : null);

                trenutniOtpis = new Otpis
                {
                    BrojOtpisa = generisaniBrojOtpisa,
                    DatumKreiranja = DateTime.Today,
                    ProvedenoSnizenje = uneseniOtpis.ProvedenoSnizenje,
                    TipOtpisaId = 1,
                    RazlogOtpisa = uneseniOtpis.Razlog,
                    PodnosiocId = korisnikID,
                    ArtikalId = otpisaniArtikal.ArtikalId,
                    Kolicina = uneseniOtpis.Kolicina,
                    UkupnaVrijednost = Decimal.Round(uneseniOtpis.Kolicina * otpisaniArtikal.NabavnaCijena, 2),
                    DatumIstekaRoka = uneseniOtpis.DatumIstekaRoka.HasValue ? uneseniOtpis.DatumIstekaRoka.Value.ToLocalTime() : null
                };
                _context.Otpis.Add(trenutniOtpis);

                //bool postojiOtpis = _context.Otpis.Any(o => o.ArtikalId == otpisaniArtikal.ArtikalId
                //       && o.PodnosiocId == korisnikID && o.DatumKreiranja == DateTime.Today && o.TipOtpisaId == 1 && o.DatumIstekaRoka == uneseniDatumIsteka && o.RazlogOtpisa == uneseniOtpis.Razlog);

                // INSERT
                /*
                if (!postojiOtpis)
                {
                    trenutniOtpis = new Otpis
                    {
                        BrojOtpisa = generisaniBrojOtpisa,
                        DatumKreiranja = DateTime.Today,
                        ProvedenoSnizenje = uneseniOtpis.ProvedenoSnizenje,
                        TipOtpisaId = 1,
                        RazlogOtpisa = uneseniOtpis.Razlog,
                        PodnosiocId = korisnikID,
                        ArtikalId = otpisaniArtikal.ArtikalId,
                        Kolicina = uneseniOtpis.Kolicina,
                        UkupnaVrijednost = Decimal.Round(uneseniOtpis.Kolicina * otpisaniArtikal.NabavnaCijena, 2),
                        DatumIstekaRoka = uneseniOtpis.DatumIstekaRoka.HasValue ? uneseniOtpis.DatumIstekaRoka.Value.ToLocalTime() : null
                    };
                    _context.Otpis.Add(trenutniOtpis);
                }
                
                else
                {
                    // UPDATE
                    var postojeciOtpis = _context.Otpis.Single(i => i.PodnosiocId == korisnikID && i.DatumKreiranja == DateTime.Today &&
                    i.ArtikalId == otpisaniArtikal.ArtikalId && i.TipOtpisaId == 1 && i.DatumIstekaRoka == (uneseniOtpis.DatumIstekaRoka.HasValue ? uneseniOtpis.DatumIstekaRoka.Value.ToLocalTime() : null) && i.RazlogOtpisa == uneseniOtpis.Razlog);
                    decimal ukupnaKolicina = uneseniOtpis.Kolicina + postojeciOtpis.Kolicina;

                    trenutniOtpis = _context.Otpis.Single(o => o.Id == postojeciOtpis.Id);
                    trenutniOtpis.DatumKreiranja = DateTime.Today;
                    trenutniOtpis.ProvedenoSnizenje = uneseniOtpis.ProvedenoSnizenje;
                    trenutniOtpis.RazlogOtpisa = uneseniOtpis.Razlog;
                    trenutniOtpis.PodnosiocId = korisnikID;
                    trenutniOtpis.Kolicina = ukupnaKolicina;
                    trenutniOtpis.UkupnaVrijednost = Decimal.Round(otpisaniArtikal.NabavnaCijena * ukupnaKolicina, 2);
                    trenutniOtpis.DatumIstekaRoka = uneseniOtpis.DatumIstekaRoka.HasValue ? uneseniOtpis.DatumIstekaRoka.Value.ToLocalTime() : null;
                }
                */
            }

            _context.SaveChanges();
            DodajOvjerioceOtpisa(generisaniBrojOtpisa);

            /*
                int ovjerilacID = _context.HijerarhijaOdobravanja.Single(m => m.ProdavnicaId == korisnikID && m.RedniBroj == 1).MenadzerId;
                string ovjerilacEmail = _context.Korisnik.AsNoTracking().Single(k => k.Aktivan && k.KorisnikId == ovjerilacID).Email;
                string tekst = $"<p>Poštovani, <br/> Prodavnica {korisnickoIme} je izvršila redovni otpis artikala. Broj otpisa: { generisaniBrojOtpisa } </p>";
            */

            //_context.Database.ExecuteSqlInterpolated($"EXEC PosaljiEmail {ovjerilacEmail}, {generisaniBrojOtpisa}, {tekst}");
        }

        public bool OmogucenDatumOtpisa()
        {
            bool omogucenUnos = _context.DatumOtpisa.AsNoTracking().Any(d => d.DatumOd <= DateTime.Today && d.DatumDo >= DateTime.Today);
            return omogucenUnos;
        }

        // provjerava da li je prodavnica prijavila da nema otpisa za odredjeni vremenski period
        public bool NemaOtpisa()
        {
        DateTime? zadnjiPrijavljeniDatum = _context.ProdavniceBezOtpisa.AsNoTracking().Where(p => p.BrojProdavnice == korisnickoIme)?.OrderByDescending(d => d.DatumUnosa)?.FirstOrDefault()?.DatumUnosa;
        //provjera da li je zadnjiPrijavljeniDatum u intervalu datuma kada se vrsi otpis
        bool rezultat = _context.DatumOtpisa.AsNoTracking().Any(d => d.DatumOd <= zadnjiPrijavljeniDatum && d.DatumDo >= zadnjiPrijavljeniDatum);
        return rezultat;
        }

        public void SpremiProdavnicaNemaOtpisa()
        {
             _context.Database.ExecuteSqlInterpolated($"EXEC EvidentirajProdavniceBezOtpisa {korisnickoIme}");
        }

        public IEnumerable<PregledOtpisa> PregledajOtpise(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledOtpisa.FromSqlInterpolated($"EXEC PregledRedovnogOtpisa {korisnickoIme},{datumOd}, {datumDo}");
            return r;
        }
         public IEnumerable<PregledOtpisa> PregledajStatistikuRedovnogOtpisa()
        {
            var r = _context.PregledOtpisa.FromSqlInterpolated($"EXEC GetRedovniOtpisStatistika {korisnickoIme}");
            return r;
        }

        public IEnumerable<NemaOtpisa> PregledInternaNemaOtpisa(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.NemaOtpisa.FromSqlInterpolated($"EXEC PregledProdavnicaBezOtpisa {datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<NemaOtpisa> PregledNemaOtpisa(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.NemaOtpisa.FromSqlInterpolated($"EXEC ProdavnicaBezOtpisa {korisnickoIme}, {datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<PregledDinamike> PregledajDinamikuOtpisa(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledDinamike.FromSqlInterpolated($"EXEC PregledajDatumeRedovnogOtpisa {datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<PregledOtpisaInterna> PregledajOtpiseInterna(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledOtpisaInterna.FromSqlInterpolated($"EXEC PregledRedovnogOtpisaInterna {datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<PregledOtpisa> PregledajVanredneOtpiseInterna(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledOtpisa.FromSqlInterpolated($"EXEC PregledVanrednihOtpisaInterna {datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<DetaljiRedovnogOtpisa> PreuzmiDetaljeOtpisa(string brojOtpisa)
        {
            var r = _context.DetaljiRedovnogOtpisa.FromSqlInterpolated($"EXEC DetaljiRedovnogOtpisa {brojOtpisa}");
            return r;
        }

        public IEnumerable<DetaljiRedovnogOtpisaOdbijeno> PreuzmiDetaljeOdbijenihOtpisa(string brojOtpisa)
        {
            var r = _context.DetaljiRedovnogOtpisaOdbijeno.FromSqlInterpolated($"EXEC DetaljiRedovnogOtpisaOdbijeni {brojOtpisa}");
            return r;
        }

        public IEnumerable<DetaljiRedovnogOtpisaOdobreno> PreuzmiDetaljeOdobrenihOtpisa(string brojOtpisa)
        {
            var r = _context.DetaljiRedovnogOtpisaOdobreno.FromSqlInterpolated($"EXEC DetaljiRedovnogOtpisaOdobreni {brojOtpisa}, {korisnikID}");
            return r;
        }

        public IEnumerable<ZahtjeviRedovniOtpis> PregledajZahtjeveRedovnihOtpisa()
        {
            var r = _context.ZahtjeviRedovniOtpis.FromSqlInterpolated($"EXEC ZahtjeviRedovniOtpisMenadzer {korisnickoIme}");
            return r;
        }

        public IEnumerable<ZahtjeviRedovniOtpisDetalji> PregledajZahtjeveRedovnihOtpisaDetalji(string brojOtpisa)
        {
            var r = _context.ZahtjeviRedovniOtpisDetalji.FromSqlInterpolated($"EXEC ZahtjeviRedovniOtpisArtikliMenadzer {brojOtpisa}, {korisnikID}");
            return r;
        }

        public void UnosDatumaOtpisa(UnosDatumaOtpisa datum)
        {
            _context.Database.ExecuteSqlInterpolated($"EXEC DodajDatumRedovnogOtpisa {datum.DatumOd.ToLocalTime()}, {datum.DatumDo.ToLocalTime()}");
        }

        public void DodajOvjerioceOtpisa(string brojOtpisa)
        {
            _context.Database.ExecuteSqlInterpolated($"EXEC DodajOvjerioceOtpisa {brojOtpisa}");
        }

        public void OdobriOtpis(OdobravanjeOtpisa o)
        {
            int korisnikID = _context.Korisnik.AsNoTracking().Single(k => k.Aktivan && k.KorisnickoIme == this.korisnickoIme).KorisnikId;
            _context.Database.ExecuteSqlInterpolated($"EXEC OvjeriOtpis {o.BrojOtpisa}, {o.Status}, {o.Komentar}, {korisnikID}");
        }

        public void OdbijArtikle(ListaOdbijenihArtikala listaArtikala)
        {
            DataTable tvp = new DataTable();
            tvp.Columns.Add(new DataColumn("ID", typeof(int)));
            tvp.Columns.Add(new DataColumn("Komentar", typeof(string)));
            foreach (var artikal in listaArtikala.Artikli.Zip(listaArtikala.Komentari, Tuple.Create))
            {
                tvp.Rows.Add(artikal.Item1, artikal.Item2);
            }
            var parametar = new SqlParameter("@listaArtikala", SqlDbType.Structured);
            parametar.Value = tvp;
            parametar.TypeName = "listaOtpisanihArtikala";
            _context.Database.ExecuteSqlInterpolated($"EXEC OdbijArtikle {listaArtikala.BrojOtpisa}, {korisnikID}, {parametar}");
        }

        public IEnumerable<ZavrseniRedovniZahtjevi> PregledajZavrseneRedovneZahtjeve(DateTime datumOd, DateTime datumDo) 
        {
            var r = _context.ZavrseniRedovniZahtjevi.FromSqlInterpolated($"EXEC ZavrseniZahtjeviRedovnogOtpisa {korisnikID}, {datumOd}, {datumDo}");
            return r;
        }
         public IEnumerable<Statistika> PregledajStatistiku()
        {
           var r = _context.Statistika.FromSqlInterpolated($"EXEC GetRedovniOtpisStatistika {korisnickoIme}");
            return r;
        }

        public void UnosDatumaInventure(UnosDatumaOtpisa datum)
        {
            _context.Database.ExecuteSqlInterpolated($"EXEC DodajDatumOdobrenjaInventure {datum.DatumOd.ToLocalTime()}, {datum.DatumDo.ToLocalTime()}");
        }

        public bool ProvjeraOdobravanjeInventure()
        {
            bool unos = _context.T_DatumOdobravanjaInventure.AsNoTracking().Any(d => d.DatumOd <= DateTime.Today && d.DatumDo >= DateTime.Today);
            return unos;
        }

    }

}