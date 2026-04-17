import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { environment } from '../../environments/environment';
import { Therapy } from '../models/therapy';

@Injectable({ providedIn: 'root' })
export class TherapyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/therapies`;

  getAll(): Observable<Therapy[]> {
    return this.http.get<Therapy[]>(this.apiUrl);
  }
}
