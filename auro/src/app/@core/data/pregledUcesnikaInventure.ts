import { Time } from "@angular/common";

export interface pregledUcesnikaInventure {
  Ime: string;
  Prezime: string;
  Datum: Date,
  BrojProdavnice: string,
  BrojProdavniceUcesnika: string;
  VrijemePocetka: Time;
  VrijemeZavrsetka: Time;
  RolaNaInventuri: string;
}
