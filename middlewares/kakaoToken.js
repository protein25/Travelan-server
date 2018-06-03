const kakaoApi = require('../utils/kakaoApi');
const members = require('../models/members');

const HOST = 'https://kapi.kakao.com';
const apiUrl = '/v1/user/access_token_info';

module.exports = (req, res, next) => {
  const accessToken = req.get('access-token');

  kakaoApi.accessToken(accessToken)
    .then((result) => members.findOne({
      where: {
        kakaoId: result.id,
      },
    }))
    .then((member) => {
      if (!member) {
        const loginError = new Error("LOGIN FAIL");
        loginError.status = 401;

        next(loginError);
      }

      req.member = member;
      next();
    })
    .catch(next);
}
