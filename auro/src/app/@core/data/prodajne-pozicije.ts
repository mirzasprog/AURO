export interface ProdajnaPozicija {
  id?: number;
  tip: string;
  naziv: string;
  brojPozicije?: string | null;
  trgovac?: string | null;
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
