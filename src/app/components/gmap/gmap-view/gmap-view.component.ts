import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GmapService } from '@app/services/gmap.service';
import { environment } from 'environments/environment';
import { } from 'googlemaps';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-gmap-view',
  template: '<div #gMap></div>',
  styleUrls: ['./gmap-view.component.scss']
})
export class GmapViewComponent implements OnInit, OnDestroy {

  // Google Map
  @ViewChild('gMap') gMapElem: any;
  private map: google.maps.Map;
  private currentMarker: google.maps.Marker;

  // For address fetch:
  private geocodeResultSub: Subscription;
  private waitForGScriptSub: Subscription;
  private mapPointSub: Subscription;

  constructor(private gMapService: GmapService) { }

  ngOnInit() {
    if (!this.gMapService.isGScriptLoaded) {
      this.waitForGScriptSub = this.gMapService.waitForGScript
        .subscribe(isLoaded => {
          if (isLoaded) {
            this.initMap();
            this.subscribeToEvents();
          }
        });
    } else {
      this.initMap();
      this.subscribeToEvents();
    }
  }

  ngOnDestroy() {
    if (this.geocodeResultSub) {
      this.geocodeResultSub.unsubscribe();
    }

    if (this.waitForGScriptSub) {
      this.waitForGScriptSub.unsubscribe();
    }

    if (this.mapPointSub) {
      this.mapPointSub.unsubscribe();
    }
  }

  private initMap() {
    const properties = {
      center: new google.maps.LatLng(environment.config.location.mapCenter.lat, environment.config.location.mapCenter.lng),
      zoom: 8
    };

    this.map = new google.maps.Map(this.gMapElem.nativeElement, properties);

    this.map.addListener('click', (event) => {
      this.addMapMarker(event.latLng);
      this.gMapService.geocodeCoords(event.latLng);
    });
  }

  private addMapMarker(position: google.maps.LatLng) {
    if (this.currentMarker) {
      this.currentMarker.setMap(null);
    }

    this.currentMarker = new google.maps.Marker({
      map: this.map,
      position: position
    });
  }

  private subscribeToEvents() {
    this.geocodeResultSub = this.gMapService.geocodeResult
      .subscribe(
        result => {
          this.map.setCenter(result.geometry.location);
          this.map.setZoom(15);
          this.addMapMarker(result.geometry.location);
        }
      );

    this.mapPointSub = this.gMapService.mapPoint
      .subscribe(result => {
        this.map.setCenter(result);
        this.map.setZoom(15);
        this.addMapMarker(result);
      });
  }
}
