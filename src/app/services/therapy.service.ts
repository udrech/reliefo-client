import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Therapy, TherapyRaw } from '@/models/therapy';
import { toLocalDateString } from '@/utils/date.utils';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class TherapyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/therapies`;

  convertFromApi(therapy: TherapyRaw): Therapy {
    return {
      ...therapy,
      validFrom: new Date(therapy.validFrom),
      validTo: therapy.validTo ? new Date(therapy.validTo) : null,
      createdAt: new Date(therapy.createdAt),
      updatedAt: new Date(therapy.updatedAt),
    };
  }

  convertToApi(therapy: Omit<Therapy, 'id' | 'createdAt' | 'updatedAt'>): Omit<TherapyRaw, 'id' | 'createdAt' | 'updatedAt'> {
    const validFrom = new Date(therapy.validFrom);
    validFrom.setHours(0, 0, 0, 0);

    const validTo = therapy.validTo ? new Date(therapy.validTo) : null;
    if (validTo) {
      validTo.setHours(23, 59, 59, 999);
    }

    return {
      ...therapy,
      validFrom: validFrom.toISOString(),
      validTo: validTo ? validTo.toISOString() : null,
    };
  }

  getAll(): Observable<Therapy[]> {
    return this.http.get<TherapyRaw[]>(this.apiUrl).pipe(
      map(therapies => therapies.map(this.convertFromApi))
    );
  }

  getValid(d: Date): Observable<Therapy[]> {
    const params = new HttpParams().set('date', toLocalDateString(d));
    return this.http.get<TherapyRaw[]>(`${this.apiUrl}/valid`, { params }).pipe(
      map(therapies => therapies.map(this.convertFromApi))
    );
  }

  getById(id: number): Observable<Therapy> {
    return this.http.get<TherapyRaw>(`${this.apiUrl}/${id}`).pipe(
      map(this.convertFromApi)
    );
  }

  create(therapy: Omit<Therapy, 'id' | 'createdAt' | 'updatedAt'>): Observable<Therapy> {
    return this.http.post<TherapyRaw>(this.apiUrl, this.convertToApi(therapy)).pipe(
      map(this.convertFromApi)
    );
  }

  update(id: number, therapy: Omit<Therapy, 'id' | 'createdAt' | 'updatedAt'>): Observable<Therapy> {
    return this.http.put<TherapyRaw>(`${this.apiUrl}/${id}`, this.convertToApi(therapy)).pipe(
      map(this.convertFromApi)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
