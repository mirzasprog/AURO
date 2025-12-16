export interface PrometRangeDayRow {
  datum: string;
  promet: number;
  prometProslaGodina: number;
  brojKupaca: number;
  brojKupacaProslaGodina: number;
}

export interface PrometRangeStoreRow {
  brojProdavnice: string;
  adresa?: string;
  format?: string;
  regija?: string;
  promet: number;
  prometProslaGodina: number;
  brojKupaca: number;
  brojKupacaProslaGodina: number;
}

export interface PrometRangeSummary {
  promet: number;
  prometProslaGodina: number;
  brojKupaca: number;
  brojKupacaProslaGodina: number;
}

export interface PrometRangeResponse {
  currentRange?: DateRangeDescriptor;
  previousRange?: DateRangeDescriptor;
  totals?: PrometRangeSummary;
  stores: PrometRangeStoreRow[];
  days: PrometRangeDayRow[];
  currentDays?: PrometRangeDayRow[];
  previousDays?: PrometRangeDayRow[];
}

export interface DateRangeDescriptor {
  startDate: string;
  endDate: string;
}
