import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface VersionInfo {
  version: string;
  releaseDate: string;
}

@Injectable({ providedIn: 'root' })
export class VersionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/version`;

  getVersion(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>(this.apiUrl);
  }
}
