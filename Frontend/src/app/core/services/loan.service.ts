
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Loan {
  id: string;
  edpNo: string;
  memberName: string;
  loanAmount: number;
  previousLoan: number;
  netLoan: number;
  installments: number;
  installmentAmount: number;
  purpose?: string;
  loanDate: string;
  status: string;
  memberId: string;
  societyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateLoanDto {
  edpNo: string;
  memberName: string;
  loanAmount: number;
  previousLoan: number;
  installments: number;
  installmentAmount: number;
  purpose?: string;
  loanDate: string;
  memberId: string;
  societyId: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'http://localhost:5000/api/loans';

  constructor(private http: HttpClient) {}

  getLoans(societyId?: string): Observable<Loan[]> {
    let params = societyId ? `?societyId=${societyId}` : '';
    return this.http.get<Loan[]>(`${this.apiUrl}${params}`);
  }

  getLoanById(id: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/${id}`);
  }

  createLoan(loan: CreateLoanDto): Observable<Loan> {
    return this.http.post<Loan>(this.apiUrl, loan);
  }

  updateLoan(id: string, loan: Partial<CreateLoanDto>): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/${id}`, loan);
  }

  deleteLoan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
