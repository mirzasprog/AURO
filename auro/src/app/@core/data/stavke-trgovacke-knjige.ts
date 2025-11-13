export interface StavkeTrgovackeKnjige {
  sintetika: Array<{ rbr: number, datum: string, opis:string, ukupnoNaknadaSaPDV: string }>;
  ukupnaNaknadaDoDatogPerioda: number;
  ukupnaNaknadaZaDatiPeriod: number;
  naknadaUkupno: number;
  datumOd: Date;
  datumDo: Date;
}
