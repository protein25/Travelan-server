const request = require('request-promise');

const API_KEY = "AIzaSyDO0YHiLhFjXdsHJsVfV9lNrGxSwLRW55I"
const API_HOST = "https://maps.googleapis.com/maps/api";

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
  }
};
