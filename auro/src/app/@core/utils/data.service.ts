import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ZahtjeviIzdatnice } from '../data/artikliIzdatniceZahtjevi';
import { DetaljiRedovnogOtpisaOdobreno } from '../data/detalji-redovnog-otpisa-odobreno';
import { DetaljiVanrednogOtpisa } from '../data/detalji-vanrednog-otpisa';
import { Izdatnica } from '../data/izdatnica';
import { IzdatnicaPdt } from '../data/izdatnica-pdt';
import { IzvjestajIzdatnica } from '../data/izvjestaj-izdatnica';
import { OdobravanjeOtpisa } from '../data/odobravanje-otpisa';
import { PDTartikliRedovnogOtpisa } from '../data/PDTartikliRedovnogOtpisa';
import { PDTartikliVanrednogOtpisa } from '../data/PDTartikliVanrednogOtpisa';
import { PDTizdatnica } from '../data/PDTizdatnica';
import { PregledOtpisa } from '../data/pregled-otpisa';
import { PregledIzdatnica } from '../data/pregled-izdatnica';
import { TrgovackaKnjigaSintetika } from '../data/trgovacka-knjiga-sintetika';
import { Ucesniciinventure } from '../data/UcesniciInventure';
import { ZahtjeviRedovniOtpis } from '../data/zahtjevi-redovni-otpis';
import { ZahtjeviRedovniOtpisDetalji } from '../data/zahtjevi-redovni-otpis-detalji';
import { ZahtjeviVanredniOtpis } from '../data/zahtjevi-vanredni-otpis';
import { ZahtjeviVanredniOtpisDetalji } from '../data/zahtjevi-vanredni-otpis-detalji';
import { DetaljiArtikliIzdatniceTroska } from '../data/detalji-artikli-izdatniceTroska';
import { NeuslovnaRobaPdt } from '../data/neuslovnaRobaPdt';
import { PDTNeuslovneRobe } from '../data/PDTNeuslovneRobe';
import { neuslovnaRoba } from '../data/neuslovnaRoba';
import { DetaljiNeuslovneRobe } from '../data/detalji-neuslovne-robe';
import { IzdatniceTroskaInterna } from '../data/IzdatniceTroskaInterna';
import { NemaOtpisa } from '../data/NemaOtpisa';
import { UnesiOtpis } from '../data/UnesiOtpis';
import { pregledUcesnikaInventure } from '../data/pregledUcesnikaInventure';
import { ListaOdbijenihArtikala } from '../data/lista-odbijenih-artikala';
import { DetaljiRedovnogOtpisaOdbijeno } from '../data/detalji-redovnog-otpisa-odbijeno';
import { DetaljiRedovnogOtpisa } from '../data/detalji-redovnog-otpisa';
import { DetaljiVanrednogOtpisaOdobreno } from '../data/detalji-vanrednog-otpisa-odobreno';
import { DetaljiVanrednogOtpisaOdbijeno } from '../data/detalji-vanrednog-otpisa-odbijeno';
import { PregledDinamike } from '../data/pregled-dinamike';
import { ZavrseniRedovniZahtjevi } from '../data/zavrseni-redovni-zahtjev';
import { ZavrseniVanredniZahtjevi } from '../data/zavrseni-vanredni-zahtjevi';
import { Statistika } from '../data/Statistika';
import { Zaposlenici } from '../data/zaposlenici';
import { PodaciParcijalneInventure } from '../data/PodaciParcijalneInventure';
import { ZaglavljeParcijaneInv } from '../data/zaglavljeParcijaneInv';
import { PregledParcijalneInv } from '../data/pregledParcijalneInv';
import { ParcijalnaInvZahtjev } from '../data/parcijalnaInvZahtjev';
import { IzvjestajParcijalnaInventura } from '../data/izvjestaj-parcijalna-inventura';
import { ProdavniceInventure } from '../data/prodavniceInventure';
import { Prodavnica } from '../data/prodavnicaInventura';
import { InventureUposlenici } from '../data/inventureUposlenici';
import { PodaciUposlenikaPotpunaInv } from '../data/podaciUposlenikaPotpuneInv';
import { ZahtjevObradaInterna } from '../data/zahtjevObradaInterna';
import { GetPodaciArtiklaReklamacije } from '../data/getPodaciArtiklaReklamacije';
import { ReklamacijaKvaliteta } from '../data/reklamacijaKvaliteta';
import { Prometi } from '../data/prometi';
import { VikendAkcija } from '../data/vikend-akcija';
import { VikendAkcijaStavka, VikendAkcijaStavkaUpdate } from '../data/vikend-akcija-stavka';
import { VipArtikal } from '../data/vip-artikal';
import { Akcija } from '../data/akcija';
import { AkcijaStavka } from '../data/akcija-stavka';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  private sendRequest<T>(verb: string, url: string, body?: any): Observable<T> {
    return this.http.request<T>(verb, url, {
      body: body
    });
  }

  private posaljiRequest<T>(verb: string, url: string, body?: any): Observable<T> {
    return this.http.request<T>(verb, url, { body: body });
  }

  public preuzmiTrgovackuKnjigu(datumOd: string, datumDo: string): Observable<TrgovackaKnjigaSintetika> {
    return this.sendRequest<TrgovackaKnjigaSintetika>("GET", this.baseUrl + `/api/izvjestaj/trgovackaKnjiga?datumOd=${datumOd}&datumDo=${datumDo}`);
  }

  public preuzmiIzvjestajIzdatnice(datumOd: string, datumDo: string): Observable<IzvjestajIzdatnica[]> {
    return this.sendRequest<IzvjestajIzdatnica[]>("GET", this.baseUrl + `/api/izvjestaj/izdatnica?datumOd=${datumOd}&datumDo=${datumDo}`);
  }

  //Izdatnice Troška
  public preuzmiIzdatnice(): Observable<Izdatnica[]> {
    return this.sendRequest<Izdatnica[]>("GET", this.baseUrl + '/api/izdatnica');
  }
  public dodajIzdatnicu(podaci: object) {
    return this.posaljiRequest<any>("POST", this.baseUrl + '/api/izdatnica', podaci);
  }
  public spremiListuIzdatnica(podaci: Array<object>) {
    return this.sendRequest<Array<object>>("POST", this.baseUrl + '/api/izdatnica/nova-lista', podaci);
  }
  public prikaziDetaljeIzdatnicaTroska(brojIzdatnice: string): Observable<DetaljiArtikliIzdatniceTroska[]> {
    return this.posaljiRequest<DetaljiArtikliIzdatniceTroska[]>("GET", this.baseUrl + `/api/izdatnica/${brojIzdatnice}`);
  }
  //Izdatnice Troška END---------------------------------------------------------------------------------------------------------------------------

  //Neuslovna Roba
  public dodajNeuslovnuRobu(podatci: object) {
    return this.posaljiRequest<any>("POST", this.baseUrl + '/api/neuslovnaRoba', podatci);
  }
  //Neuslovna Roba END--------------------------------------------------------------------------------------------------------------------------------

  // Otpisi -- Dodavanje, odobavanje, pregled
  public dodajOtpis(podaci: object) {
    return this.posaljiRequest<any>("POST", this.baseUrl + '/api/redovniOtpis', podaci);
  }
  public provjeriOmogucenOtpis(): Observable<{ omogucenUnosOtpisa: boolean, nemaOtpisa: boolean }> {
    return this.posaljiRequest<{ omogucenUnosOtpisa: boolean, nemaOtpisa: boolean }>("GET", this.baseUrl + '/api/redovniOtpis');
  }
  public provjeriOdobrenjeInventure(): Observable<{ unos: boolean }> {
    return this.posaljiRequest<{ unos: boolean }>("GET", this.baseUrl + '/api/redovniOtpis/provjeriOdobravanjeInventure');
  }  
  
  public getPodaciOArtikluReklamacije(): Observable<{ unos: boolean }> {
    return this.posaljiRequest<{ unos: boolean }>("GET", this.baseUrl + '/api/redovniOtpis/provjeriOdobravanjeInventure');
  }
  public dodajVanredniOtpis(podaci: object) {
    return this.posaljiRequest<any>("POST", this.baseUrl + '/api/vanredniOtpis', podaci);
  }

  public spremiListuVOtpisa(podaci: Array<object>) {
    return this.sendRequest<Array<object>>("POST", this.baseUrl + '/api/vanredniOtpis/nova-vlista', podaci);
  }  
  
  public spremiReklamacijuKvaliteta(podaci: Array<object>) {
    return this.sendRequest<Array<object>>("POST", this.baseUrl + '/api/vanredniOtpis/reklamacija-kvaliteta', podaci);
  }

  public spremiListuOtpisa(podaci: Array<object>) {
    return this.sendRequest<Array<object>>("POST", this.baseUrl + '/api/redovniOtpis/nova-lista', podaci);
  }
  public dodajPDTRedovnogOtpisa(podaci: object) {
    return this.posaljiRequest<PDTartikliRedovnogOtpisa[]>("POST", this.baseUrl + '/api/PDTlista/artikli-redovni-otpis', podaci);
  }
  public dodajPDTVanrednogOtpisa(podaci: object) {
    return this.posaljiRequest<PDTartikliVanrednogOtpisa[]>("POST", this.baseUrl + '/api/PDTlista/artikli-vanredni-otpis', podaci);
  }
  public spremiListuNeuslovneRobe(podatci: Array<object>) {
    return this.sendRequest<Array<object>>("POST", this.baseUrl + '/api/neuslovnaRoba/nova-lista', podatci);
  }
  public dodajPDTIzdatnice(podaci: IzdatnicaPdt) {
    return this.posaljiRequest<PDTizdatnica[]>("POST", this.baseUrl + '/api/PDTlista/artikli-izdatnica-troska', podaci);
  }
  public dodajPDTNeuslovneRobe(podaci: NeuslovnaRobaPdt) {
    return this.posaljiRequest<PDTNeuslovneRobe[]>("POST", this.baseUrl + '/api/PDTlista/artikli-neuslovna-roba', podaci);
  }
  public zakljuciParcijalnuInventuru(podaci: PodaciParcijalneInventure) {
    return this.posaljiRequest<PodaciParcijalneInventure[]>("POST", this.baseUrl + '/api/parcijalnaInventura', podaci);
  }
  public potvrdiParcijalnuInv(podaci: ParcijalnaInvZahtjev) {
    return this.posaljiRequest<ParcijalnaInvZahtjev[]>("POST", this.baseUrl + '/api/parcijalnaInventura/podrucni/odobravanje', podaci);
  }
  public prijaviNemaOtpisa() {
    return this.sendRequest("POST", this.baseUrl + '/api/redovniOtpis/nema-otpisa');
  }
  public pregledajRedovneOtpise(datumOd: string, datumDo: string): Observable<PregledOtpisa[]> {
    return this.posaljiRequest<PregledOtpisa[]>("GET", this.baseUrl + `/api/redovniOtpis/pregled?datumOd=${datumOd}&datumDo=${datumDo}`);
  }  

  public pregledProdavnicaInventura(datum: string): Observable<ProdavniceInventure[]> {
    return this.posaljiRequest<ProdavniceInventure[]>("GET", this.baseUrl + `/api/parcijalnaInventura/podrucni/prodavnice?datumInventure=${datum}`);
  }
  public getParcijalneInvPodrucni(datum: string, brojProd: string, brojDokumenta: string): Observable<PregledParcijalneInv[]> {
    return this.posaljiRequest<PregledParcijalneInv[]>("GET", this.baseUrl + `/api/parcijalnaInventura/podrucni?datum=${datum}&brojProdavnice=${brojProd}&brojDokumenta=${brojDokumenta}`);
  }
  public getZaglavljePodrucni(datum: string): Observable<ZaglavljeParcijaneInv[]> {
    return this.posaljiRequest<ZaglavljeParcijaneInv[]>("GET", this.baseUrl + `/api/parcijalnaInventura/podrucni/zaglavlje?datum=${datum}`);
  }
  public getZaglavljeInterna(datum: string): Observable<ZaglavljeParcijaneInv[]> {
    return this.posaljiRequest<ZaglavljeParcijaneInv[]>("GET", this.baseUrl + `/api/parcijalnaInventura/interna/zaglavlje?datum=${datum}`);
  }
  public pregledajZaposlenike(brojProdavnice: string): Observable<Zaposlenici[]> {
    return this.posaljiRequest<Zaposlenici[]>("GET", this.baseUrl + `/api/parcijalnaInventura/zaposlenici/${brojProdavnice}`);
  }
  public pregledajStatistiku(): Observable<Statistika[]> {
    return this.posaljiRequest<Statistika[]>("GET", this.baseUrl + `/api/redovniOtpis/statistika`);
  }
  public pregledProdavnicaBezOtpisa(datumOd: string, datumDo: string): Observable<NemaOtpisa[]> {
    return this.posaljiRequest<NemaOtpisa[]>("GET", this.baseUrl + `/api/redovniOtpis/interna/pregled/nemaOtpisa?datumOd=${datumOd}&datumDo=${datumDo}`);
  }
  public ProdavnicaBezOtpisa(datumOd: string, datumDo: string): Observable<NemaOtpisa[]> {
    return this.posaljiRequest<NemaOtpisa[]>("GET", this.baseUrl + `/api/redovniOtpis/redovni/nemaOtpisa?datumOd=${datumOd}&datumDo=${datumDo}`);
  }
  public pregledajVanredneOtpise(datumOd: string, datumDo: string): Observable<PregledOtpisa[]> {
    return this.posaljiRequest<PregledOtpisa[]>("GET", this.baseUrl + `/api/vanredniOtpis/pregled?datumOd=${datumOd}&datumDo=${datumDo}`);
  }

  public pregledajReklamacijeKvalitete(datumOd: string, datumDo: string): Observable<ReklamacijaKvaliteta[]> {
    return this.posaljiRequest<ReklamacijaKvaliteta[]>("GET", this.baseUrl + `/api/vanredniOtpis/pregledReklamacijaKvaliteta?datumOd=${datumOd}&datumDo=${datumDo}`);
  }  
  
  public getArtikalReklamacije(sifraArtikla: string): Observable<GetPodaciArtiklaReklamacije[]> {
    return this.posaljiRequest<GetPodaciArtiklaReklamacije[]>("GET", this.baseUrl + `/api/vanredniOtpis/detaljiArtiklaReklamacije?sifraArtikla=${sifraArtikla}`);
  }


  public pregledajDinamikuOtpisa(datumOd: string, datumDo: string): Observable<PregledDinamike[]> {
    return this.posaljiRequest<PregledDinamike[]>("GET", this.baseUrl + `/api/redovniOtpis/pregled-dinamike?datumOd=${datumOd}&datumDo=${datumDo}`);
  }
  public pregledajIzdatniceTroska(datumOd: string, datumDo: string): Observable<PregledIzdatnica[]> {
    return this.posaljiRequest<PregledIzdatnica[]>("GET", this.baseUrl + `/api/izdatnica/pregled?datumOd=${datumOd}&datumDo=${datumDo}`);
  }
  public pregledajNeuslovnuRobu(datumOd: string, datumDo: string): Observable<neuslovnaRoba[]> {
    return this.posaljiRequest<neuslovnaRoba[]>("GET", this.baseUrl + `/api/neuslovnaRoba/pregled?datumOd=${datumOd}&datumDo=${datumDo}`);
  }
  public prikaziDetaljeVanrednogOtpisaPodneseno(brojOtpisa: string): Observable<DetaljiVanrednogOtpisa[]> {
    return this.posaljiRequest<DetaljiVanrednogOtpisa[]>("GET", this.baseUrl + `/api/vanredniOtpis/${brojOtpisa}`);
  }
  public prikaziDetaljeVanrednogOtpisaOdobreno(brojOtpisa: string): Observable<DetaljiVanrednogOtpisaOdobreno[]> {
    return this.posaljiRequest<DetaljiVanrednogOtpisaOdobreno[]>("GET", this.baseUrl + `/api/vanredniOtpis/odobreno/${brojOtpisa}`);
  }
  public prikaziDetaljeVanrednogOtpisaOdbijeno(brojOtpisa: string): Observable<DetaljiVanrednogOtpisaOdbijeno[]> {
    return this.posaljiRequest<DetaljiVanrednogOtpisaOdbijeno[]>("GET", this.baseUrl + `/api/vanredniOtpis/odbijeno/${brojOtpisa}`);
  }
  public prikaziDetaljeRedovnogOtpisaPodneseno(brojOtpisa: string): Observable<DetaljiRedovnogOtpisa[]> {
    return this.posaljiRequest<DetaljiRedovnogOtpisa[]>("GET", this.baseUrl + `/api/redovniOtpis/${brojOtpisa}`);
  }
  public prikaziDetaljeRedovnogOtpisaOdobreno(brojOtpisa: string): Observable<DetaljiRedovnogOtpisaOdobreno[]> {
    return this.posaljiRequest<DetaljiRedovnogOtpisaOdobreno[]>("GET", this.baseUrl + `/api/redovniOtpis/odobreno/${brojOtpisa}`);
  }
  public prikaziDetaljeRedovnogOtpisaOdbijeno(brojOtpisa: string): Observable<DetaljiRedovnogOtpisaOdbijeno[]> {
    return this.posaljiRequest<DetaljiRedovnogOtpisaOdbijeno[]>("GET", this.baseUrl + `/api/redovniOtpis/odbijeno/${brojOtpisa}`);
  }

  public getPromet(brojProd: string): Observable<Prometi[]> {
    return this.posaljiRequest<Prometi[]>("GET", this.baseUrl + `/api/prometi/${brojProd}`)
  }    
  
  public getSviPrometi(): Observable<Prometi[]> {
    return this.posaljiRequest<Prometi[]>("GET", this.baseUrl + `/api/prometi/sviPrometi`)
  }  
  
  public getPrometCijelaMreza(): Observable<Prometi[]> {
    return this.posaljiRequest<Prometi[]>("GET", this.baseUrl + `/api/prometi/`)
  }

  public prikaziDetaljeNeuslovnaRoba(brojNeuslovneRobe: string): Observable<DetaljiNeuslovneRobe[]> {
    return this.posaljiRequest<DetaljiNeuslovneRobe[]>("GET", this.baseUrl + `/api/neuslovnaRoba/${brojNeuslovneRobe}`);
  }

  public odobriOdbijOtpis(podaci: OdobravanjeOtpisa) {
    return this.posaljiRequest("POST", this.baseUrl + '/api/redovniOtpis/odobravanje', podaci);
  }

  public odbijArtikle(listaArtikala: ListaOdbijenihArtikala) {
    return this.posaljiRequest("POST", this.baseUrl + '/api/redovniOtpis/odbijArtikle/', listaArtikala);
  }

  public pregledajZavrseneZahtjeveRedovnogOtpisa(datumOd: string, datumDo: string): Observable<ZavrseniRedovniZahtjevi[]> {
    return this.sendRequest<ZavrseniRedovniZahtjevi[]>("GET", this.baseUrl + `/api/redovniOtpis/zahtjevi/redovni/zavrseno?datumOd=${datumOd}&datumDo=${datumDo}`);
  }

  public pregledajZavrseneZahtjeveVanrednogOtpisa(datumOd: string, datumDo: string): Observable<ZavrseniVanredniZahtjevi[]> {
    return this.sendRequest<ZavrseniVanredniZahtjevi[]>("GET", this.baseUrl + `/api/vanredniOtpis/zahtjevi/vanredni/zavrseno?datumOd=${datumOd}&datumDo=${datumDo}`);
  }

  //Otpisi END---------------------------------------------------------------------------------------------------------------------------------

  //Pregled Zahtjeva
  public prikaziDetaljeZahtjevaRedovnogOtpisa(brojOtpisa: string) {
    return this.posaljiRequest<ZahtjeviRedovniOtpisDetalji>("GET", this.baseUrl + `/api/redovniOtpis/zahtjevi/${brojOtpisa}`);
  }
  public prikaziZahtjeveRedovnogOtpisa() {
    return this.posaljiRequest<ZahtjeviRedovniOtpis[]>("GET", this.baseUrl + '/api/redovniOtpis/zahtjevi');
  }
  public prikaziZahtjeveIzdatnice() {
    return this.posaljiRequest<Izdatnica[]>("GET", this.baseUrl + '/api/izdatnica/zahtjevi');
  }
  public prikaziDetaljeZahtjevaIzdatnica(brojIzdatnice: string) {
    return this.posaljiRequest<ZahtjeviIzdatnice[]>("GET", this.baseUrl + `/api/izdatnica/zahtjevi/${brojIzdatnice}`);
  }
  public prikaziDetaljeZahtjevaVanrednogOtpisa(brojOtpisa: string) {
    return this.posaljiRequest<ZahtjeviVanredniOtpisDetalji>("GET", this.baseUrl + `/api/vanredniOtpis/zahtjevi/${brojOtpisa}`);
  }
  public prikaziZahtjeveVanrednogOtpisa() {
    return this.posaljiRequest<ZahtjeviVanredniOtpis[]>("GET", this.baseUrl + '/api/vanredniOtpis/zahtjevi');
  }
  //Pregled Zahtjeva END -------------------------------------------------------------------------------------------------------------------------------------

  //Pregled Za Internu Kontrolu
  public pregledajRedovneOtpiseInterna(datumOd: string, datumDo: string): Observable<PregledOtpisa[]> {
    return this.sendRequest<PregledOtpisa[]>("GET", this.baseUrl + `/api/redovniOtpis/interna/pregled?datumOd=${datumOd}&datumDo=${datumDo}`);
  }

  public getImenaUposlenika(): Observable<InventureUposlenici[]> {
    return this.sendRequest<InventureUposlenici[]>("GET", this.baseUrl + `/api/parcijalnaInventura/uposlenici`);
  }

  public getPodaciUposlenikaPotpunaInv(ime: string, prezime: string): Observable<PodaciUposlenikaPotpunaInv[]> {
    return this.sendRequest<PodaciUposlenikaPotpunaInv[]>("GET", this.baseUrl + `/api/parcijalnaInventura/podaciUposlenikaPotpunaInv?ime=${ime}&prezime=${prezime}`);
  }


  public pregledajVanredneOtpiseInterna(datumOd: string, datumDo: string): Observable<PregledOtpisa[]> {
    return this.sendRequest<PregledOtpisa[]>("GET", this.baseUrl + `/api/redovniOtpis/interna/pregled-vo?datumOd=${datumOd}&datumDo=${datumDo}`);
  }
  public unesiDatumOtpisaList(podaci: UnesiOtpis) {
    return this.posaljiRequest("POST", this.baseUrl + `/api/redovniOtpis/interna/unos-datuma`, podaci);
  }

  public zakljuciDokumentInventura(podaci: Prodavnica[]) {
    return this.posaljiRequest("POST", this.baseUrl + `/api/parcijalnaInventura/podrucni/listaParcijalnihInventura`, podaci);
  }

  public unesiDatumOdobrenjaInventure(podaci: UnesiOtpis) {
    return this.posaljiRequest("POST", this.baseUrl + `/api/redovniOtpis/interna/unos-datuma-inventure`, podaci);
  }
  //  public unesiDatumOtpisa(podaci : object[]) {
  //  return this.posaljiRequest("POST", this.baseUrl + `/api/redovniOtpis/interna/unos-datuma`, podaci);
  //}
  public pregledajNeuslovuRobuInterna(datumOd: string, datumDo: string): Observable<neuslovnaRoba[]> {
    return this.sendRequest<neuslovnaRoba[]>("GET", this.baseUrl + `/api/neuslovnaRoba/interna/pregled?datumOd=${datumOd}&datumDo=${datumDo}`);
  }

  public pregledajIzdatniceTroskaInterna(datumOd: string, datumDo: string): Observable<IzdatniceTroskaInterna[]> {
    return this.sendRequest<IzdatniceTroskaInterna[]>("GET", this.baseUrl + `/api/izdatnica/interna/pregled?datumOd=${datumOd}&datumDo=${datumDo}`);
  }
  //Pregled Interna END -------------------------------------------------------------------------------------------------------------------------------------

  //Dodavanje ucesnika inevnture
  public dodajUcesnike(podaci: object) {
    return this.posaljiRequest<any>("POST", this.baseUrl + '/api/ucesniciInventure', podaci);
  }  
  
  public obradiZahtjevInterna(podaci: ZahtjevObradaInterna) {
    return this.posaljiRequest<any>("POST", this.baseUrl + '/api/parcijalnaInventura/interna/obradaZahtjeva', podaci);
  }
  
  public dodajUcesnikeInventure(podaci: Ucesniciinventure[]) {
    return this.posaljiRequest("POST", this.baseUrl + '/api/ucesniciInventure/nova-lista', podaci);
  }
  public pregledajUcesnikeInventure(datumOd: string, datumDo: string): Observable<pregledUcesnikaInventure[]> {
    return this.sendRequest<pregledUcesnikaInventure[]>("GET", this.baseUrl + `/api/ucesniciInventure/pregled?datumOd=${datumOd}&datumDo=${datumDo}`);
  }
  //Ucesnici Inventure END -------------------------------------------------------------------------------------------------------------------------------------

  public preuzmiIzvjestajParcijalneInventure(datumInventure: string, vrstaInventure: string): Observable<IzvjestajParcijalnaInventura[]> {
    return this.sendRequest<IzvjestajParcijalnaInventura[]>("GET", this.baseUrl + `/api/parcijalnaInventura/internaKontrola/izvjestaj?datumInventure=${datumInventure}&vrstaInventure=${vrstaInventure}`);
  }

  public preuzmiIzvjestajPotpuneInventure(datumInventure: string, vrstaInventure: string): Observable<IzvjestajParcijalnaInventura[]> {
    return this.sendRequest<IzvjestajParcijalnaInventura[]>("GET", this.baseUrl + `/api/parcijalnaInventura/internaKontrola/izvjestaj/poptunaInventura?datumInventure=${datumInventure}&vrstaInventure=${vrstaInventure}`);
  }

  // Vikend akcije
  public preuzmiVikendAkcije(): Observable<VikendAkcija[]> {
    return this.sendRequest<VikendAkcija[]>("GET", this.baseUrl + '/api/vikend-akcije');
  }

  public kreirajVikendAkciju(podaci: { opis?: string, pocetak: string, kraj: string }): Observable<VikendAkcija> {
    return this.posaljiRequest<VikendAkcija>("POST", this.baseUrl + '/api/vikend-akcije', podaci);
  }

  public preuzmiVipArtikle(akcijaId: string): Observable<VipArtikal[]> {
    return this.sendRequest<VipArtikal[]>("GET", this.baseUrl + `/api/vikend-akcije/${akcijaId}/artikli`);
  }

  public preuzmiStavkeVikendAkcije(vikendAkcijaId: string): Observable<VikendAkcijaStavka[]> {
    return this.sendRequest<VikendAkcijaStavka[]>("GET", this.baseUrl + `/api/vikend-akcije/${vikendAkcijaId}/stavke`);
  }

  public azurirajStavkeVikendAkcije(vikendAkcijaId: string, stavke: VikendAkcijaStavkaUpdate[]) {
    return this.posaljiRequest<void>("PUT", this.baseUrl + `/api/vikend-akcije/${vikendAkcijaId}/stavke`, stavke);
  }

  public importujVikendArtikle(akcijaId: string, fajl: File) {
    const formData = new FormData();
    formData.append('akcijaId', akcijaId);
    formData.append('file', fajl, fajl.name);
    return this.posaljiRequest("POST", this.baseUrl + '/api/vikend-akcije/artikli-import', formData);
  }

  public preuzmiAkcije(): Observable<Akcija[]> {
    return this.sendRequest<Akcija[]>("GET", this.baseUrl + '/api/akcije');
  }

  public preuzmiStavkeAkcije(akcijaId: number): Observable<AkcijaStavka[]> {
    return this.sendRequest<AkcijaStavka[]>("GET", this.baseUrl + `/api/akcije/${akcijaId}`);
  }

  public preuzmiExcelStavkeAkcije(akcijaId: number): Observable<Blob> {
    return this.http.get(this.baseUrl + `/api/akcije/${akcijaId}/excel`, { responseType: 'blob' });
  }
}
