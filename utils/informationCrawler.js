const request = require('request-promise');
const xmlParser = require('./xmlParser');

const serviceUrl = 'http://apis.data.go.kr/1262000/CountrySafetyService/getCountrySafetyList';
const serviceKey = 'De8CvmhhCiN4hcz/qlJZ5wHLT09jYgYcPPl2Gg531adYXQ7vF+gFmUb1127SPZ0E0XskFTEDAjcnednuJJ3URw==';
const numOfRows = 10;

module.exports = (pageNo = 1) => {
  const options = {
    uri: serviceUrl,
    qs: {
      serviceKey,
      numOfRows,
      pageNo,
    },
  };

  return request(options)
    .then(xmlParser);
}
