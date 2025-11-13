export interface ZahtjeviRedovniOtpisDetalji {
  odobreniArtikli: Array< {
  artikalID: number,
  brojOtpisa: string;
  sifra: string;
  razlogOtpisa: string;
  kolicina: number;
  nazivArtikla: string;
  status: string;
  datumPopunjavanja: string;
  dobavljac: string;
  ukupnaVrijednost: number;
  nabavnaVrijednost: number;}>,

  odbijeniArtikli: [
    {
      odobreniArtikli: Array< { sifra: string;
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
