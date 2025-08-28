
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Voucher {
  id: string;
  voucherNumber: string;
  voucherDate: string;
  description: string;
  totalAmount: number;
  voucherType: string;
  societyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateVoucherDto {
  voucherNumber: string;
  voucherDate: string;
  description: string;
  totalAmount: number;
  voucherType: string;
  societyId: string;
}

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private apiUrl = 'http://localhost:5000/api/vouchers';

  constructor(private http: HttpClient) {}

  getVouchers(societyId?: string): Observable<Voucher[]> {
    let params = societyId ? `?societyId=${societyId}` : '';
    return this.http.get<Voucher[]>(`${this.apiUrl}${params}`);
  }

  getVoucherById(id: string): Observable<Voucher> {
    return this.http.get<Voucher>(`${this.apiUrl}/${id}`);
  }

  createVoucher(voucher: CreateVoucherDto): Observable<Voucher> {
    return this.http.post<Voucher>(this.apiUrl, voucher);
  }

  updateVoucher(id: string, voucher: Partial<CreateVoucherDto>): Observable<Voucher> {
    return this.http.put<Voucher>(`${this.apiUrl}/${id}`, voucher);
  }

  deleteVoucher(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
