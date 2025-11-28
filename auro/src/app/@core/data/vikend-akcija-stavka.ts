export interface VikendAkcijaStavka {
  id: number;
  sifra?: string;
  naziv?: string;
  kolicina: number;
  prodavnica?: string;
}

export interface VikendAkcijaStavkaUpdate {
  id: number;
  kolicina: number;
}
