
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Member {
  id: string;
  edpNo: string;
  name: string;
  designation?: string;
  branch?: string;
  officeAddress?: string;
  residenceAddress?: string;
  city?: string;
  email?: string;
  phoneOffice?: string;
  phoneResidence?: string;
  mobile?: string;
  joiningDate: string;
  monthlyContribution: number;
  totalShares: number;
  currentBalance: number;
  societyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateMemberDto {
  edpNo: string;
  name: string;
  designation?: string;
  branch?: string;
  officeAddress?: string;
  residenceAddress?: string;
  city?: string;
  email?: string;
  phoneOffice?: string;
  phoneResidence?: string;
  mobile?: string;
  joiningDate: string;
  monthlyContribution: number;
  societyId: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = 'http://localhost:5000/api/members';

  constructor(private http: HttpClient) {}

  getMembers(societyId?: string): Observable<Member[]> {
    let params = societyId ? `?societyId=${societyId}` : '';
    return this.http.get<Member[]>(`${this.apiUrl}${params}`);
  }

  getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  createMember(member: CreateMemberDto): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  updateMember(id: string, member: Partial<CreateMemberDto>): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
  }

  deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
