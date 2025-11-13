export interface ZahtjeviVanredniOtpisDetalji {
  odobreniArtikli: Array<
  {
  artikalId: number,
  sifra: string;
  datumPopunjavanja: string;
  kolicina: number;
  potrebnoZbrinjavanje: string;
  potrebanTransport: string;
  razlogOtpisa: string;
  nazivArtikla: string;
  status: string;
  dobavljac: string;
  nabavnaVrijednost: number;
  ukupnaVrijednost: number;
  }>,

  odbijeniArtikli: [
    {
      odobreniArtikli: Array<{
        sifra: string;
        naziv: string;
        razlogOtpisa: string;
        potrebnoZbrinjavanje: string;
        potrebanTransport: string;
        jedinicaMjere: string;
        kolicina: number;
        nabavnaVrijednost: number;
        ukupnaVrijednost: number;
        dobavljac: string;}>;
        odbio: string;
        komentar: string;
      }
  ]
}
