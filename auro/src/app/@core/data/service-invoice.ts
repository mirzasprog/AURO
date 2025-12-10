export interface ServiceInvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  lineTotalWithoutTax?: number;
  lineTaxAmount?: number;
  lineTotalWithTax?: number;
}

export interface ServiceInvoice {
  id?: number;
  invoiceNumber?: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  customerAddress?: string;
  customerCity?: string;
  customerCountry?: string;
  customerTaxId?: string;
  customerId?: number;
  currency: string;
  subtotalAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  notes?: string;
  status?: string;
  items: ServiceInvoiceItem[];
  companyInfo?: CompanyInfo;
}

export interface CompanyInfo {
  companyName: string;
  address: string;
  jib: string;
  pdvNumber: string;
  registrationNumber: string;
  iban: string;
  bankName: string;
  swift: string;
  phone: string;
  email: string;
  web: string;
}

export interface ServiceInvoiceListItem {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  status: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}
