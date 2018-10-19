import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParameterUtil } from '@app/utils/parameter-util';
import { environment } from 'environments/environment';

@Injectable()
export class ReportService {

  private reportPath: string;
  private eventPath: string;
  private keywordPath: string;
  private placePath: string;
  private countPath: string;
  private usagePath: string;

  constructor(
    private http: HttpClient
  ) {
    this.reportPath = 'report/';
    this.eventPath = 'event/';
    this.keywordPath = 'keyword/';
    this.placePath = 'place/';
    this.countPath = 'count/';
    this.usagePath = 'usage/';
  }



  getEventCount(params: any[]) {
    const url =
      environment.config.url.LEApiBaseUrl +
      this.reportPath +
      this.eventPath +
      this.countPath +
      ParameterUtil.createParameterString(params);

    return this.http.get<any>(url);
  }

  getKeywordUsageCount(params: any[]) {
    const url =
      environment.config.url.LEApiBaseUrl +
      this.reportPath +
      this.keywordPath +
      this.usagePath +
      this.countPath +
      ParameterUtil.createParameterString(params);

    return this.http.get<any>(url);
  }

  getPlaceUsageCount(params: any[]) {
    const url =
      environment.config.url.LEApiBaseUrl +
      this.reportPath +
      this.placePath +
      this.usagePath +
      this.countPath +
      ParameterUtil.createParameterString(params);

    return this.http.get<any>(url);
  }
}
