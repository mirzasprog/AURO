export interface ProdajnaPozicija {
  id?: number;
  tip: string;
  naziv: string;
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
}

export interface ProdajnePozicijeResponse {
  layout?: ProdajniLayout | null;
  pozicije: ProdajnaPozicija[];
}

export interface ProdajnePozicijeUpsertRequest {
  sirina: number;
  duzina: number;
  pozicije: ProdajnaPozicija[];
}

export interface ProdavnicaOption {
  id: number;
  code: string;
  name: string;
}
