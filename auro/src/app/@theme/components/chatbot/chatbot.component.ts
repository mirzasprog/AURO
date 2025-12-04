import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AiChatService, ChatRequest, ChatResponse, ChatSource } from '../../../@core/services/ai-chat.service';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
  sources?: ChatSource[];
}

@Component({
  selector: 'ngx-chatbot-widget',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  conversation: ChatMessage[] = [];
  currentQuestion = '';
  conversationId?: string;
  isLoading = false;
  suggestions: string[] = [
    'Kako prijaviti da nema otpisa?',
    'Kako da unesem parcijalnu inventuru?',
    'Kako da vidim dnevne zadatke?',
  ];

  constructor(private aiChatService: AiChatService) {}

  ngOnInit(): void {
    this.addBotMessage(
      'Pozdrav! 👋 Ja sam Konzum360 – digitalni asistent za sve zaposlenike Konzuma i Mercatora BiH. Tu sam da ti olakšam svakodnevni rad u aplikaciji, pomognem pronaći potrebne informacije, pravilnike, procedure i upute za izvršavanje dnevnih zadataka. Možeš izabrati neku od ponuđenih tema ili jednostavno postaviti svoje pitanje – tu sam da pomognem. 🛒✨'
    );
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  submitQuestion(): void {
    const trimmed = this.currentQuestion.trim();
    if (!trimmed || this.isLoading) {
      return;
    }

    this.addUserMessage(trimmed);
    this.isLoading = true;

    const request: ChatRequest = {
      question: trimmed,
      conversationId: this.conversationId,
    };

    this.aiChatService
      .sendMessage(request)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.currentQuestion = '';
        })
      )
      .subscribe({
        next: (response: ChatResponse) => {
          this.conversationId = response.conversationId;
          this.addBotMessage(response.answer, response.sources);
        },
        error: () => {
          this.addBotMessage('Došlo je do greške pri obradi pitanja. Pokušaj ponovo.');
        },
      });
  }

  useSuggestion(question: string): void {
    this.currentQuestion = question;
    this.submitQuestion();
  }

  private addUserMessage(text: string): void {
    this.conversation.push({ from: 'user', text, timestamp: new Date() });
  }

  private addBotMessage(text: string, sources?: ChatSource[]): void {
    this.conversation.push({ from: 'bot', text, timestamp: new Date(), sources });
  }
}
