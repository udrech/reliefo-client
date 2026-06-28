import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { MedicalHistoryRecord, MedicalHistoryRecordPayload, MedicalHistoryRecordPayloadRaw, MedicalHistoryRecordRaw } from '@/models/medicalhistoryrecord';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class MedicalHistoryRecordService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/medicalhistoryrecords`;

  convertFromApi(record: MedicalHistoryRecordRaw): MedicalHistoryRecord {
    return {
      ...record,
      historyTimestamp: new Date(record.historyTimestamp),
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    };
  }

  convertToApi(record: MedicalHistoryRecordPayload): MedicalHistoryRecordPayloadRaw {
    return {
      customerId: record.customerId,
      historyTimestamp: record.historyTimestamp.toISOString(),
      historyType: record.historyType,
      note: record.note,
      markings: record.markings,
      markingsImage: record.markingsImage,
    };
  }

  getByCustomerId(customerId: number): Observable<MedicalHistoryRecord[]> {
    return this.http.get<MedicalHistoryRecordRaw[]>(`${this.apiUrl}/customer/${customerId}`).pipe(
      map(records => records.map(r => this.convertFromApi(r)))
    );
  }

  getById(id: number): Observable<MedicalHistoryRecord> {
    return this.http.get<MedicalHistoryRecordRaw>(`${this.apiUrl}/${id}`).pipe(
      map(r => this.convertFromApi(r))
    );
  }

  create(record: MedicalHistoryRecordPayload): Observable<MedicalHistoryRecord> {
    return this.http.post<MedicalHistoryRecordRaw>(this.apiUrl, this.convertToApi(record)).pipe(
      map(r => this.convertFromApi(r))
    );
  }

  update(id: number, record: MedicalHistoryRecordPayload): Observable<MedicalHistoryRecord> {
    return this.http.put<MedicalHistoryRecordRaw>(`${this.apiUrl}/${id}`, this.convertToApi(record)).pipe(
      map(r => this.convertFromApi(r))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
