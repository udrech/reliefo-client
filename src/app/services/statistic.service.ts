import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CustomerStat } from '@/models/statistic';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class StatisticService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/statistics`;

  getCustomerCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/customer-count`);
  }

  getAppointmentsPerYear(): Observable<{ year: number; count: number }[]> {
    return this.http.get<{ year: number; count: number }[]>(`${this.apiUrl}/appointments-per-year`);
  }

  getAppointmentsPerMonth(year: number): Observable<{ month: number; count: number }[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<{ month: number; count: number }[]>(`${this.apiUrl}/appointments-per-month`, { params });
  }

  getAppointmentsPerCustomer(year: number): Observable<CustomerStat[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<CustomerStat[]>(`${this.apiUrl}/appointments-per-customer`, { params });
  }
}
