import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFetchUserApiFormat } from '@app/interfaces/fetch-user-api-format';
import { ParameterUtil } from '@app/utils/parameter-util';
import { environment } from 'environments/environment';

@Injectable()
export class UserService {

  private apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = 'user/';
  }


  getAll(params: any[]) {
    const paramString = ParameterUtil.createParameterString(params);

    const url = `${environment.config.url.LEApiBaseUrl}admin/${this.apiUrl + paramString}`;
    return this.http.get<any>(url);
  }

  activate(userId: number) {
    const url = `${environment.config.url.LEApiBaseUrl}admin/${this.apiUrl}activate/`;
    return this.http.put(url, {
      id: userId
    });
  }

  update(user: IFetchUserApiFormat) {
    const url = `${environment.config.url.LEApiBaseUrl}admin/${this.apiUrl}`;
    return this.http.put(url, user);
  }
}
