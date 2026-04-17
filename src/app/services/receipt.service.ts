import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receipt } from '../models/receipt';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReceiptService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/receipts`;

  getAll(): Observable<Receipt[]> {
    return this.http.get<Receipt[]>(this.apiUrl);
  }
}
