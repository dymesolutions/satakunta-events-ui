# Satakunta Events UI

This is a user interface for [Satakunta Events](https://satakuntaevents.fi) open event API built with Angular.

## Requirements

* Node v8.10

## Configuring

Navigate to config folder where you'll find configuration files for both development and production environments.

```
export const devConfig = {
  apiKey: {
    GMapApiKey: ''
  },
  url: {
    LEApiBaseUrl: 'http://localhost:8080/api/v2/',
    GMapApiUrl: 'https://maps.googleapis.com/maps/api/js'
  },
  dataSource: {
    places: 'pori'
  },
  location: {
    mapCenter: {
      lat: 61.593276, lng: 22.148308
    }
  }
};
```

- Satakunta Events requires a Google Maps API key for the  *GMapApiKey*
- The *dataSource.places* is needed for fetching presaved locations (i.e. datasource for places).

## Building

* `npm install`
* `npm start` - start the development server (Angular)
* `npm build` - Builds production files to *dist* folder

---

Copyright (c) 2018 Dyme Solutions Oy

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
