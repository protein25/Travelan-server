const request = require('request-promise');
const members = require('../models/members');

const HOST = 'https://kapi.kakao.com';
const apiUrl = '/v1/user/access_token_info';

module.exports = (req, res, next) => {
  const accessToken = req.get('accessToken');

  const options = {
    uri: `${HOST}${apiUrl}`,
    headers: {
      Bearer: accessToken
    },
    json: true,
  };

  request(options)
    .then((result) => members.findOne({
      where: {
        kakaoId: result.id,
      },
    }))
    .then((member) => {
      req.member = member;
      next();
    })
    .catch(next);
}
