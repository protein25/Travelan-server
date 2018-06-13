const express = require('express');
const members = require('../models/members');
const kakaoToken = require('../middlewares/kakaoToken');
const kakaoApi = require('../utils/kakaoApi');
const router = express.Router();

router.get('/', kakaoToken, (req, res, next) => {
  res.send(req.member);
});

router.get('/:id([0-9]+)', function(req,res,next){
  const id = req.params.id;

  members.findOne({
    where: {
      id: id
    }
  })
  .then(function(result) {
    if (!result) throw Error('NO_MEMBER');

    res.send(result);
  })
  .catch(next);
});

router.post('/login', kakaoToken, (req, res) => {
  const { member } = req;

  res.send(member);
});

router.post('/join', (req, res, next) => {
  const accessToken = req.get('access-token');
  const { userId, name, thumb, age, sex, emergency } = req.body;

  const ageDate = `${age.slice(0, 4)}-${age.slice(4, 6)}-${age.slice(6, 8)}`;
  kakaoApi.accessToken(accessToken)
    .then((kakao) => members.create({
      userId,
      kakaoId: kakao.id,
      name,
      thumb,
      age: ageDate,
      sex,
      emergency
    }))
    .then((result) => {
      res.send(result);
    })
    .catch(next);
});

module.exports = router;
