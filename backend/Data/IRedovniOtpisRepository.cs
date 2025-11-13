using backend.Models;

namespace backend.Data {
    public interface IRedovniOtpisRepository {
        UneseniRedovniOtpis? DodajOtpis(NoviRedovniOtpis o);
        void SpremiListuOtpisa(IEnumerable<NoviRedovniOtpis> listaOtpisa);
        bool ArtikalPostoji(string? sifraArtikla);
        bool OmogucenDatumOtpisa();
        bool ProvjeraOdobravanjeInventure();
        void SpremiProdavnicaNemaOtpisa();
        IEnumerable<PregledOtpisa> PregledajOtpise(DateTime datumOd, DateTime datumDo);
        IEnumerable<PregledOtpisa> PregledajStatistikuRedovnogOtpisa();
        IEnumerable<PregledDinamike> PregledajDinamikuOtpisa(DateTime datumOd, DateTime datumDo);
        IEnumerable<DetaljiRedovnogOtpisa> PreuzmiDetaljeOtpisa(string brojOtpisa);
        IEnumerable<ZahtjeviRedovniOtpis> PregledajZahtjeveRedovnihOtpisa();
        IEnumerable<ZahtjeviRedovniOtpisDetalji> PregledajZahtjeveRedovnihOtpisaDetalji(string brojOtpisa);
        void DodajOvjerioceOtpisa(string brojOtpisa);
        void OdobriOtpis(OdobravanjeOtpisa o);
        IEnumerable<DetaljiRedovnogOtpisaOdbijeno> PreuzmiDetaljeOdbijenihOtpisa(string brojOtpisa);
        IEnumerable<DetaljiRedovnogOtpisaOdobreno> PreuzmiDetaljeOdobrenihOtpisa(string brojOtpisa); 
         IEnumerable<Statistika> PregledajStatistiku();
        IEnumerable<PregledOtpisaInterna> PregledajOtpiseInterna(DateTime datumOd, DateTime datumDo);
         IEnumerable<PregledOtpisa> PregledajVanredneOtpiseInterna(DateTime datumOd, DateTime datumDo);
        IEnumerable<NemaOtpisa> PregledInternaNemaOtpisa(DateTime datumOd, DateTime datumDo);
        IEnumerable<NemaOtpisa> PregledNemaOtpisa(DateTime datumOd, DateTime datumDo);
        void UnosDatumaOtpisa(UnosDatumaOtpisa datum);
        void UnosDatumaInventure(UnosDatumaOtpisa datum);
        bool NemaOtpisa();
        void OdbijArtikle(ListaOdbijenihArtikala listaOdbijenihArtikala);
        IEnumerable<ZavrseniRedovniZahtjevi> PregledajZavrseneRedovneZahtjeve(DateTime datumOd, DateTime datumDo);
        //IEnumerable<ZavrseniVanredniZahtjevi> PregledajZavrseneVanredneZahtjeve(DateTime datumOd, DateTime datumDo);
    }
}