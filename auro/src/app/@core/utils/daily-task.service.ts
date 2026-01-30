import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DailyTask, DailyTaskBulkPayload, DailyTaskBulkResult, DailyTaskPayload, DailyTaskStatusPayload, DailyTaskStore } from '../data/daily-task';

@Injectable({ providedIn: 'root' })
export class DailyTaskService {
  private readonly baseUrl = `${environment.apiUrl}/api/dailytasks`;

  constructor(private http: HttpClient) { }

  public getTodayTasks(storeId?: number, type?: string): Observable<DailyTask[]> {
    let params = new HttpParams();
    if (storeId) {
      params = params.set('storeId', storeId.toString());
    }
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<DailyTask[]>(`${this.baseUrl}/today`, { params });
  }

  public getStores(): Observable<DailyTaskStore[]> {
    return this.http.get<DailyTaskStore[]>(`${this.baseUrl}/stores`);
  }

  public getHistoryTasks(params: {
    storeId?: number | null;
    from?: string;
    to?: string;
    status?: string;
    type?: string;
  }): Observable<DailyTask[]> {
    let httpParams = new HttpParams();
    if (params.storeId) {
      httpParams = httpParams.set('storeId', params.storeId.toString());
    }
    if (params.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params.to) {
      httpParams = httpParams.set('to', params.to);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }
    return this.http.get<DailyTask[]>(`${this.baseUrl}/history`, { params: httpParams });
  }

  public downloadReport(params: {
    storeId?: number | null;
    from?: string;
    to?: string;
    status?: string;
    type?: string;
  }): Observable<Blob> {
    let httpParams = new HttpParams();
    if (params.storeId) {
      httpParams = httpParams.set('storeId', params.storeId.toString());
    }
    if (params.from) {
      httpParams = httpParams.set('from', params.from);
    }
    if (params.to) {
      httpParams = httpParams.set('to', params.to);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }
    return this.http.get(`${this.baseUrl}/report`, { params: httpParams, responseType: 'blob' });
  }

  public createCustomTask(storeId: number, payload: DailyTaskPayload): Observable<DailyTask> {
    return this.http.post<DailyTask>(`${this.baseUrl}/store/${storeId}/custom`, payload);
  }

  public createBulkCustomTask(payload: DailyTaskBulkPayload): Observable<DailyTaskBulkResult> {
    return this.http.post<DailyTaskBulkResult>(`${this.baseUrl}/bulk`, payload);
  }

  public updateCustomTask(taskId: number, payload: DailyTaskPayload): Observable<DailyTask> {
    return this.http.put<DailyTask>(`${this.baseUrl}/custom/${taskId}`, payload);
  }

  public updateTaskStatus(taskId: number, payload: DailyTaskStatusPayload): Observable<DailyTask> {
    const form = new FormData();
    form.append('status', payload.status);
    if (payload.completionNote !== undefined && payload.completionNote !== null) {
      form.append('completionNote', payload.completionNote);
    }
    if (payload.image) {
      form.append('image', payload.image);
    }
    if (payload.removeImage) {
      form.append('removeImage', 'true');
    }
    return this.http.put<DailyTask>(`${this.baseUrl}/${taskId}/status`, form);
  }
}
