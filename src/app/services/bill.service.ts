import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Bill, BillRaw } from '../models/bill';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BillService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/bills`;

  convertFromApi(bill: BillRaw): Bill {
    return {
      ...bill,
      billTimestamp: new Date(bill.billTimestamp),
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

  convertToApi(bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Omit<BillRaw, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      ...bill,
      billTimestamp: bill.billTimestamp.toISOString(),
      customer: {
        ...bill.customer,
        dateOfBirth: bill.customer.dateOfBirth ? bill.customer.dateOfBirth.toISOString() : null,
        createdAt: bill.customer.createdAt.toISOString(),
        updatedAt: bill.customer.updatedAt.toISOString(),
      },
    };
  }

  getAll(): Observable<Bill[]> {
    return this.http.get<BillRaw[]>(this.apiUrl).pipe(
      map(bills => bills.map(this.convertFromApi))
    );
  }
}
