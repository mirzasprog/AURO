using backend.Entities;
using backend.Models;

namespace backend.Data {
    public interface IParcijalnaInventuraRepository {
        public void SpremiUbazu(IEnumerable<ListaZaposlenikaParcijalneInventure> listaZaposlenikaParcijalneInventure);
        public IEnumerable<ResponseZaposleniciParcijalneInventure> GetZaposleniciParcijalneInventure(string brojProdavnice);
        public void SpremiParcijalneInventure(RequestParcijalneInventure podaci);
        public IEnumerable<ResponseParcijalneInventurePodrucni> GetParcijalneInventurePodrucniStavke(string datum, string brojProdavnice, string brojDokumenta);
        public IEnumerable<ResponseParcijalneInventurePodrucniZaglavlje> GetParcijalneInventurePodrucniZaglavlje(string datum);
        public IEnumerable<ResponseParcijalneInventurePodrucniZaglavlje> GetParcijalneInventureInternaZaglavlje(string datum);
        public IEnumerable<ImenaUposlenikaNaInventuri> GetUposlenici();
        public IEnumerable<PodaciUposlenikaParcijalnaInv> GetPodaciUposlenikaPotpunaInv(string ime, string prezime);
        public void PodrucniOdobriOdbijParcijalnuInventuru(PodrucniOdobriOdbijeParcijalnuInventuru unos);
        public IEnumerable<IzvjestajParcijalnaInventuraInternaKontrola> GetIzvjestajParcijalnihInventuraZaInternuKontrolu(string datum, string vrstaInventure);
        public IEnumerable<IzvjestajPotpunihInventuraInterna> GetIzvjestajPotpunihInventuraZaInternuKontrolu(string datum, string vrstaInventure);
        public List<string?> GetProdavniceParcijalnaInventuraNezavrseno(string datumInventure);
        public void SpremiListuParcijalnihInventura(IEnumerable<PodrucniOdobriOdbijeParcijalnuInventuru> unosi);
        public void ObradiZahtjev(ObradaZahtjevaDto zahtjev);
    }
}