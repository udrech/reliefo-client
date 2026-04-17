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
}
