export const prodConfig = {
  apiKey: {
    LEAnonApiKey: '',
    GMapApiKey: ''
  },
  url: {
    LEApiBaseUrl: '',
    GMapApiUrl: 'https://maps.googleapis.com/maps/api/js'
  },
  dataSource: {
    places: 'pori'
  },
  location: {
    // Center of Satakunta
    mapCenter: {
      lat: 61.485139,
      lng: 21.797418
    },
    // Satakunta bounds for geocoding:
    bounds: {
      southWest: {
        lat: 60.872,
        lng: 20.7732
      },
      northEast: {
        lat: 62.3113,
        lng: 23.0059
      },
      region: 'FI'
    }
  }
};
