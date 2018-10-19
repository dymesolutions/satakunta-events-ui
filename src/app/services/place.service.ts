import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParameterUtil } from '@app/utils/parameter-util';
import { environment } from 'environments/environment';

@Injectable()
export class PlaceService {

  private apiUrl: string;
  private paramUtil: ParameterUtil;

  constructor(private http: HttpClient) {
    this.apiUrl = 'place/';
  }

  getAll(params: any) {
    const paramString = ParameterUtil.createParameterString(params);
    const url = `${environment.config.url.LEApiBaseUrl + this.apiUrl + ParameterUtil.createParameterString(params)}`;
    return this.http.get<any>(url);
  }

}
