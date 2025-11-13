export interface ReklamacijaKvaliteta {
  razlog?: string;
  datum: Date;
  datumPrijema: Date;
  jedinicaMjere?: string;
  komentar?: string;
  sifraArtikla?: string;
  naziv?: string;
  brojProdavnice?: string;
  kolicina: number;
  brojDokumenta?: string;
  reklamiranaKolicina: number;
  lot: string;
  brojZaduzenjaMLP: string;
}
