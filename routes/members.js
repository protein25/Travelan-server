const express = require('express');
const members = require('../models/members');
const kakaoToken = require('../middlewares/kakaoToken');
const kakaoApi = require('../utils/kakaoApi');
const router = express.Router();

router.get('/', (req, res, next) => {
  members.findAll()
    .then((result) => {
      res.send(result);
    });

    // [
    //   {
    //       "id": 1,
    //       "password": "tkddms5805",
    //       "name": "상은",
    //       "userId": "tkddms1015",
    //       "thumb": "sdfasg",
    //       "createdAt": "2018-05-14T00:00:00.000Z",
    //       "updatedAt": "2018-05-14T00:00:00.000Z"
    //   },
    //   {
    //       "id": 2,
    //       "password": "choi0245",
    //       "name": "kyubum",
    //       "userId": "kyubum",
    //       "thumb": "dkstkddmsWKd",
    //       "createdAt": "2018-05-14T13:19:54.000Z",
    //       "updatedAt": "2018-05-14T13:19:54.000Z"
    //   }
    // ]
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
