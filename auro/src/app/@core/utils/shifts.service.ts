import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PagedResult,
  ShiftCopyWeekRequest,
  ShiftCreateRequest,
  ShiftDto,
  ShiftEmployee,
  ShiftMutationResponse,
  ShiftPublishRequest,
  ShiftRequestCreateRequest,
  ShiftRequestDecisionRequest,
  ShiftRequestDto,
  ShiftUpdateRequest,
} from '../data/shifts';

@Injectable({ providedIn: 'root' })
export class ShiftsService {
  private readonly baseUrl = `${environment.apiUrl}/api/shifts`;

  constructor(private http: HttpClient) {}

  public getShifts(params: {
    storeId?: number;
    from?: string;
    to?: string;
    employeeId?: number;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Observable<PagedResult<ShiftDto>> {
    let query = new HttpParams();
    if (params.storeId !== undefined) {
      query = query.set('storeId', params.storeId.toString());
    }
    if (params.from) {
      query = query.set('from', params.from);
    }
    if (params.to) {
      query = query.set('to', params.to);
    }
    if (params.employeeId !== undefined) {
      query = query.set('employeeId', params.employeeId.toString());
    }
    if (params.status) {
      query = query.set('status', params.status);
    }
    query = query.set('page', (params.page ?? 1).toString());
    query = query.set('pageSize', (params.pageSize ?? 50).toString());

    return this.http.get<PagedResult<ShiftDto>>(this.baseUrl, { params: query });
  }

  public getMyShifts(from?: string, to?: string): Observable<ShiftDto[]> {
    let params = new HttpParams();
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }
    return this.http.get<ShiftDto[]>(`${this.baseUrl}/me`, { params });
  }

  public getEmployees(storeId?: number): Observable<ShiftEmployee[]> {
    let params = new HttpParams();
    if (storeId !== undefined) {
      params = params.set('storeId', storeId.toString());
    }
    return this.http.get<ShiftEmployee[]>(`${this.baseUrl}/employees`, { params });
  }

  public createShift(payload: ShiftCreateRequest): Observable<ShiftMutationResponse> {
    return this.http.post<ShiftMutationResponse>(this.baseUrl, payload);
  }

  public updateShift(shiftId: number, payload: ShiftUpdateRequest): Observable<ShiftMutationResponse> {
    return this.http.put<ShiftMutationResponse>(`${this.baseUrl}/${shiftId}`, payload);
  }

  public deleteShift(shiftId: number): Observable<ShiftMutationResponse> {
    return this.http.delete<ShiftMutationResponse>(`${this.baseUrl}/${shiftId}`);
  }

  public copyWeek(payload: ShiftCopyWeekRequest): Observable<ShiftDto> {
    return this.http.post<ShiftDto>(`${this.baseUrl}/copy-week`, payload);
  }

  public publish(payload: ShiftPublishRequest): Observable<ShiftDto> {
    return this.http.post<ShiftDto>(`${this.baseUrl}/publish`, payload);
  }

  public exportShifts(params: { storeId?: number; from?: string; to?: string; format?: 'csv' | 'xlsx' }): Observable<Blob> {
    let query = new HttpParams();
    if (params.storeId !== undefined) {
      query = query.set('storeId', params.storeId.toString());
    }
    if (params.from) {
      query = query.set('from', params.from);
    }
    if (params.to) {
      query = query.set('to', params.to);
    }
    if (params.format) {
      query = query.set('format', params.format);
    }

    return this.http.get(`${this.baseUrl}/export`, { params: query, responseType: 'blob' });
  }

  public createRequest(payload: ShiftRequestCreateRequest): Observable<ShiftRequestDto> {
    return this.http.post<ShiftRequestDto>(`${environment.apiUrl}/api/shift-requests`, payload);
  }

  public getRequests(params: { storeId?: number; status?: string }): Observable<ShiftRequestDto[]> {
    let query = new HttpParams();
    if (params.storeId !== undefined) {
      query = query.set('storeId', params.storeId.toString());
    }
    if (params.status) {
      query = query.set('status', params.status);
    }
    return this.http.get<ShiftRequestDto[]>(`${environment.apiUrl}/api/shift-requests`, { params: query });
  }

  public approveRequest(requestId: number, payload: ShiftRequestDecisionRequest): Observable<ShiftRequestDto> {
    return this.http.put<ShiftRequestDto>(`${environment.apiUrl}/api/shift-requests/${requestId}/approve`, payload);
  }

  public rejectRequest(requestId: number, payload: ShiftRequestDecisionRequest): Observable<ShiftRequestDto> {
    return this.http.put<ShiftRequestDto>(`${environment.apiUrl}/api/shift-requests/${requestId}/reject`, payload);
  }
}
