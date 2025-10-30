import { Component } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userInput: string = '';
  messages: ChatMessage[] = [];
  loading = false;

  constructor(private chatbot: ChatbotService) {}

  /** Nettoie le Markdown pour un affichage simple */
  formatReply(reply: string): string {
    return reply
      .replace(/###/g, '')                 // supprime les titres Markdown
      .replace(/\*\*(.*?)\*\*/g, '$1')    // supprime le gras
      .replace(/- /g, '• ')                // transforme les listes en puces
      .replace(/\n{2,}/g, '\n')           // supprime les sauts de ligne multiples
      .trim();
  }

  sendMessage() {
    const question = this.userInput.trim();
    if (!question) return;

    this.messages.push({ sender: 'user', text: question });
    this.userInput = '';
    this.loading = true;

    this.chatbot.askQuestion(question).subscribe({
      next: (res) => {
        // Nettoie le texte de la réponse avant affichage
        const cleanReply = this.formatReply(res.reply);
        this.messages.push({ sender: 'bot', text: cleanReply });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.messages.push({ sender: 'bot', text: 'Erreur lors de la récupération de la réponse.' });
        this.loading = false;
      }
    });
  }
}
