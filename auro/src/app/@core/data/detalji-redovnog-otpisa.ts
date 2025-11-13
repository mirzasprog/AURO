export interface DetaljiRedovnogOtpisa {
  artikalID: number;
  sifra: string;
  naziv: string;
  razlogOtpisa: string;
  potrebnoZbrinjavanje: string;
  potrebanTransport: string;
  jedinicaMjere: string;
  kolicina: number;
  nabavnaVrijednost: number;
  ukupnaVrijednost: number;
  dobavljac: string;
  datumIstekaRoka : Date;
}
