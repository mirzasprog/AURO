using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ParcijalnaInventuraRepository : IParcijalnaInventuraRepository
    {
        private readonly Auro2Context _context;
        public readonly int? korisnikID;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;
        public ParcijalnaInventuraRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            korisnikID = _context.Korisnik.AsNoTracking().SingleOrDefault(k => k.KorisnickoIme == korisnickoIme)?.KorisnikId;
        }

        public void SpremiUbazu(IEnumerable<ListaZaposlenikaParcijalneInventure> listaZaposlenikaParcijalneInventure)
        {
            
          //  bool postojePodaci = _context.ParcijalnaInventuraImportZaposlenika.Any(p => p.DatumUcitavanja.Month == DateTime.Now.Month && p.DatumUcitavanja.Year == DateTime.Now.Year);

            //if (postojePodaci)
            //{
                _context.Database.ExecuteSqlRaw("TRUNCATE TABLE ParcijalnaInventuraImportZaposlenika");
            //}
            

            foreach (var zaposlenik in listaZaposlenikaParcijalneInventure)
            {
                ParcijalnaInventuraImportZaposlenika trenutniUnos;

                trenutniUnos = new ParcijalnaInventuraImportZaposlenika
                {
                    BrojIzMaticneKnjige = int.Parse(zaposlenik.BrojIzDESa),
                    Ime = zaposlenik.Ime,
                    Prezime = zaposlenik.Prezime,
                    RadnoMjesto = zaposlenik.Rm,
                    OznakaOJ = zaposlenik.OrgJed,
                    NazivOJ = zaposlenik.NazivOrg,
                    Entitet = zaposlenik.Entitet,
                    DatumUcitavanja = DateTime.Now,
                    PodrucniVoditelj = zaposlenik.PV,
                    Format = zaposlenik.Format,
                    Tip = zaposlenik.Tip
                };
                _context.ParcijalnaInventuraImportZaposlenika.Add(trenutniUnos);
            }

            _context.SaveChanges();
        }

        public IEnumerable<ResponseZaposleniciParcijalneInventure> GetZaposleniciParcijalneInventure(string brojProdavnice)
        {
            return _context.ResponseZaposleniciParcijalneInventure.FromSqlInterpolated($"EXEC GetZaposleniciParcijalneInventure {brojProdavnice}").AsNoTracking();
        }

        public IEnumerable<ResponseParcijalneInventurePodrucni> GetParcijalneInventurePodrucniStavke(string datum, string brojProdavnice, string brojDokumenta)
        {
            return _context.ResponseParcijalneInventurePodrucni.FromSqlInterpolated($"EXEC GetParcijalneInventurePodrucniStavke {datum}, {brojProdavnice}, {korisnikID}, {brojDokumenta}").AsNoTracking();
        }

        public IEnumerable<ResponseParcijalneInventurePodrucniZaglavlje> GetParcijalneInventurePodrucniZaglavlje(string datum)
        {
            return _context.ResponseParcijalneInventurePodrucniZaglavlje.FromSqlInterpolated($"EXEC GetParcijalneInventurePodrucniZaglavlje {datum}, {korisnikID}").AsNoTracking();
        }

        public void PodrucniOdobriOdbijParcijalnuInventuru(PodrucniOdobriOdbijeParcijalnuInventuru unos)
        {
            _context.Database.ExecuteSqlInterpolated($"EXEC PodrucniOdobravanjeParcijalneInventure {unos.BrojProd}, {unos.Datum}, {unos.Status}, {unos.Napomena}, {korisnikID}");
        }

        public IEnumerable<IzvjestajParcijalnaInventuraInternaKontrola> GetIzvjestajParcijalnihInventuraZaInternuKontrolu(string datum, string vrstaInventure)
        {
            return _context.IzvjestajParcijalnaInventuraInternaKontrola.FromSqlInterpolated($"EXEC IzvjestajParcijalnihInventuraZaInternuKontrolu {datum}, {vrstaInventure}").AsNoTracking();
        }        
        
        public IEnumerable<IzvjestajPotpunihInventuraInterna> GetIzvjestajPotpunihInventuraZaInternuKontrolu(string datum, string vrstaInventure)
        {
            return _context.IzvjestajPotpunihInventuraInterna.FromSqlInterpolated($"EXEC IzvjestajParcijalnihInventuraZaInternuKontrolu {datum}, {vrstaInventure}").AsNoTracking();
        }

        public void SpremiParcijalneInventure(RequestParcijalneInventure uneseniPodaci)
        {
            // Provjera da li postoji unos za dati datum inventure i organizacionu jedinicu
            var postojiUnos = _context.ParcijalnaInventura
                .Any(s => s.DatumInventure == uneseniPodaci.DatumInventure && s.OrgJed == uneseniPodaci.OrgJed && s.VrstaInventure == uneseniPodaci.Podaci.ElementAt(0).VrstaInventure);

            if (postojiUnos)
            {
                // Ažuriranje postojećih podataka
               // var postojeciUnosi = _context.ParcijalnaInventura
               //     .Where(p => p.DatumInventure == uneseniPodaci.DatumInventure && p.OrgJed == uneseniPodaci.OrgJed)
               //     .ToList();

                foreach (var unos in uneseniPodaci.Podaci)
                {
                var trenutniPodatak = _context.ParcijalnaInventura
                    .FirstOrDefault(p => p.BrojIzDESa == unos.BrojIzDESa && p.OrgJed == uneseniPodaci.OrgJed && p.DatumInventure == uneseniPodaci.DatumInventure);
                /**
                    if (trenutniPodatak != null)
                    {
                        trenutniPodatak.IznosZaIsplatu += unos.IznosZaIsplatu;
                        trenutniPodatak.BrojSati += unos.BrojSati;
                        trenutniPodatak.BrojDana += unos.BrojDana;
                        trenutniPodatak.BrojMinuta += unos.BrojMinuta;
                        trenutniPodatak.Status = "Na čekanju";
                        trenutniPodatak.VrstaInventure = unos.VrstaInventure;
                        trenutniPodatak.RolaNaInventuri = unos.RolaNaInventuri;
                    //    trenutniPodatak.IDInventure = unos.IDInventure;
                        _context.ParcijalnaInventura.Update(trenutniPodatak);
                    } */
                } 
              //  _context.SaveChanges();
            } 

                // Unos novih podataka
                foreach (var podatak in uneseniPodaci.Podaci)
                {
                    var noviUnos = new ParcijalnaInventura
                    {
                        IznosZaIsplatu = podatak.IznosZaIsplatu,
                        BrojSati = podatak.BrojSati,
                        BrojDana = podatak.BrojDana,
                        BrojMinuta = podatak.BrojMinuta,
                        PodrucniVoditelj = uneseniPodaci.Pv,
                        BrojProdavnice = uneseniPodaci.BrojProdavnice,
                        Ime = podatak.Ime,
                        Prezime = podatak.Prezime,
                        BrojIzDESa = podatak.BrojIzDESa,
                        OrgJed = podatak.OrgJedUposlenika,
                        DatumInventure = uneseniPodaci.DatumInventure,
                        Status = uneseniPodaci.Status,
                        VrstaInventure = podatak.VrstaInventure,
                        RolaNaInventuri = podatak.RolaNaInventuri,
                        BrojDokumenta = uneseniPodaci.BrojDokumenta,
                    };
                    _context.ParcijalnaInventura.Add(noviUnos);

                    _context.SaveChanges();
            }

            string[] imePrezimePodrucnog = uneseniPodaci.Pv.ToLower().Split(" ");
            string emailPodrucnog =   imePrezimePodrucnog[0].Replace("ć", "c").Replace("đ", "dj").Replace("č", "c").Replace("ž", "z").Replace("š", "s") + "." + imePrezimePodrucnog[1].Replace("ć", "c").Replace("đ", "dj").Replace("č", "c").Replace("ž", "z").Replace("š", "s");
         
            string naslov = "Auro - Inventura";

            string poruka = "<p>Poštovani,</p> <p>Prodavnica " + uneseniPodaci.OrgJed + " je poslala učesnike " + uneseniPodaci.Podaci.ElementAt(0).VrstaInventure + " inventure koje trebate odobriti u aplikaciji Auro!</p>";
            
            foreach (var podatak in uneseniPodaci.Podaci)
            {
            if(podatak.VrstaInventure == "parcijalna")
            {
            _context.Database.ExecuteSqlInterpolated($"EXEC PosaljiEmailPodrucnimParcijalnaInventura {emailPodrucnog}, {naslov}, {poruka}");
            break;
            }
            }
        }

        public List<string?> GetProdavniceParcijalnaInventuraNezavrseno(string datumInventure)
        {
            return _context.ResponseProdavniceParcijalnaInventuraNezavrseno.FromSqlInterpolated($"EXEC GetProdavniceNezavrseneParcijalneInventurePodrucni {korisnikID}, {datumInventure}").AsEnumerable().Select(p => p.Prodavnice).ToList();
        }

        public void SpremiListuParcijalnihInventura(IEnumerable<PodrucniOdobriOdbijeParcijalnuInventuru> unosi) {

            foreach (var unos in unosi)
                {
                    var trenutniPodatak = _context.ParcijalnaInventura.Where(p => p.DatumInventure == unos.Datum && p.OrgJed.Substring(4,4) == unos.BrojProd && p.BrojDokumenta == unos.BrojDokumenta);

                    if (trenutniPodatak != null)
                    {
                       foreach(var p in trenutniPodatak) {
                        p.Status = unos.Status;
                        p.Napomena = unos.Napomena;

                        _context.ParcijalnaInventura.Update(p);
                       }

                    }
                }
                _context.SaveChanges();
        }

        public IEnumerable<ImenaUposlenikaNaInventuri> GetUposlenici()
        {
            return _context.GetUposlenici.FromSqlInterpolated($"EXEC GetImenaUposlenikaZaInventuru").AsNoTracking();
        }

        public IEnumerable<PodaciUposlenikaParcijalnaInv> GetPodaciUposlenikaPotpunaInv(string ime, string prezime)
        {
            return _context.GetPodaciUposlenikaParcijalnaInv.FromSqlInterpolated($"EXEC GetPodaciUposlenikaNaInventuri {ime}, {prezime}").AsNoTracking();
        }

        public IEnumerable<ResponseParcijalneInventurePodrucniZaglavlje> GetParcijalneInventureInternaZaglavlje(string datum)
        {
            return _context.ResponseParcijalneInventureInternaZaglavlje.FromSqlInterpolated($"EXEC GetParcijalneInventureInternaZaglavlje {datum}").AsNoTracking();
        }

        public void ObradiZahtjev(ObradaZahtjevaDto zahtjev)
        {
            _context.Database.ExecuteSqlInterpolated($"EXEC ObradiZahtjevInterna {zahtjev.BrojDokumenta}, {zahtjev.Napomena}, {zahtjev.Odobreno}");
        }
    }
}