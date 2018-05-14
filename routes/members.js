var members = require('../models/members');
var express = require('express');
var router = express.Router();

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

router.get('/:id([0-9])', function(req,res,next){
  var id = req.params.id;

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

router.post('/login',function(req,res,next){
  var userId = req.body.userId;
  var password = req.body.password;

  members.findOne({
    where: {
      userId : userId,
      password : password
    },
    limit: 1,
    order: [['id', 'desc']],
  })
    .then(function(result) {
      if (!result) throw Error('NO_MEMBER');

      res.send(result);
    })
    .catch(next);
});

router.post('/join', function(req, res, next) {
  var userId = req.body.userId;
  var password = req.body.password;
  var name = req.body.name;
  var thumb = req.body.thumb;

  members.create({
    userId : userId,
    password : password,
    name : name,
    thumb : thumb
  })
  .then((result) => {
    res.send(result);
  })
  .catch(next);
});

router.get('/test', (req, res, next) => {
  res.send('test 2');
});

module.exports = router;
