import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { AuthService } from './auth.service';

export interface ItemHistory {
  historyId?: number;
  actionType: string;
  createdAt?: string;
  userId?: number;
  vaultItemId?: number;
  orgName?: string;
  itemTitle?: string;
  userName?: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${API_URL}/history`;

  private getHeaders() {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getItemHistory(itemId: number, userId: number, startDate?: string, endDate?: string): Observable<ItemHistory[]> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('startDate', startDate || '')
      .set('endDate', endDate || '');

    return this.http.get<ItemHistory[]>(`${this.apiUrl}/item/${itemId}`, { headers: this.getHeaders().headers, params });
  }
}
