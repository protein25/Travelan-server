const Promise = require('bluebird');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var newspeeds = require('../models/newspeeds');
var travels = require('../models/travels');
var plans = require('../models/plans');
var favs = require('../models/favs');
var images = require('../models/images');

var express = require('express');
var router = express.Router();

//모든 게시글 출력
router.get('/', (req, res, next) => {
  newspeeds.scope('addImage')
    .findAll()
    .then((result) => {
      if (!result) throw Error('NO DATA');
      res.send(result);
    })
    .catch(next);
});

//게시글ID로 게시글 검색하기
router.get('/search', (req,res,next) => {
  var keyword = req.query.keyword;
  var search =  `%${keyword}%`;

  Promise.all([
    newspeeds.scope('addImage').findAll({
      where: {
        content: {
          [Op.like]: search,
        }
      },
      order: [['createdAt', 'desc']],
    }),
    travels.findAll({
      attributes: ['id'],
      where: {
        title: {
          [Op.like]: search,
        },
      },
    })
    .then((results) => {
      const travelIds = results.map((travel) => travel.id);
      return newspeeds.scope('addImage').findAll({
        include: [{
          model: plans,
          where: {
            titleId: {
              [Op.in]: travelIds,
            },
          },
          required: true,
        }],
      });
    }),
  ])
  .spread((searchByContent, searchByTravel) => {
    const mergedResult = [];
    let contentShift;
    let travelShift;

    while(searchByContent.length > 0 || searchByTravel.length > 0) {
      if (!contentShift && searchByContent.length > 0) {
        contentShift = searchByContent.shift();
      }
      if (!travelShift && searchByTravel.length > 0) {
        travelShift = searchByTravel.shift();
      }

      if (!travelShift || (contentShift && new Date(contentShift.createdAt) > new Date(travelShift.createdAt))) {
        mergedResult.push(contentShift);
        contentShift = null;
      } else if (travelShift){
        mergedResult.push(travelShift);
        travelShift = null;
      }
    }

    return mergedResult;
  })
  .then((result) => {
    if (!result) throw Error('NO_RESULT');

    res.send(result);
  })
  .catch(next);
});

//게시글에 연관된 여행일정 출력하기
router.get('/showPlan/:id([0-9])', (req,res,next) => {
  var titleId = req.params.id;

  plans.findAll({
    where:{
      titleId,
    }
  })
  .then((result) => {
    if (!result) throw Error('NO DATA');

    res.send(result);
  }).catch(next);
});

//즐겨찾기 추가하기
router.post('/addFavs', (req,res,next) => {
  var memberId = req.body.memberId;
  var newspeedId = req.body.newspeedId;

  favs.create({
    memberId: memberId,
    newspeedId: newspeedId
  }).then((result) => {
    res.send(result);
  }).catch(next);
});

//즐겨찾기 삭제하기
router.post('/delFavs', (req,res,next) => {
  var newspeedId = req.body.newspeedId;

  favs.destroy({
    where:{
      newspeedId
    }
  })
.then(() => {
  res.send('success');
})
.catch(next)
});

//newsfeed 작성하기
//imageUrl 수정하기
router.post('/write', (req,res,next) => {
  var memberId = req.body.memberId;
  var content = req.body.content;
  var planId = req.body.planId;
  var imageUrl = req.body.imageUrl;

  newspeeds.create({
    memberId,
    content,
    planId,
    state: true,
  })
  .then((result) => {
    return images.create({
      newspeedId: result.id,
      originName: imageUrl,
      serverName: 'dummydata'
    });
  })
  .then(() => {
    res.send('success');
  })
  .catch(next);
});

//내가 쓴 newspeed 삭제하기 state:1->true, 0->false
router.post('/delete', (req,res,next) => {
  var newspeedId = req.body.newspeedId;

  newspeeds.update({
    state: 0
  }, {
    where: {
      id: newspeedId,
    },
  }).then(() => {
    res.send('success');
  })
  .catch(next);
});


//내가 쓴 NEWSPEED 수정하기
router.post('/edit', (req,res,next) => {
  var newspeedId = req.body.newspeedId;
  var content = req.bodt.content;

  newspeeds.update({
    content,
  }, {
    where:{
      id: newspeedId
    }
  })
  .then(() => {
    res.send('success');
  })
  .catch(next);
});

module.exports = router;
