export default{

    state: {
        collapsed: {
            names: false,
            namesSent: false,
            namesReceived: false,
            namesSentAll: false,
            namesReceivedAll: false,
            namesAllAll: true,
            occupations: false,
            occupationsAll: false,
            dates: false,
            datesAll: true,
            placesAllAll: false,
            placesSentAll: false,
            placesReceivedAll: false,
            editionAll: false,
            cmifAll: false,
            datasets:false,
            datasetsAll: false,
            languages:false,
            languagesAll: false,
            gender: false,
            places: false,
            placesSent: false,
            placesReceived: false,
            edition: false,
            cmif: false,
            year: false,
            availability: false,
          },
          sort: {
            names: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            namesSent: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            namesReceived: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            occupations: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            dates: {
              alpha: {
                asc: true,
                active: true,
              },
              numeric: {
                asc: true,
                active: false,
              },
            },
            places: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            placesSent: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            placesReceived: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            edition: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            cmif: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            datasets: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            },
            languages: {
              alpha: {
                asc: true,
                active: false,
              },
              numeric: {
                asc: false,
                active: true,
              },
            }
          }
    }
    
}