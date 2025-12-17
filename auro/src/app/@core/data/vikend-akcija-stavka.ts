export interface VikendAkcijaStavka {
  id: string;
  sifra?: string;
  naziv?: string;
  kolicina: number;
  prodavnica?: string;
  barKod?: string;
  dobavljac?: string;
  asSa?: number;
  asMo?: number;
  asBl?: number;
  opis?: string;
  status?: string;
  akcijskaMpc?: number;
  zaliha?: number;
}

export interface VikendAkcijaStavkaUpdate {
  id: string;
  vikendAkcijaId: string;
  sifraArtikla: string;
  nazivArtikla: string;
  kolicina: number;
  brojProdavnice: string;
}
