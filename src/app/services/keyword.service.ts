import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParameterUtil } from '@app/utils/parameter-util';
import { environment } from 'environments/environment';

@Injectable()
export class KeywordService {

  private apiUrl: string;
  private existsUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'keyword/';
    this.existsUrl = 'exists/';
  }

  getAll(params: any[]) {
    const url = environment.config.url.LEApiBaseUrl + this.apiUrl + ParameterUtil.createParameterString(params);
    return this.http.get<any>(url);
  }

  exists(params: any[]) {
    const url = environment.config.url.LEApiBaseUrl + this.apiUrl + this.existsUrl + ParameterUtil.createParameterString(params);
    return this.http.get<any>(url);
  }

  update(keyword: any) {
    const url = environment.config.url.LEApiBaseUrl + this.apiUrl;
    return this.http.put<any>(url, keyword);
  }

  save(keyword: any) {
    const url = environment.config.url.LEApiBaseUrl + this.apiUrl;
    return this.http.post<any>(url, keyword);
  }

  delete(keyword: any) {
    const url = environment.config.url.LEApiBaseUrl + this.apiUrl;
    return this.http.delete<any>(url, keyword);
  }
}
