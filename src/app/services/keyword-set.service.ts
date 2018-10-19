import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParameterUtil } from '@app/utils/parameter-util';
import { environment } from 'environments/environment';

@Injectable()
export class KeywordSetService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'keyword_set/';
  }

  getAll(params: any[]) {
    const url = `${environment.config.url.LEApiBaseUrl + this.apiUrl + ParameterUtil.createParameterString(params)}`;
    return this.http.get<any>(url);
  }
}
