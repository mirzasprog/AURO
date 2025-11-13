import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardSummary } from '../data/dashboard/dashboard-summary';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly baseUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) { }

  public getSummary(storeId?: number, date?: string): Observable<DashboardSummary> {
    let params = new HttpParams();
    if (storeId) {
      params = params.set('storeId', storeId.toString());
    }
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`, { params });
  }
}
