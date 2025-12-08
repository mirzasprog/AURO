import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatResponseDto {
  answer: string;
  matchedTopic?: string;
  fallback: boolean;
}

export interface KnowledgeTopicDto {
  id: number;
  tema: string;
  upute: string;
}

export interface UnansweredQuestionDto {
  id: number;
  question: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private readonly chatbotUrl = `${environment.apiUrl}/chatbot`;
  private readonly topicsUrl = `${environment.apiUrl}/knowledge-topics`;
  private readonly unansweredUrl = `${environment.apiUrl}/unanswered-questions`;

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<ChatResponseDto> {
    return this.http.post<ChatResponseDto>(this.chatbotUrl, { message: question });
  }

  getKnowledgeTopics(): Observable<KnowledgeTopicDto[]> {
    return this.http.get<KnowledgeTopicDto[]>(this.topicsUrl);
  }

  createKnowledgeTopic(topic: Omit<KnowledgeTopicDto, 'id'>): Observable<KnowledgeTopicDto> {
    return this.http.post<KnowledgeTopicDto>(this.topicsUrl, topic);
  }

  updateKnowledgeTopic(topic: KnowledgeTopicDto): Observable<void> {
    return this.http.put<void>(`${this.topicsUrl}/${topic.id}`, topic);
  }

  deleteKnowledgeTopic(id: number): Observable<void> {
    return this.http.delete<void>(`${this.topicsUrl}/${id}`);
  }

  getUnansweredQuestions(): Observable<UnansweredQuestionDto[]> {
    return this.http.get<UnansweredQuestionDto[]>(this.unansweredUrl);
  }
}
