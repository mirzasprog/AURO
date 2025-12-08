import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AiChatService, KnowledgeTopicDto, UnansweredQuestionDto } from './ai-chat.service';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  constructor(private aiChatService: AiChatService) {}

  getTopicSuggestions(): Observable<string[]> {
    return this.aiChatService.getKnowledgeTopics().pipe(
      map(topics => {
        if (!topics || !topics.length) {
          return [];
        }

        return topics.slice(0, 10).map(topic => `Kako se radi ${topic.tema.toLowerCase()}?`);
      })
    );
  }

  getKnowledgeTopics(): Observable<KnowledgeTopicDto[]> {
    return this.aiChatService.getKnowledgeTopics();
  }

  createKnowledgeTopic(topic: Omit<KnowledgeTopicDto, 'id'>): Observable<KnowledgeTopicDto> {
    return this.aiChatService.createKnowledgeTopic(topic);
  }

  updateKnowledgeTopic(topic: KnowledgeTopicDto): Observable<void> {
    return this.aiChatService.updateKnowledgeTopic(topic);
  }

  deleteKnowledgeTopic(id: number): Observable<void> {
    return this.aiChatService.deleteKnowledgeTopic(id);
  }

  getUnansweredQuestions(): Observable<UnansweredQuestionDto[]> {
    return this.aiChatService.getUnansweredQuestions();
  }

  getFallbackMessage(): Observable<string> {
    return of('Za ovo trenutno nemam odgovor u bazi. Molimo te obrati se IT službi.');
  }
}
