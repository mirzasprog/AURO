import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatbotService } from '../../../@core/utils/chatbot.service';
import { AiChatService, ChatResponseDto } from '../../../@core/utils/ai-chat.service';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
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
  suggestions: string[] = [];
  isSending = false;
  isLoading = false;
  @ViewChild('chatWindow') chatWindow?: ElementRef<HTMLDivElement>;

  constructor(private chatbotService: ChatbotService, private aiChatService: AiChatService) {}

  ngOnInit(): void {
    this.addBotMessage(
      'Pozdrav! 👋 Ja sam Konzum360 – digitalni asistent za sve zaposlenike Konzuma i Mercatora BiH. Tu sam da ti olakšam svakodnevni rad u aplikaciji, pomognem pronaći potrebne informacije, pravilnike, procedure i upute za izvršavanje dnevnih zadataka. Možeš izabrati neku od ponuđenih tema ili jednostavno postaviti svoje pitanje – tu sam da pomognem. 🛒✨'
    );
    this.loadSuggestions();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.scrollChatToBottom();
    }
  }

  submitQuestion(): void {
    const trimmed = this.currentQuestion.trim();
    if (!trimmed || this.isLoading) {
      return;
    }

    this.isSending = true;
    this.isLoading = true;
    this.addUserMessage(trimmed);
    this.aiChatService.ask(trimmed).subscribe({
      next: (response: ChatResponseDto) => {
        this.addBotMessage(response.answer);
        this.currentQuestion = '';
        this.loadSuggestions();
        this.isSending = false;
        this.isLoading = false;
      },
      error: () => {
        this.addBotMessage('Došlo je do greške pri obradi pitanja. Pokušaj ponovo.');
        this.loadSuggestions();
        this.isSending = false;
        this.isLoading = false;
      },
    });
  }

  useSuggestion(question: string): void {
    this.currentQuestion = question;
    this.submitQuestion();
  }

  private addUserMessage(text: string): void {
    this.conversation.push({ from: 'user', text, timestamp: new Date() });
    this.scrollChatToBottom();
  }

  private addBotMessage(text: string): void {
    this.conversation.push({ from: 'bot', text, timestamp: new Date() });
    this.scrollChatToBottom();
  }

  private loadSuggestions(): void {
    this.chatbotService.getTopicSuggestions().subscribe({
      next: suggestions => (this.suggestions = suggestions.slice(0, 3)),
      error: () => (this.suggestions = []),
    });
  }

  private scrollChatToBottom(): void {
    setTimeout(() => {
      if (this.chatWindow?.nativeElement) {
        const element = this.chatWindow.nativeElement;
        element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
      }
    });
  }
}
