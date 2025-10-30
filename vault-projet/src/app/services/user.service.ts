import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { AuthService } from './auth.service';

export interface User {
  userId?: number;
  userName: string;
  userEmail: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${API_URL}/users`;

  private getHeaders() {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // Récupérer tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, this.getHeaders());
  }

  // Récupérer un utilisateur par son ID
  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, this.getHeaders());
  }

  // ✅ Récupérer un utilisateur par email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`, this.getHeaders());
  }

  // Mettre à jour un utilisateur par ID
  updateUser(userId: number, data: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, data, this.getHeaders());
  }

/*
  updateUserByEmail(email: string, data: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/email/${email}`, data, this.getHeaders());
  }*/
 

  // Supprimer un utilisateur
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, this.getHeaders());
  }
  // Dans user.service.ts
updateUserByEmail(email: string, data: Partial<User>): Observable<User> {
  // Récupérer l'utilisateur par email, puis mettre à jour par ID
  return new Observable<User>(observer => {
    this.getUserByEmail(email).subscribe({
      next: user => {
        if (user.userId) {
          this.updateUser(user.userId!, data).subscribe({
            next: updatedUser => observer.next(updatedUser),
            error: err => observer.error(err)
          });
        } else {
          observer.error({ message: 'Utilisateur non trouvé' });
        }
      },
      error: err => observer.error(err)
    });
  });
}

deleteUserByEmail(email: string): Observable<void> {
  return new Observable<void>(observer => {
    this.getUserByEmail(email).subscribe({
      next: user => {
        if (user.userId) {
          this.deleteUser(user.userId).subscribe({
            next: () => observer.next(),
            error: err => observer.error(err)
          });
        } else {
          observer.error({ message: 'Utilisateur non trouvé' });
        }
      },
      error: err => observer.error(err)
    });
  });
}
// Effacer le coffre d’un utilisateur par email
  clearUserVault(email: string): Observable<void> {
    return new Observable<void>(observer => {
      this.getUserByEmail(email).subscribe({
        next: user => {
          if (user.userId) {
            // Appelle ton endpoint backend pour vider le coffre
            this.http.delete<void>(`${this.apiUrl}/${user.userId}/vault`, this.getHeaders())
              .subscribe({ next: () => observer.next(), error: err => observer.error(err) });
          } else {
            observer.error({ message: 'Utilisateur non trouvé' });
          }
        },
        error: err => observer.error(err)
      });
    });
  }

  // Révoquer toutes les sessions d’un utilisateur par email
  revokeUserSessions(email: string): Observable<void> {
    return new Observable<void>(observer => {
      this.getUserByEmail(email).subscribe({
        next: user => {
          if (user.userId) {
            // Appelle ton endpoint backend pour révoquer les sessions
            this.http.post<void>(`${this.apiUrl}/${user.userId}/sessions/revoke`, {}, this.getHeaders())
              .subscribe({ next: () => observer.next(), error: err => observer.error(err) });
          } else {
            observer.error({ message: 'Utilisateur non trouvé' });
          }
        },
        error: err => observer.error(err)
      });
    });
  }

  // Désactiver la protection d’un nouvel appareil pour un utilisateur par email
  disableDeviceProtection(email: string): Observable<void> {
    return new Observable<void>(observer => {
      this.getUserByEmail(email).subscribe({
        next: user => {
          if (user.userId) {
            // Appelle ton endpoint backend pour désactiver la protection
            this.http.post<void>(`${this.apiUrl}/${user.userId}/device-protection/disable`, {}, this.getHeaders())
              .subscribe({ next: () => observer.next(), error: err => observer.error(err) });
          } else {
            observer.error({ message: 'Utilisateur non trouvé' });
          }
        },
        error: err => observer.error(err)
      });
    });
  }
}
