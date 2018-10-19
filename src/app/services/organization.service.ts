import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class OrganizationService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'organization/';
  }

  getAll() {
    const url = environment.config.url.LEApiBaseUrl + this.apiUrl;
    return this.http.get<any>(url);
  }
}
