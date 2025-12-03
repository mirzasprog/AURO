export interface VikendAkcijaStavka {
  id: string;
  sifra?: string;
  naziv?: string;
  kolicina: number;
  prodavnica?: string;
}

export interface VikendAkcijaStavkaUpdate {
  id: string;
  vikendAkcijaId: string;
  sifraArtikla: string;
  nazivArtikla: string;
  kolicina: number;
  brojProdavnice: string;
}
