import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatSource {
  chunkId: string;
  documentId?: string;
  fileName: string;
  section: string;
}

export interface ChatResponseDto {
  conversationId: string;
  answer: string;
  sources: ChatSource[];
}

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly baseUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  chatWithFiles(question: string, conversationId?: string, files: File[] = []): Observable<ChatResponseDto> {
    const formData = new FormData();
    formData.append('question', question);

    if (conversationId) {
      formData.append('conversationId', conversationId);
    }

    files.forEach(file => formData.append('files', file, file.name));

    return this.http.post<ChatResponseDto>(`${this.baseUrl}/chat-with-files`, formData);
  }
}
