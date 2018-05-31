const express = require('express');
const Promise = require('bluebird');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const newspeeds = require('../models/newspeeds');
const travels = require('../models/travels');
const plans = require('../models/plans');
const favs = require('../models/favs');
const images = require('../models/images');

const kakaoToken = require('../middlewares/kakaoToken');

const router = express.Router();

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
  const keyword = req.query.keyword;
  const search =  `%${keyword}%`;

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
router.post('/addFavs', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { newspeedId } = req.body;

  favs.create({
    memberId: member.id,
    newspeedId: newspeedId
  }).then((result) => {
    res.send(result);
  }).catch(next);
});

//즐겨찾기 삭제하기
router.post('/delFavs', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { newspeedId } = req.body;

  favs.destroy({
    where:{
      memberId: member.id,
      newspeedId,
    },
  })
  .then(() => {
    res.send('success');
  })
  .catch(next)
  });

//newsfeed 작성하기
//imageUrl 수정하기
router.post('/write', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { content, planId, imageUrl } = req.body;

  newspeeds.create({
    memberId: member.id,
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
router.post('/delete', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { newspeedId } = req.body;

  newspeeds.findById(newspeedId)
    .then((result) => {
      if (result.memberId !== member.id) {
        throw new Error('본인이 작성한 글만 삭제할 수 있습니다.');
      }

      return result.update({ state: 0 });
    })
    .then(() => {
      res.send('success');
    })
    .catch(next);
});


//내가 쓴 NEWSPEED 수정하기
router.post('/edit', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { newspeedId , content } = req.body;


  newspeeds.findById(newspeedId)
    .then((result) => {
      if (result.memberId !== member.id) {
        throw new Error('본인지 작성한 글만 수정할 수 있습니다.');
      }

      return result.update({ content });
    })
    .then(() => {
      res.send('success');
    })
    .catch(next);
});

module.exports = router;
