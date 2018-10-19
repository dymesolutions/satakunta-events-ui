import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IImage } from '@app/interfaces/image';
import { environment } from 'environments/environment';

@Injectable()
export class ImageService {

  private apiUrl: string;
  private basicUrl: string;
  private uploadUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.basicUrl = 'basic/';
    this.apiUrl = 'image/';
    this.uploadUrl = 'upload/';
  }

  upload(file: File) {
    const url = environment.config.url.LEApiBaseUrl + this.apiUrl + this.uploadUrl;
    const formData = new FormData();

    formData.append('image-file', file);
    return this.http.post<any>(url, formData);
  }

  save(image: IImage) {
    const url = environment.config.url.LEApiBaseUrl + this.basicUrl + this.apiUrl;
    return this.http.post(url, image);
  }
}
