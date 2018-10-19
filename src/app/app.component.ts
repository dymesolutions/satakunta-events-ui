import { Component, NgZone, OnInit } from '@angular/core';
import { GmapService } from '@app/services/gmap.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Satakunta Events';

  constructor(private gMapService: GmapService, translate: TranslateService, private zone: NgZone) {
    translate.setDefaultLang('fi');
    translate.use('fi');
  }

  ngOnInit() {
    // Register initMap globally so Google Maps callback can access it. Init script can be found in
    // index.html <head> tag.
    (<any>window).angularComponentRef = {
      zone: this.zone,
      componentFn: () => this.initMap(),
      component: this
    };

    this.injectInitMapScript();
    this.injectMapScript();
  }

  private injectInitMapScript() {
    const existingScriptElement = document.getElementById('initMapScript');

    if (existingScriptElement === null) {
      const scriptElement = document.createElement('script');
      scriptElement.id = 'initMapScript';
      scriptElement.innerHTML =
        `function initMap() {
        window.angularComponentRef.zone.run(function () {
          window.angularComponentRef.component.initMap();
        });
      };
      console.log(window.angularComponentRef)`;
      document.getElementsByTagName('body')[0].appendChild(scriptElement);
    }
  }

  /**
   * Inject Google Maps Script tag to head element
   */
  private injectMapScript() {
    const existingScriptElement = document.getElementById('gMapScript');

    if (existingScriptElement === null) {
      const scriptElement = document.createElement('script');
      scriptElement.src = `${environment.config.url.GMapApiUrl}?key=${environment.config.apiKey.GMapApiKey}&callback=initMap`;
      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.id = 'gMapScript';

      document.getElementsByTagName('body')[0].appendChild(scriptElement);
    }
  }

  private initMap() {
    console.log('Initalizing Google Map');

    // Need to call service init here so our components can wait for the script tag to load.
    this.gMapService.initService();
  }
}
