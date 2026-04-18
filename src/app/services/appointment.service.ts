import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Appointment, AppointmentRaw } from '../models/appointment';
import { environment } from '../../environments/environment';

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
      therapy: {
        ...appointment.therapy,
        validFrom: new Date(appointment.therapy.validFrom),
        createdAt: new Date(appointment.therapy.createdAt),
        updatedAt: new Date(appointment.therapy.updatedAt),
      },
    };
  }

  convertToApi(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Omit<AppointmentRaw, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      ...appointment,
      appointmentTimestamp: appointment.appointmentTimestamp.toISOString(),
      therapy: {
        ...appointment.therapy,
        validFrom: appointment.therapy.validFrom.toISOString(),
        createdAt: appointment.therapy.createdAt.toISOString(),
        updatedAt: appointment.therapy.updatedAt.toISOString(),
      },
    };
  }

  getAll(): Observable<Appointment[]> {
    return this.http.get<AppointmentRaw[]>(this.apiUrl).pipe(
      map(appointments => appointments.map(this.convertFromApi))
    );
  }
}
