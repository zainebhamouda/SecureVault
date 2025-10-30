import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { AuthService } from './auth.service';

export interface Organisation {
  orgId?: number;
  orgName: string;
  membersCount?: number;
}

export interface Member {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
}

@Injectable({ providedIn: 'root' })
export class OrganisationService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${API_URL}/organisations`;

  private getHeaders() {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getUserOrganisations(userId: number): Observable<Organisation[]> {
    return this.http.get<Organisation[]>(`${this.apiUrl}/user/${userId}`, this.getHeaders());
  }

  createOrganisation(orgName: string, creatorUserId: number): Observable<Organisation> {
    return this.http.post<Organisation>(this.apiUrl, { orgName, creatorUserId }, this.getHeaders());
  }

  getOrganisation(orgId: number, userId: number): Observable<Organisation> {
    return this.http.get<Organisation>(`${this.apiUrl}/${orgId}?userId=${userId}`, this.getHeaders());
  }

  getMembers(orgId: number, userId: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/${orgId}/members?userId=${userId}`, this.getHeaders());
  }

  addMember(orgId: number, userEmail: string, role: string, requesterId: number): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/${orgId}/members`, { userEmail, role, requesterId }, this.getHeaders());
  }

  removeMember(orgId: number, memberUserId: number, requesterId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orgId}/members/${memberUserId}?requesterId=${requesterId}`, this.getHeaders());
  }

  deleteOrganisation(orgId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orgId}?userId=${userId}`, this.getHeaders());
  }
}
