const express = require('express');
const Promise = require('bluebird');
const Sequelize = require('sequelize');
const multer = require('multer');
const Op = Sequelize.Op;

const Models = require('../models');
const { Newspeeds, Images, Travels, Plans, Favs } = Models;

const kakaoToken = require('../middlewares/kakaoToken');
const AWS = require('../utils/aws');

const router = express.Router();
const Multer = multer();

//모든 게시글 출력
router.get('/', kakaoToken, (req, res, next) => {
  const { member } = req;
  const { mypage } = req.query;

  const pageCount = 10;
  const page = req.query.page || 0;

  Newspeeds.scope('addImage', 'addMember', 'addTravel')
    .findAll({
      include: [{
        model: Favs,
        where: {
          memberId: member.id,
        },
        required: mypage ? true : false,
      }],
      offset: page * pageCount,
      limit: pageCount,
      order: [['id', 'desc']],
    })
    .then((newspeeds) => {
      res.send(newspeeds.map((newspeed) => {
        const result = newspeed.get({ plain: true });
        const isFav = result.favs.length > 0 ? true : false;
        result.isFav = isFav;

        return result;
      }));
    })
    .catch(next);
});

router.post('/', Multer.array("images"), kakaoToken, (req, res, next) => {
  const { member, files } = req;
  const { content, travelId } = req.body;

  Promise.map(files, (file) => AWS.s3Upload(file))
    .then((uploads) => {
      return Newspeeds.create({
        memberId: member.id,
        content,
        travelId,
        state: true,
      })
      .then((newspeed) => {
        const images = uploads.map((upload) => {
          upload.newspeedId = newspeed.id;
          return upload;
        });

        return Images.bulkCreate(images);
      });
    })
    .then(() => {
      res.send({ result: 'success' });
    })
    .catch(next);
});

//게시글ID로 게시글 검색하기
router.get('/search', (req,res,next) => {
  const keyword = req.query.keyword;
  const search =  `%${keyword}%`;

  Promise.all([
    Newspeeds.scope('addImage').findAll({
      where: {
        content: {
          [Op.like]: search,
        }
      },
      order: [['createdAt', 'desc']],
    }),
    Travels.findAll({
      attributes: ['id'],
      where: {
        title: {
          [Op.like]: search,
        },
      },
    })
    .then((results) => {
      const travelIds = results.map((travel) => travel.id);
      return Newspeeds.scope('addImage').findAll({
        include: [{
          model: Plans,
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
router.get('/showPlan/:id([0-9]+)', (req,res,next) => {
  var titleId = req.params.id;

  Plans.findAll({
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
router.post('/addFav', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { newspeedId } = req.body;

  Favs.create({
    memberId: member.id,
    newspeedId,
  }).then((result) => {
    res.send(result);
  }).catch(next);
});

//즐겨찾기 삭제하기
router.post('/delFav', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { newspeedId } = req.body;

  Favs.destroy({
    where:{
      memberId: member.id,
      newspeedId,
    },
  })
  .then(() => {
    res.send({ result: 'success' });
  })
  .catch(next)
});

//내가 쓴 newspeed 삭제하기 state:1->true, 0->false
router.post('/delete', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { newspeedId } = req.body;

  Newspeeds.findById(newspeedId)
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

  Newspeeds.findById(newspeedId)
    .then((result) => {
      if (result.memberId !== member.id) {
        throw new Error('본인이 작성한 글만 수정할 수 있습니다.');
      }

      return result.update({ content });
    })
    .then(() => {
      res.send('success');
    })
    .catch(next);
});

module.exports = router;
