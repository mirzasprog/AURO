export interface TrgovackaKnjigaSintetika {
  sintetika: Array< {rbr: number, datum: string, opis:string, ukupnoNaknadaSaPdv: string} >;
  ukupnaNaknadaDoDatogPerioda: number;
  ukupnaNaknadaZaDatiPeriod: number;
  naknadaUkupno: number;
  analitika: Array< {datum: string, distributer: string, brojTransakcija:number, prodajaBezPDV: number, pdv:number,prodajaSaPDV: number, provizija: number, porezNaProviziju: number, ukupnoSaPDV: number} >;
}
