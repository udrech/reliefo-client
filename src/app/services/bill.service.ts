import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Bill, BillPayload, BillRaw } from '@/models/bill';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class BillService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/bills`;

  convertFromApi(bill: BillRaw): Bill {
    return {
      ...bill,
      createdAt: new Date(bill.createdAt),
      updatedAt: new Date(bill.updatedAt),
      customer: {
        ...bill.customer,
        dateOfBirth: bill.customer.dateOfBirth ? new Date(bill.customer.dateOfBirth) : null,
        createdAt: new Date(bill.customer.createdAt),
        updatedAt: new Date(bill.customer.updatedAt),
      },
    };
  }

  getAll(): Observable<Bill[]> {
    return this.http.get<BillRaw[]>(this.apiUrl).pipe(
      map(bills => bills.map(this.convertFromApi))
    );
  }

  getById(id: number): Observable<Bill> {
    return this.http.get<BillRaw>(`${this.apiUrl}/${id}`).pipe(
      map(this.convertFromApi)
    );
  }

  getByCustomerId(customerId: number): Observable<Bill[]> {
    return this.http.get<BillRaw[]>(`${this.apiUrl}/customer/${customerId}`).pipe(
      map(bills => bills.map(this.convertFromApi))
    );
  }

  create(bill: BillPayload): Observable<Bill> {
    return this.http.post<BillRaw>(this.apiUrl, bill).pipe(
      map(this.convertFromApi)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
