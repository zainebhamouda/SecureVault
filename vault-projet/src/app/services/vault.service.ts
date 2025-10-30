import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../app.config';
import { AuthService } from './auth.service';

export interface Vault {
  id?: number; // Ajouter l'id si tu veux supprimer ou modifier
  name: string;
  type: string;
  folder: string;
  owner: string;
  organization: string;
  size?: number;
  selected?: boolean;
  username?: string;
  password?: string;

  cardNumber?: string;
  cardExpiry?: string;
  cvv?: string;

  note?: string;
  category?: string;
  tags?: string[];
  priority?: string;

  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  passport?: string;
  license?: string;

  description?: string;
  color?: string;
  
  
  icon?: string;    // optionnel
}
export interface VaultItemResponse {
  itemId: number;
  itemTitle: string;
  itemType: string;
  categoryId: number;
  itemData: any;
  organisationId?: number;
  size?: number;
  selected?: boolean;
  username?: string;
  password?: string;

  cardNumber?: string;
  cardExpiry?: string;
  cvv?: string;

  note?: string;
  category?: string;
  tags?: string[];
  priority?: string;

  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  passport?: string;
  license?: string;

  description?: string;
  color?: string;
  
}
export interface VaultItemRequest {
  itemTitle: string;
  itemType: string;
  categoryId: number;
  itemData: any;
  organisationId?: number;

  size?: number;
  selected?: boolean;
  username?: string;
  password?: string;

  cardNumber?: string;
  cardExpiry?: string;
  cvv?: string;

  note?: string;
  category?: string;
  tags?: string[];
  priority?: string;

  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  passport?: string;
  license?: string;

  description?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  private apiUrl = `${API_URL}/vault-items`;

  private authService = inject(AuthService);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // Récupérer tous les vaults
  getVaults(): Observable<Vault[]> {
    return this.http.get<Vault[]>(this.apiUrl, this.getHeaders());
  }

  // Ajouter un nouveau vault
  addVault(vault: Vault): Observable<Vault> {
    return this.http.post<Vault>(this.apiUrl, vault, this.getHeaders());
  }

  // Supprimer un vault
  deleteVault(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders());
  }
 

  getAllVaultItems(): Observable<VaultItemResponse[]> {
  return this.http.get<VaultItemResponse[]>(`${this.apiUrl}/all`, this.getHeaders());
}

createVaultItem(item: VaultItemRequest): Observable<VaultItemResponse> {
  return this.http.post<VaultItemResponse>(this.apiUrl, item, this.getHeaders());
}

}
