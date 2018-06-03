const request = require('request-promise');

const HOST = 'https://kapi.kakao.com';
const apiUrl = '/v1/user/access_token_info';

module.exports = {
  accessToken: (accessToken) => {
    const options = {
      uri: `${HOST}${apiUrl}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: true,
    };

    return request(options);
  },
}
