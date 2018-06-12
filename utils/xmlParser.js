// Promisify library
const Promise = require('bluebird');
const parseString = require('xml2js').parseString;

module.exports = (xmlString) => new Promise((resolve, reject) => {
  parseString(xmlString, { trim: true }, (err, result) => {
    if (err) {
      reject(err);
      return;
    }

    if (!result.response || !result.response.body) {
      reject(new Error('RESULT ERROR'));
      return;
    }

    resolve(result.response.body[0].items[0].item);
  });
});
