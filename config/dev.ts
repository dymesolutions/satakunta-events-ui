export const devConfig = {
  apiKey: {
    LEAnonApiKey: '',
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
    // Center of Satakunta
    mapCenter: {
      lat: 61.593276, lng: 22.148308
    },
    // Satakunta bounds for geocoding:
    bounds: {
      southWest: {
        lat: 60.872, lng: 20.7732
      },
      northEast: {
        lat: 62.3113, lng: 23.0059
      }
    },
    region: 'FI'
  }
};
