import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { AuthService } from './auth.service';

export interface Category {
  catId?: number;
  catName: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${API_URL}/categories`;

  private getHeaders() {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl, this.getHeaders());
  }

  createCategory(catName: string): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, { catName }, this.getHeaders());
  }

  updateCategory(catId: number, newName: string): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${catId}`, { catName: newName }, this.getHeaders());
  }

  deleteCategory(catId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${catId}`, this.getHeaders());
  }
}
