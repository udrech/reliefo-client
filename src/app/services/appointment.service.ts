import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Appointment, AppointmentRaw, AppointmentPayload, AppointmentPayloadRaw } from '../models/appointment';
import { environment } from '../../environments/environment';
import { App } from '../app';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/appointments`;

  convertFromApi(appointment: AppointmentRaw): Appointment {
    return {
      ...appointment,
      appointmentTimestamp: new Date(appointment.appointmentTimestamp),
      createdAt: new Date(appointment.createdAt),
      updatedAt: new Date(appointment.updatedAt),
      therapy: appointment.therapy ? {
        ...appointment.therapy,
        validFrom: new Date(appointment.therapy.validFrom),
        validTo: appointment.therapy.validTo ? new Date(appointment.therapy.validTo) : null,
        createdAt: new Date(appointment.therapy.createdAt),
        updatedAt: new Date(appointment.therapy.updatedAt),
      } : undefined,
    };
  }

  convertToApi(appointment: AppointmentPayload): AppointmentPayloadRaw {
    return {
      customerId: appointment.customerId,
      therapyId: appointment.therapyId,
      appointmentTimestamp: appointment.appointmentTimestamp.toISOString(),
    };
  }

  getAll(): Observable<Appointment[]> {
    return this.http.get<AppointmentRaw[]>(this.apiUrl).pipe(
      map(appointments => appointments.map(this.convertFromApi))
    );
  }

  getById(id: number): Observable<Appointment> {
    return this.http.get<AppointmentRaw>(`${this.apiUrl}/${id}`).pipe(
      map(this.convertFromApi)
    );
  }

  getByCustomerId(customerId: number): Observable<Appointment[]> {
    return this.http.get<AppointmentRaw[]>(`${this.apiUrl}/customer/${customerId}`).pipe(
      map(appointments => appointments.map(this.convertFromApi))
    );
  }

  create(appointment: AppointmentPayload): Observable<Appointment> {
    return this.http.post<AppointmentRaw>(this.apiUrl, this.convertToApi(appointment)).pipe(
      map(appointment => this.convertFromApi(appointment))
    );
  }

  update(id: number, appointment: AppointmentPayload): Observable<Appointment> {
    return this.http.put<AppointmentRaw>(`${this.apiUrl}/${id}`, this.convertToApi(appointment)).pipe(
      map(appointment => this.convertFromApi(appointment))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
