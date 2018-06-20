const request = require('request-promise');

const API_KEY = "AIzaSyDO0YHiLhFjXdsHJsVfV9lNrGxSwLRW55I"
const API_HOST = "https://maps.googleapis.com/maps/api";

function decode(encoded){
  // source: http://doublespringlabs.blogspot.com.br/2012/11/decoding-polylines-from-google-maps.html
  // array that holds the points
  var points=[ ]
  var index = 0, len = encoded.length;
  var lat = 0, lng = 0;
  while (index < len) {
    var b, shift = 0, result = 0;

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);


    var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    points.push([lng / 1E5, lat / 1E5]);
  }

  return points;
}

const get = (apiUrl, params) => {
  const qs = {
    key: API_KEY,
    language: 'ko',
  };

  const keys = Object.keys(params);
  for(var i in keys) {
    qs[keys[i]] = params[keys[i]];
  }

  const options = {
    uri: `${API_HOST}${apiUrl}`,
    json: true,
    qs,
  };

  return request(options);
};

module.exports = {
  geocode(address) {
    const apiUrl = "/geocode/json";

    const params = {
      address,
    };

    return get(apiUrl, params)
      .then(({ results }) => results.map((result) => {
        const { formatted_address, geometry } = result;

        return {
          address: formatted_address,
          coordinates: geometry.location,
        };
      }));
  },
  place(place) {
    const apiUrl = "/place/textsearch/json";

    const params = {
      query: place,
    };

    return get(apiUrl, params)
      .then(({ results }) => results.map((result) => {
        const { formatted_address, geometry, name } = result;

        return {
          address: formatted_address,
          poi: name,
          coordinates: geometry.location,
        };
      }));
  },
  direction(origin, destination) {
    const apiUrl = "/directions/json";
    const params = {
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      mode: 'transit',
    };

    return get(apiUrl, params)
      .then(({ routes }) => {
        if (!routes || routes.length === 0) {
          throw new Error('NO_DATA');
        }

        const { legs, overview_polyline, bounds } = routes[0];

        const { steps, start_address, start_location, end_address, end_location } = legs[0];

        const summaries = steps.map(({ html_instructions, transit_details }) => {
          if (!transit_details) {
            return html_instructions;
          }

          const { departure_stop, arrival_stop, headsign, line } = transit_details;

          return `${line.name} ${line.short_name} ${departure_stop.name} 승차, ${headsign} 방향 이동, ${arrival_stop.name} 하차`;
        });

        return {
          bounds,
          start_address,
          start_location,
          end_address,
          end_location,
          summary: summaries.join(' -> '),
          points: decode(overview_polyline.points),
        };
      });
  }
};
