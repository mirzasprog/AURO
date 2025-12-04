import { Component, OnInit } from '@angular/core';
import { ChatbotResponse, ChatbotService } from '../../../@core/utils/chatbot.service';

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
  suggestions: string[] = [];
  currentQuestion = '';

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.refreshSuggestion();
    this.addBotMessage(
      'Pozdrav! 👋 Ja sam Konzum360 – digitalni asistent za sve zaposlenike Konzuma i Mercatora BiH. Tu sam da ti olakšam svakodnevni rad u aplikaciji, pomognem pronaći potrebne informacije, pravilnike, procedure i upute za izvršavanje dnevnih zadataka. Možeš izabrati neku od ponuđenih tema ili jednostavno postaviti svoje pitanje – tu sam da pomognem. 🛒✨'
    );
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.refreshSuggestion();
    }
  }

  submitQuestion(): void {
    const trimmed = this.currentQuestion.trim();
    if (!trimmed) {
      return;
    }

    this.addUserMessage(trimmed);
    const response: ChatbotResponse = this.chatbotService.askQuestion(trimmed);
    this.addBotMessage(response.answer);
    this.currentQuestion = '';
    this.refreshSuggestion();
  }

  useSuggestion(question: string): void {
    this.currentQuestion = question;
    this.submitQuestion();
  }

  private addUserMessage(text: string): void {
    this.conversation.push({ from: 'user', text, timestamp: new Date() });
  }

  private addBotMessage(text: string): void {
    this.conversation.push({ from: 'bot', text, timestamp: new Date() });
  }

  private refreshSuggestion(): void {
    const nextSuggestion = this.chatbotService.getNextSuggestion();
    this.suggestions = nextSuggestion ? [nextSuggestion] : [];
  }
}
