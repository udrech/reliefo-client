import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Customer, CustomerRaw } from '@/models/customer';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/customers`;

  convertFromApi(customer: CustomerRaw): Customer {
    // convert ISO date strings to Date objects
    return {
      ...customer,
      dateOfBirth: customer.dateOfBirth ? new Date(customer.dateOfBirth) : null,
      createdAt: new Date(customer.createdAt),
      updatedAt: new Date(customer.updatedAt),
    };
  }

  convertToApi(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Omit<CustomerRaw, 'id' | 'createdAt' | 'updatedAt'> {
    // convert Date objects to ISO date strings
    return {
      ...customer,
      dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.toISOString() : null,
    };
  }

  getAll(): Observable<Customer[]> {
    return this.http.get<CustomerRaw[]>(this.apiUrl).pipe(
      map((customers: CustomerRaw[]) => customers.map(this.convertFromApi))
    );
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<CustomerRaw>(`${this.apiUrl}/${id}`).pipe(
      map(this.convertFromApi)
    );
  }

  create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Observable<Customer> {
    return this.http.post<CustomerRaw>(this.apiUrl, this.convertToApi(customer)).pipe(
      map(this.convertFromApi)
    );
  }

  update(id: number, customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Observable<Customer> {
    return this.http.put<CustomerRaw>(`${this.apiUrl}/${id}`, this.convertToApi(customer)).pipe(
      map(this.convertFromApi)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
