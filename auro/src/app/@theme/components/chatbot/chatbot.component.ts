import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatbotService } from '../../../@core/utils/chatbot.service';
import { AiChatService, ChatResponseDto, ChatSource } from '../../../@core/utils/ai-chat.service';

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
  selectedFiles: File[] = [];
  suggestions: string[] = [];
  isSending = false;
  isLoading = false;

  @ViewChild('fileInput')
  fileInput?: ElementRef<HTMLInputElement>;

  constructor(private chatbotService: ChatbotService, private aiChatService: AiChatService) {}

  ngOnInit(): void {
    this.addBotMessage(
      'Pozdrav! 👋 Ja sam Konzum360 – digitalni asistent za sve zaposlenike Konzuma i Mercatora BiH. Tu sam da ti olakšam svakodnevni rad u aplikaciji, pomognem pronaći potrebne informacije, pravilnike, procedure i upute za izvršavanje dnevnih zadataka. Možeš izabrati neku od ponuđenih tema ili jednostavno postaviti svoje pitanje – tu sam da pomognem. 🛒✨'
    );
    this.refreshSuggestion();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  submitQuestion(): void {
    const trimmed = this.currentQuestion.trim();
    if (!trimmed || this.isLoading) {
      return;
    }

    this.isSending = true;
    this.isLoading = true;
    this.addUserMessage(trimmed);
    this.aiChatService
      .chatWithFiles(trimmed, this.conversationId, this.selectedFiles)
      .subscribe({
        next: (response: ChatResponseDto) => {
          this.conversationId = response.conversationId;
          this.addBotMessage(response.answer, response.sources);
          this.currentQuestion = '';
          this.selectedFiles = [];
          this.resetFileInput();
          this.refreshSuggestion();
          this.isSending = false;
          this.isLoading = false;
        },
        error: () => {
          this.addBotMessage('Došlo je do greške pri obradi pitanja. Pokušaj ponovo.');
          this.refreshSuggestion();
          this.isSending = false;
          this.isLoading = false;
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

  private addBotMessage(text: string, sources?: ChatSource[]): void {
    this.conversation.push({ from: 'bot', text, timestamp: new Date(), sources });
  }

  private resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private refreshSuggestion(): void {
    const collected: string[] = [];

    while (collected.length < 3) {
      const suggestion = this.chatbotService.getNextSuggestion();

      if (!suggestion || collected.includes(suggestion)) {
        break;
      }

      collected.push(suggestion);
    }

    this.suggestions = collected;
  }
}
