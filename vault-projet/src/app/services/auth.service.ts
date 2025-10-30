import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../app.config';

export interface LoginRequest {
  userEmail: string;
  userPassword: string;  
}


export interface SignupRequest {
  userName: string;
  userEmail: string;
  userPassword: string;
}

export interface AuthResponse {
  token: string;
  userName: string;
  userEmail: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // -----------------------------
  // Authentification
  // -----------------------------
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, data).pipe(
      tap(res => {
        if(res.token) this.setToken(res.token);
      })
    );
  }

  signup(data: SignupRequest): Observable<any> {
    return this.http.post(`${API_URL}/auth/signup`, data);
  }

  // -----------------------------
  // Gestion du token
  // -----------------------------
  setToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }

  // -----------------------------
  // Helpers
  // -----------------------------
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }
}
