export interface ProdajnaPozicija {
  id?: number;
  tip: string;
  naziv: string;
  brojPozicije?: string | null;
  trgovac?: string | null;
  trader?: string | null;
  nazivArtikla?: string | null;
  zakupDo?: string | null;
  vrijednostZakupa?: number | null;
  vrstaUgovora?: string | null;
  tipPozicije?: string | null;
  sirina: number;
  duzina: number;
  pozicijaX: number;
  pozicijaY: number;
  rotacija: number;
  zona?: string | null;
}

export interface ProdajniLayout {
  id?: number;
  naziv?: string; // <--- Dodano polje da popravimo TS grešku
  prodavnicaId?: number;
  sirina: number;
  duzina: number;
  backgroundFileName?: string | null;
  backgroundContentType?: string | null;
  backgroundData?: string | null;
  backgroundRotation?: number | null;
}

export interface ProdajnePozicijeResponse {
  layout?: ProdajniLayout | null;
  pozicije: ProdajnaPozicija[];
}

export interface ProdajnePozicijeUpsertRequest {
  id?: number; // Dodano id ako radimo update postojećeg
  sirina: number;
  duzina: number;
  backgroundFileName?: string | null;
  backgroundContentType?: string | null;
  backgroundData?: string | null;
  backgroundRotation?: number | null;
  pozicije: ProdajnaPozicija[];
}

export interface ProdavnicaOption {
  id: number;
  code: string;
  name: string;
}