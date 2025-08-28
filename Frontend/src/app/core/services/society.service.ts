
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSocietyDto {
  name: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocietyService {
  private apiUrl = 'http://localhost:5000/api/societies';

  constructor(private http: HttpClient) {}

  getSocieties(): Observable<Society[]> {
    return this.http.get<Society[]>(this.apiUrl);
  }

  getSocietyById(id: string): Observable<Society> {
    return this.http.get<Society>(`${this.apiUrl}/${id}`);
  }

  createSociety(society: CreateSocietyDto): Observable<Society> {
    return this.http.post<Society>(this.apiUrl, society);
  }

  updateSociety(id: string, society: Partial<CreateSocietyDto>): Observable<Society> {
    return this.http.put<Society>(`${this.apiUrl}/${id}`, society);
  }

  deleteSociety(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
