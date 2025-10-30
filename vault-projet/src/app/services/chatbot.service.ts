import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private apiUrl = 'http://localhost:8080/api/chat'; // URL backend

  constructor(private http: HttpClient) {}

  // On envoie { question } pour correspondre au controller
  askQuestion(question: string): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(this.apiUrl, { question });
  }
}
