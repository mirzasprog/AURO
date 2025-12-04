import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatRequest {
  conversationId?: string;
  question: string;
  department?: string;
  tags?: string[];
}

export interface ChatSource {
  documentId: string;
  fileName: string;
  section?: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  conversationId: string;
}

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.baseUrl}/ai/chat`, request);
  }
}
