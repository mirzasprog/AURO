using System.Data;
using backend.Entities;
using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class VanredniOtpisRepository : IVanredniOtpisRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;
        private readonly string? nazivCjenika;
        public readonly int? korisnikID;
        public VanredniOtpisRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            korisnikID = _context.Korisnik.AsNoTracking().SingleOrDefault(k => k.Aktivan == true && k.KorisnickoIme == korisnickoIme)?.KorisnikId;
            nazivCjenika = _context.Prodavnica.AsNoTracking().SingleOrDefault(p => p.BrojProdavnice == korisnickoIme)?.NazivCjenika;
        }

        //Provjera 
        public bool ArtikalPostoji(string? sifraArtikla)
        {
            bool artikalPostoji = _context.Artikal.Any(a => a.Sifra == sifraArtikla || a.Barkod == sifraArtikla);
            return artikalPostoji;
        }

        //Funkcija za dodavanje artikala na listu za otpis
        public UneseniVanredniOtpis? DodajVanredniOtpis(NoviVanredniOtpis o)
        {
            int artikalId = _context.Artikal.Single(a => a.Sifra == o.Sifra || a.Barkod == o.Sifra).ArtikalId;
            string? jedinicaMjere = _context.Artikal.SingleOrDefault(a => a.ArtikalId == artikalId)?.JedinicaMjere;

            if (jedinicaMjere == "KO" && !(o.Kolicina % 1 == 0))
                return null;

            decimal nabavnaCijena = _context.Artikal.Single(a => a.ArtikalId == artikalId).NabavnaCijena;

            return new UneseniVanredniOtpis
            {
                Sifra = o.Sifra,
                Naziv = _context.Artikal.SingleOrDefault(a => a.ArtikalId == artikalId)?.Naziv,
                PotrebanTransport = o.PotrebanTransport,
                PotrebnoZbrinjavanje = o.PotrebnoZbrinjavanje,
                Komentar = o.Komentar,
                Razlog = o.Razlog,
                JedinicaMjere = _context.Artikal.SingleOrDefault(a => a.ArtikalId == artikalId)?.JedinicaMjere,
                Kolicina = o.Kolicina,
                NabavnaVrijednost = nabavnaCijena,
                UkupnaVrijednost = Decimal.Round(o.Kolicina * nabavnaCijena, 2)
            };
        }

        //Funkcija za spremanje liste dodanih artikala za otpis u bazu podataka
        public void SpremiListuVanrednihOtpisa(IEnumerable<NoviVanredniOtpis> otpisi)
        {

            int korisnikID = _context.Korisnik.AsNoTracking().Single(k => k.Aktivan && k.KorisnickoIme == this.korisnickoIme).KorisnikId;
            
            int dnevniRedniBroj = 1;

             bool postojiRedniBroj = _context.Otpis.Any(o => o.DatumKreiranja == DateTime.Today && o.TipOtpisaId == 2);

                if (postojiRedniBroj) {
                    string redniBroj = _context.Otpis.OrderByDescending(o => o.Id).First(o => o.DatumKreiranja == DateTime.Today && o.TipOtpisaId == 2).BrojOtpisa;
                    redniBroj = redniBroj.Substring(13);
                    dnevniRedniBroj = Convert.ToInt32(redniBroj) + 1;
                }

                string generisaniBrojOtpisa = DateTime.Today.ToString("ddMMyyyy") + "20" + korisnickoIme?.Substring(1, korisnickoIme.Length - 1) + dnevniRedniBroj;


            foreach (var o in otpisi)
            {
                var otpisaniArtikal = _context.Artikal.Single(t => t.Sifra == o.Sifra || t.Barkod == o.Sifra);
                Otpis trenutniOtpis;

                //if (!postojiOtpis)
                //{
                    trenutniOtpis = new Otpis
                    {
                        BrojOtpisa = generisaniBrojOtpisa,
                        DatumKreiranja = DateTime.Today,
                        PotrebanTransport = o.PotrebanTransport,
                        PotrebnoZbrinjavanje = o.PotrebnoZbrinjavanje,
                        KomentarVanrednogOtpisa = o.Komentar,
                        TipOtpisaId = 2,
                        RazlogOtpisa = o.Razlog,
                        PodnosiocId = korisnikID,
                        ArtikalId = otpisaniArtikal.ArtikalId,
                        Kolicina = o.Kolicina,
                        UkupnaVrijednost = Decimal.Round(o.Kolicina * otpisaniArtikal.NabavnaCijena, 2)
                    };
                    _context.Otpis.Add(trenutniOtpis);
                //}

                /*
                else
                {
                    // update
                    var postojeciOtpis = _context.Otpis.Single(i => i.PodnosiocId == korisnikID && i.DatumKreiranja == DateTime.Today &&
                    i.ArtikalId == otpisaniArtikal.ArtikalId && i.TipOtpisaId == 2);
                    decimal ukupnaKolicina = o.Kolicina + postojeciOtpis.Kolicina;

                    trenutniOtpis = _context.Otpis.Single(o => o.Id == postojeciOtpis.Id);
                    trenutniOtpis.DatumKreiranja = DateTime.Today;
                    trenutniOtpis.KomentarVanrednogOtpisa = o.Komentar;
                    trenutniOtpis.RazlogOtpisa = o.Razlog;
                    trenutniOtpis.PotrebanTransport = o.PotrebanTransport;
                    trenutniOtpis.PotrebnoZbrinjavanje = o.PotrebnoZbrinjavanje;
                    trenutniOtpis.PodnosiocId = korisnikID;
                    trenutniOtpis.Kolicina = ukupnaKolicina;
                    trenutniOtpis.UkupnaVrijednost = Decimal.Round(otpisaniArtikal.NabavnaCijena * ukupnaKolicina, 2);
                }
                */
            }
            _context.SaveChanges();
            DodajOvjerioceOtpisa(generisaniBrojOtpisa);

            //_context.Database.ExecuteSqlInterpolated($"EXEC PosaljiEmailVanredniOtpis {korisnickoIme}");

        }

        public void DodajOvjerioceOtpisa(string brojOtpisa)
        {
            _context.Database.ExecuteSqlInterpolated($"EXEC DodajOvjerioceOtpisa { brojOtpisa }");
        }

        public IEnumerable<PregledOtpisa> PregledajOtpise(DateTime datumOd, DateTime datumDo) {
            var r = _context.PregledOtpisa.FromSqlInterpolated($"EXEC PregledVanrednogOtpisa {korisnickoIme},{datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<DetaljiVanrednogOtpisa> PreuzmiDetaljeOtpisa(string brojOtpisa) {
            var r = _context.DetaljiVanrednogOtpisa.FromSqlInterpolated($"EXEC DetaljiVanrednogOtpisa { brojOtpisa }");
            return r;
        }

         public IEnumerable<DetaljiVanrednogOtpisaOdbijeno> PreuzmiDetaljeOdbijenihOtpisa(string brojOtpisa) 
         {
            var r = _context.DetaljiVanrednogOtpisaOdbijeno.FromSqlInterpolated($"EXEC DetaljiVanrednogOtpisaOdbijeni {brojOtpisa}");
            return r;
         }

        public IEnumerable<DetaljiVanrednogOtpisaOdobreno> PreuzmiDetaljeOdobrenihOtpisa(string brojOtpisa) 
         {
            var r = _context.DetaljiVanrednogOtpisaOdobreno.FromSqlInterpolated($"EXEC DetaljiVanrednogOtpisaOdobreni {brojOtpisa}, {korisnikID}");
            return r;
         }


        public IEnumerable<ZahtjeviVanredniOtpis> PregledajZahtjeveVanrednihOtpisa() {
            var r = _context.ZahtjeviVanredniOtpis.FromSqlInterpolated($"EXEC ZahtjeviVanredniOtpisProdavnica { korisnickoIme }");
            return r;
        }
        
        public IEnumerable<ZahtjeviVanredniOtpisDetalji> PregledajZahtjeveVanrednihOtpisaDetalji(string brojOtpisa) {
            var r = _context.ZahtjeviVanredniOtpisDetalji.FromSqlInterpolated($"EXEC ZahtjeviVanredniOtpisArtikliMenadzer { brojOtpisa }, {korisnikID}");
            return r;
        }

         public IEnumerable<ZavrseniVanredniZahtjevi> PregledajZavrseneVanredneZahtjeve(DateTime datumOd, DateTime datumDo) 
        {
            var r = _context.ZavrseniVanredniZahtjevi.FromSqlInterpolated($"EXEC ZavrseniZahtjeviVanrednogOtpisa {korisnikID}, {datumOd}, {datumDo}");
            return r;
        }

        public void OdobriOtpis(OdobravanjeOtpisa o) {
            int korisnikID = _context.Korisnik.AsNoTracking().Single(k => k.Aktivan && k.KorisnickoIme == this.korisnickoIme).KorisnikId;
            _context.Database.ExecuteSqlInterpolated($"EXEC OvjeriOtpis {o.BrojOtpisa}, {o.Status}, {o.Komentar}, {korisnikID}");
        }

        public void OdbijArtikle(ListaOdbijenihArtikala listaArtikala) {

            DataTable tvp = new DataTable();
            tvp.Columns.Add(new DataColumn("ID", typeof(int)));
            tvp.Columns.Add(new DataColumn("Komentar", typeof(string)));

            foreach (var artikal in listaArtikala.Artikli.Zip(listaArtikala.Komentari, Tuple.Create))
            {
                tvp.Rows.Add(artikal.Item1, artikal.Item2);
            }

            var parametar =  new SqlParameter("@listaArtikala", SqlDbType.Structured);
            parametar.Value = tvp;
            parametar.TypeName = "listaOtpisanihArtikala";
            _context.Database.ExecuteSqlInterpolated($"EXEC OdbijArtikle {listaArtikala.BrojOtpisa}, {korisnikID}, {parametar}");
        }


        public void ReklamacijaKvaliteta(IEnumerable<tbl_ReklamacijeKvaliteta > lista)
        {
            DateTime danasnjiDatum = DateTime.Today;
            foreach (var o in lista)
            {
                var otpisaniArtikal = _context.Artikal.Single(t => t.Sifra == o.SifraArtikla);
                tbl_ReklamacijeKvaliteta  listaArtikala;

                    listaArtikala = new tbl_ReklamacijeKvaliteta
                    {
                        SifraArtikla = o.SifraArtikla,
                        Naziv = o.Naziv,
                        Datum = danasnjiDatum,
                        DatumPrijema = o.DatumPrijema.ToLocalTime(),
                        BrojProdavnice = o.BrojProdavnice,
                        Komentar = o.Komentar,
                        Razlog = o.Razlog,
                        JedinicaMjere = o.JedinicaMjere,
                        Kolicina = o.Kolicina,
                        BrojDokumenta = o.BrojDokumenta,
                        ReklamiranaKolicina = o.ReklamiranaKolicina,
                        Lot = o.Lot,
                        BrojZaduzenjaMLP = o.BrojZaduzenjaMLP,

                    };
                    _context.tbl_ReklamacijeKvaliteta.Add(listaArtikala);
             
            }
                    _context.SaveChanges();

            }

        public IEnumerable<GetPodaciReklamacije > PregledReklamacijaKvaliteta(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.GetPodaciReklamacije.FromSqlInterpolated($"EXEC GetReklamacijeKvaliteta {datumOd}, {datumDo}");
            return r;
        }

        public IEnumerable<DetaljiArtiklaReklamacija> DetaljiArtiklaReklamacije(string SifraArtikla)
        {
            var r = _context.DetaljiArtiklaReklamacija.FromSqlInterpolated($"EXEC GetPodaciArtiklaReklamacija {SifraArtikla}");
            return r;
        }

    }
}