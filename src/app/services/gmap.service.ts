import { Injectable } from '@angular/core';
import { IPosition } from '@app/interfaces/position';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class GmapService {

  private geocoder: google.maps.Geocoder;
  private gScriptLoaded: boolean;

  geocodeSubject: Subject<google.maps.GeocoderResult>;
  private mapPointSubject: Subject<google.maps.LatLng>;
  private mapClickSubject: Subject<IPosition>;
  private waitForGScriptSubject: Subject<boolean>;

  constructor() {
    this.waitForGScriptSubject = new Subject<boolean>();
    this.mapPointSubject = new Subject<google.maps.LatLng>();
    this.mapClickSubject = new Subject<IPosition>();
    this.gScriptLoaded = false;
  }

  get geocodeResult(): Observable<google.maps.GeocoderResult> {
    return this.geocodeSubject.asObservable();
  }

  get mapPoint(): Observable<google.maps.LatLng> {
    return this.mapPointSubject.asObservable();
  }

  get mapClick(): Observable<IPosition> {
    return this.mapClickSubject.asObservable();
  }

  get isGScriptLoaded() {
    return this.gScriptLoaded;
  }

  initService() {
    this.geocodeSubject = new Subject<google.maps.GeocoderResult>();
    this.geocoder = new google.maps.Geocoder();

    // Send message to components that GMap script has been loaded:
    this.waitForGScriptSubject.next(true);
    // Need to set this so component doesn't have to wait the load everytime it is visited:
    this.gScriptLoaded = true;
  }

  /**
   * Used in components to wait that Google Maps script tag has loaded the external JS
   */
  get waitForGScript(): Observable<boolean> {
    return this.waitForGScriptSubject.asObservable();
  }

  geocode(address: string) {
    if (address !== undefined && address.length > 0) {
      this.geocoder.geocode({
        address: address
      }, (result, status) => {

        console.log('Geocoding', result);

        if (status.toString() === 'OK') {
          if (result.length === 1) {
            this.geocodeSubject.next(result[0]);
          }
        }
      });
    }
  }

  centerMap({ lat, lng }) {
    this.mapPointSubject.next(new google.maps.LatLng(lat, lng));
  }

  geocodeCoords(location: google.maps.LatLng) {
    if (location !== undefined && location !== null) {

      this.mapClickSubject.next({
        lat: location.lat(),
        lng: location.lng()
      });

      this.geocoder.geocode({
        location: location
      }, (result, status) => {

        console.log('Geocoding', result);

        if (status.toString() === 'OK') {
          if (result.length === 1) {
            // this.geocodeSubject.next(result[0]);
          }
        }
      });
    }
  }
}
