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
    this.suggestions = this.chatbotService.getSampleQuestions();
    this.addBotMessage(
      'Pozdrav! Ja sam K360 chatbot – tvoj digitalni asistent iz Konzuma i Mercatora Plus. Tu sam da ti pomognem uz minimalne smetnje, a uvijek možeš izabrati prijedlog sa strane ili postaviti svoje pitanje.'
    );
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
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
}
