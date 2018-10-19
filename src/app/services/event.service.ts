import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFetchEventApiFormat } from '@app/interfaces/fetch-event-api-format';
import { ISaveEventApiFormat } from '@app/interfaces/save-event-api-format';
import { Event } from '@app/models/event';
import { ParameterUtil } from '@app/utils/parameter-util';
import { environment } from 'environments/environment';

@Injectable()
export class EventService {
  private apiUrl: string;
  private basicUrl: string;
  private manageUrl: string;
  private dateParamFormat = 'yyyy-MM-dd';

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.apiUrl = 'event/';
    this.basicUrl = 'basic/';
    this.manageUrl = 'manager/';
  }

  getAll(params: any[]) {
    const paramString = ParameterUtil.createParameterString(params);
    const url = `${environment.config.url.LEApiBaseUrl + this.apiUrl + paramString}`;

    return this.http.get<any>(url);
  }

  getAllByUser(params: any[]) {
    const paramQuery = ParameterUtil.createParameterString(params);
    const url = `${environment.config.url.LEApiBaseUrl + this.basicUrl + this.apiUrl + paramQuery}`;
    return this.http.get<any>(url);
  }

  getAllForManager(params: any[]) {
    const paramQuery = ParameterUtil.createParameterString(params);
    const url = `${environment.config.url.LEApiBaseUrl + this.manageUrl + this.apiUrl + paramQuery}`;
    return this.http.get<any>(url);
  }

  getById(id: string, params: any[]) {
    const paramQuery = ParameterUtil.createParameterString(params);
    const url = `${environment.config.url.LEApiBaseUrl + this.apiUrl + id}/${paramQuery}`;
    return this.http.get<IFetchEventApiFormat>(url);
  }

  getByIdForEdit(id: string, params: any[]) {
    const paramQuery = ParameterUtil.createParameterString(params);
    const url = `${environment.config.url.LEApiBaseUrl + this.basicUrl + this.apiUrl + id}/${paramQuery}`;
    return this.http.get<IFetchEventApiFormat>(url);
  }

  save(event: ISaveEventApiFormat) {
    const url = environment.config.url.LEApiBaseUrl + this.basicUrl + this.apiUrl;
    return this.http.post<Event>(url, event);
  }

  saveEdit(event: ISaveEventApiFormat, eventId: string) {
    const url = `${environment.config.url.LEApiBaseUrl + this.basicUrl + this.apiUrl}/${eventId}/`;
    return this.http.put<Event>(url, event);
  }

  publish(eventId: string) {
    const url = environment.config.url.LEApiBaseUrl + this.manageUrl + this.apiUrl + 'publish/';
    return this.http.put(url, { event_id: eventId });
  }

  delete(eventId: string) {
    const url = `${environment.config.url.LEApiBaseUrl + this.basicUrl + this.apiUrl}/${eventId}/`;
    return this.http.delete(url);
  }
}
