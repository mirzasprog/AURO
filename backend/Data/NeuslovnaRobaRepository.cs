using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class NeuslovnaRobaRepository : INeuslovnaRobaRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;
        private readonly string? nazivCjenika;
        public NeuslovnaRobaRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            nazivCjenika = _context.Prodavnica.AsNoTracking().SingleOrDefault(p => p.BrojProdavnice == korisnickoIme)?.NazivCjenika;
        }

            public IEnumerable<PregledNeuslovneRobe> PreuzmiNeuslovnuRobu(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledNeuslovneRobe.FromSqlInterpolated($"EXEC [GetNeuslovnaRoba] { korisnickoIme },{datumOd}, {datumDo}");
            return r;
        }
        public bool ArtikalPostoji(string? sifraArtikla)
        {
            bool artikalPostoji = _context.Artikal.Any(a => a.Sifra == sifraArtikla);
            return artikalPostoji;
        }

        public UnesenaNeuslovnaRoba? DodajNeuslovnuRobu(NovaNeuslovnaRoba n)
        {
            int artikalId = _context.Artikal.Single(a => a.Sifra == n.SifraArtikla).ArtikalId;
            string? jedinicaMjere = _context.Artikal.SingleOrDefault(a => a.Sifra == n.SifraArtikla)?.JedinicaMjere;
            
            if (jedinicaMjere == "KO" && !(n.Kolicina % 1 == 0))
                return null;
            decimal nabavnaCijena = _context.Artikal.Single(a => a.ArtikalId == artikalId).NabavnaCijena;

            return new UnesenaNeuslovnaRoba
            {
                SifraArtikla = n.SifraArtikla,
                Naziv = _context.Artikal.SingleOrDefault(a => a.Sifra == n.SifraArtikla)?.Naziv,
                RazlogNeuslovnosti = n.RazlogNeuslovnosti,
                OtpisPovrat = n.OtpisPovrat,
                RazlogPrisustva = n.RazlogPrisustva,
                JedinicaMjere = _context.Artikal.SingleOrDefault(a => a.Sifra == n.SifraArtikla)?.JedinicaMjere,
                Kolicina = n.Kolicina,
                Napomena = n.Napomena,
                NabavnaVrijednost = nabavnaCijena,
                UkupnaVrijednost = Decimal.Round(n.Kolicina * nabavnaCijena, 2)
            };
        }

        
       public void SpremiListuNeuslovneRobe(IEnumerable<NovaNeuslovnaRoba> listaNeuslovneRobe)
       {
        int prodavnicaId = _context.Prodavnica.Single(p => p.BrojProdavnice == korisnickoIme).KorisnikId;
        int korisnikID = _context.Korisnik.AsNoTracking().Single(k => k.Aktivan && k.KorisnickoIme == this.korisnickoIme).KorisnikId;
        string generisaniBrojNR = DateTime.Today.ToString("ddMMyyyy") + "30" + korisnickoIme?.Substring(1, korisnickoIme.Length - 1);
           foreach (var r in listaNeuslovneRobe)
           { 
               var artikal = _context.Artikal.Single(t => t.Sifra == r.SifraArtikla);

            //  bool postojiRoba = _context.NeuslovnaRoba.Any(n => n.ArtikalId == artikal.ArtikalId 
              //   && n.ProdavnicaId == korisnikID && n.DatumKreiranja == DateTime.Today);

             //  if (!postojiRoba)
               
                   _context.NeuslovnaRoba.Add(new NeuslovnaRoba
                   {
                       DatumKreiranja = DateTime.Today,
                       ArtikalId = artikal.ArtikalId,
                       ProdavnicaId = korisnikID,
                       Kolicina = r.Kolicina,
                       UkupnaVrijednost = Decimal.Round(r.Kolicina * artikal.NabavnaCijena, 2),
                       RazlogNeuslovnosti = r.RazlogNeuslovnosti,
                       OtpisPovrat = r.OtpisPovrat,
                       RazlogPrisustva = r.RazlogPrisustva,
                       BrojNeuslovneRobe = generisaniBrojNR,
                       Napomena = r.Napomena,
                       StatusId = 1
                   });
                   
               
         /**      else
               {
                 var postojecaRoba = _context.NeuslovnaRoba.Single(n => n.ArtikalId == artikal.ArtikalId 
                 && n.ProdavnicaId == korisnikID && n.DatumKreiranja == DateTime.Today);
                    //var postojecaRoba = _context.NeuslovnaRoba.Single();
                   
                    decimal ukupnaKolicina = r.Kolicina + postojecaRoba.Kolicina;
                    decimal novaVrijednost = Decimal.Round(r.Kolicina * artikal.NabavnaCijena, 2);
                    var trenutnaRoba = _context.NeuslovnaRoba.Single(i => i.Id == postojecaRoba.Id);

                    trenutnaRoba.DatumKreiranja = DateTime.Today;
                    trenutnaRoba.ArtikalId = postojecaRoba.ArtikalId;
                    trenutnaRoba.Kolicina = ukupnaKolicina;
                    trenutnaRoba.UkupnaVrijednost = novaVrijednost + postojecaRoba.UkupnaVrijednost;
                    trenutnaRoba.RazlogNeuslovnosti = r.RazlogNeuslovnosti;
                    trenutnaRoba.OtpisPovrat = r.OtpisPovrat;
                    trenutnaRoba.RazlogPrisustva = r.RazlogPrisustva;
                    trenutnaRoba.Napomena = r.Napomena;
                   // trenutnaRoba.StatusId = 1;
               }*/
           }
           _context.SaveChanges();
       }

        //Funkcija za izvršavanje procedure za pregled artikala (detalja) neuslovne robe --prodavnica
        public IEnumerable<ArtikliNeuslovneRobeDetalji> PreuzmiArtikleNeuslovneRobe(string brojNeuslovneRobe)
        {
            var r = _context.ArtikliNeuslovneRobeDetalji.FromSqlInterpolated($"EXEC ArtikliNeuslovneRobe {brojNeuslovneRobe}");
            return r;
        }
        //Funkcija za izvršavanje procedure za pregled  neuslovne robe -- interna kontrola
         public IEnumerable<PregledNeuslovneRobe> PregledajNeuslovnuRobuInterna(DateTime datumOd, DateTime datumDo)
        {
            var r = _context.PregledNeuslovneRobe.FromSqlInterpolated($"EXEC PregledNeuslovneRobeInterna {datumOd}, {datumDo}");
            return r;
        }
    }
}