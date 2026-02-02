import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FixedAssetCategory {
  id: number;
  name: string;
  description?: string;
  parentCategoryId?: number | null;
  children: FixedAssetCategory[];
}

export interface FixedAssetListItem {
  id: number;
  name: string;
  inventoryNumber: string;
  serialNumber: string;
  categoryName: string;
  status?: string;
  location?: string;
  assignedTo?: string;
  purchasePrice: number;
  purchaseDate: string;
  amortizationYears?: number | null;
  depreciatedValue?: number;
}

export interface FixedAssetDetail {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description?: string;
  inventoryNumber: string;
  serialNumber: string;
  purchasePrice: number;
  supplier: string;
  purchaseDate: string;
  warrantyUntil?: string | null;
  amortizationYears?: number | null;
  depreciatedValue?: number;
  location?: string;
  department?: string;
  status?: string;
  assignedTo?: string;
  notes?: string;
  isActive: boolean;
  assignments: FixedAssetAssignment[];
  serviceRecords: FixedAssetServiceRecord[];
}

export interface FixedAssetAssignment {
  id: number;
  assignedTo: string;
  assignedBy?: string;
  department?: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  status?: string;
  note?: string;
}

export interface FixedAssetServiceRecord {
  id: number;
  serviceDate: string;
  vendor?: string;
  description?: string;
  cost?: number;
  nextServiceDate?: string | null;
  documentNumber?: string;
  status?: string;
}

export interface FixedAssetSummary {
  categoryId: number;
  categoryName: string;
  totalAssets: number;
  activeAssets: number;
  assignedAssets: number;
  totalPurchasePrice: number;
}

export interface FixedAssetAdvancedReportItem {
  id: number;
  name: string;
  inventoryNumber: string;
  serialNumber: string;
  categoryName: string;
  supplier: string;
  status?: string;
  department?: string;
  location?: string;
  assignedTo?: string;
  purchasePrice: number;
  purchaseDate: string;
  amortizationYears?: number | null;
  depreciatedValue?: number;
}

export interface FixedAssetCategoryRequest {
  name: string;
  description?: string;
  parentCategoryId?: number | null;
}

export interface FixedAssetRequest {
  categoryId: number;
  name: string;
  description?: string;
  inventoryNumber: string;
  serialNumber: string;
  purchasePrice: number;
  supplier: string;
  purchaseDate: string;
  warrantyUntil?: string | null;
  amortizationYears?: number | null;
  location?: string;
  department?: string;
  status?: string;
  assignedTo?: string;
  notes?: string;
  isActive: boolean;
}

export interface FixedAssetAssignmentRequest {
  assignedTo: string;
  assignedBy?: string;
  department?: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  status?: string;
  note?: string;
}

export interface FixedAssetServiceRecordRequest {
  serviceDate: string;
  vendor?: string;
  description?: string;
  cost?: number;
  nextServiceDate?: string | null;
  documentNumber?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FixedAssetsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<FixedAssetCategory[]> {
    return this.http.get<FixedAssetCategory[]>(`${this.baseUrl}/api/FixedAssets/categories`);
  }

  createCategory(request: FixedAssetCategoryRequest): Observable<FixedAssetCategory> {
    return this.http.post<FixedAssetCategory>(`${this.baseUrl}/api/FixedAssets/categories`, request);
  }

  getAssets(filters?: { categoryId?: number; status?: string; search?: string }): Observable<FixedAssetListItem[]> {
    let params = new HttpParams();
    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString());
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<FixedAssetListItem[]>(`${this.baseUrl}/api/FixedAssets`, { params });
  }

  getAsset(id: number): Observable<FixedAssetDetail> {
    return this.http.get<FixedAssetDetail>(`${this.baseUrl}/api/FixedAssets/${id}`);
  }

  createAsset(request: FixedAssetRequest): Observable<FixedAssetDetail> {
    return this.http.post<FixedAssetDetail>(`${this.baseUrl}/api/FixedAssets`, request);
  }

  updateAsset(id: number, request: FixedAssetRequest): Observable<FixedAssetDetail> {
    return this.http.put<FixedAssetDetail>(`${this.baseUrl}/api/FixedAssets/${id}`, request);
  }

  addAssignment(id: number, request: FixedAssetAssignmentRequest): Observable<FixedAssetAssignment> {
    return this.http.post<FixedAssetAssignment>(`${this.baseUrl}/api/FixedAssets/${id}/assignments`, request);
  }

  addServiceRecord(id: number, request: FixedAssetServiceRecordRequest): Observable<FixedAssetServiceRecord> {
    return this.http.post<FixedAssetServiceRecord>(`${this.baseUrl}/api/FixedAssets/${id}/service-records`, request);
  }

  getSummary(): Observable<FixedAssetSummary[]> {
    return this.http.get<FixedAssetSummary[]>(`${this.baseUrl}/api/FixedAssets/reports/summary`);
  }

  getAdvancedReport(filters?: {
    categoryId?: number | null;
    status?: string;
    department?: string;
    location?: string;
    supplier?: string;
    assignedTo?: string;
    purchaseDateFrom?: string;
    purchaseDateTo?: string;
    priceMin?: number | null;
    priceMax?: number | null;
    amortizationMin?: number | null;
    amortizationMax?: number | null;
  }): Observable<FixedAssetAdvancedReportItem[]> {
    let params = new HttpParams();
    if (filters?.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString());
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.department) {
      params = params.set('department', filters.department);
    }
    if (filters?.location) {
      params = params.set('location', filters.location);
    }
    if (filters?.supplier) {
      params = params.set('supplier', filters.supplier);
    }
    if (filters?.assignedTo) {
      params = params.set('assignedTo', filters.assignedTo);
    }
    if (filters?.purchaseDateFrom) {
      params = params.set('purchaseDateFrom', filters.purchaseDateFrom);
    }
    if (filters?.purchaseDateTo) {
      params = params.set('purchaseDateTo', filters.purchaseDateTo);
    }
    if (filters?.priceMin != null) {
      params = params.set('priceMin', filters.priceMin.toString());
    }
    if (filters?.priceMax != null) {
      params = params.set('priceMax', filters.priceMax.toString());
    }
    if (filters?.amortizationMin != null) {
      params = params.set('amortizationMin', filters.amortizationMin.toString());
    }
    if (filters?.amortizationMax != null) {
      params = params.set('amortizationMax', filters.amortizationMax.toString());
    }

    return this.http.get<FixedAssetAdvancedReportItem[]>(`${this.baseUrl}/api/FixedAssets/reports/advanced`, { params });
  }
}
