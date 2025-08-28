
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: string;
  edpNo?: string;
  designation?: string;
  addressOffice?: string;
  addressResidence?: string;
  phoneOffice?: string;
  phoneResidence?: string;
  mobile?: string;
  societyId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  email?: string;
  name: string;
  role: string;
  edpNo?: string;
  designation?: string;
  addressOffice?: string;
  addressResidence?: string;
  phoneOffice?: string;
  phoneResidence?: string;
  mobile?: string;
  societyId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(societyId?: string, role?: string): Observable<User[]> {
    let params = '';
    if (societyId) params += `societyId=${societyId}&`;
    if (role) params += `role=${role}&`;
    return this.http.get<User[]>(`${this.apiUrl}?${params}`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: string, user: Partial<CreateUserDto>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
