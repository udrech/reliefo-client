import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Therapy } from '../models/therapy';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TherapyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/therapies`;

  getAll(): Observable<Therapy[]> {
    return this.http.get<Therapy[]>(this.apiUrl);
  }

  getById(id: number): Observable<Therapy> {
    return this.http.get<Therapy>(`${this.apiUrl}/${id}`);
  }

  create(therapy: Omit<Therapy, 'id' | 'createdAt' | 'updatedAt'>): Observable<Therapy> {
    return this.http.post<Therapy>(this.apiUrl, therapy);
  }

  update(id: number, therapy: Omit<Therapy, 'id' | 'createdAt' | 'updatedAt'>): Observable<Therapy> {
    return this.http.put<Therapy>(`${this.apiUrl}/${id}`, therapy);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
