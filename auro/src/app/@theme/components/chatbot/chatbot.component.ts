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
  suggestions: string[] = [];
  currentQuestion = '';
  conversationId?: string;
  selectedFiles: File[] = [];
  isSending = false;

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  constructor(private chatbotService: ChatbotService, private aiChatService: AiChatService) {}

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

    this.isSending = true;
    this.addUserMessage(trimmed);
    this.aiChatService
      .chatWithFiles(trimmed, this.conversationId, this.selectedFiles)
      .subscribe({
        next: (response: ChatResponseDto) => {
          this.conversationId = response.conversationId;
          this.addBotMessage(response.answer);
          this.currentQuestion = '';
          this.selectedFiles = [];
          this.resetFileInput();
          this.refreshSuggestion();
          this.isSending = false;
        },
        error: () => {
          this.addBotMessage('Došlo je do greške pri obradi pitanja. Pokušaj ponovo.');
          this.refreshSuggestion();
          this.isSending = false;
        },
      });
  }

  onFilesSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files) {
      this.selectedFiles = [];
      return;
    }

    this.selectedFiles = Array.from(files);
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);

    if (!this.selectedFiles.length) {
      this.resetFileInput();
    }
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

  private resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
