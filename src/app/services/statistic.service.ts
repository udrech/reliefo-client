import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppointmentsPerMonthStat, AppointmentsPerCustomerStat, IncomePerMonthStat } from '@/models/statistic';
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

  getAppointmentsPerMonth(year: number): Observable<AppointmentsPerMonthStat[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<AppointmentsPerMonthStat[]>(`${this.apiUrl}/appointments-per-month`, { params });
  }

  getAppointmentsPerCustomer(year: number): Observable<AppointmentsPerCustomerStat[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<AppointmentsPerCustomerStat[]>(`${this.apiUrl}/appointments-per-customer`, { params });
  }

  getIncomePerMonth(year: number): Observable<IncomePerMonthStat[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<IncomePerMonthStat[]>(`${this.apiUrl}/income-per-month`, { params });
  }
}
