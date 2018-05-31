const express = require('express');
const Sequelize = require('sequelize');

const plans = require('../models/plans');
const transportations = require('../models/transportations');
const attractions = require('../models/attractions');
const accommodates = require('../models/accommodates');

const kakaoToken = require('../middlewares/kakaoToken');

const router = express.Router();

//사용자의 여행 일정 출력
router.get('/:id[0-9]', (req,res,next) => {
  const memberId = req.params.id;

  plans.findAll({
    where:{
      memberId
    },
    order:[['date','desc']],
  })
  .then((result)=>{
    res.send(result);
  })
  .catch(next);
});

//travel별 date뽑기
router.get('/:id[0-9]/dates', (req, res, next) => {
  const titleId = req.params.id;

  plans.findAll({
    attributes: [[Sequelize.fn('distinct', Sequelize.col('date')), 'date']],
    where:{
      titleId,
    }
  })
  .then((results) => results.map((result) => { // [{date: '2018-01-01'}, {date: '2018-01-02'}]
    return result.date;
  }))
  .then((dates) => { // ['2018-01-01', '2018-01-02']
    res.send(dates);
  })
  .catch(next);
});

//travel별 date별 일정 뽑기
router.get('/:id[0-9]/:date',function(req,res,next){
  var titleId = req.params.id;
  var date = req.params.date;

  plan.findAll({
    where:{
      titleId,
      date
    },
    order:[['order','asc']],
  })
  .then(() => {
    if(!result) throw Error('NO_DATA');
    res.send(result);
  })
  .catch(next);
});

//작성하기
router.post('/write', kakaoToken, (req,res,next) => {
  const { member } = req;

  const {
    sort, date, titleId, title, address, tel, origin,
    destination, way, route, time,
  } = req.body;

  Promise.resolve()
    .then(() => {
      if (sort === 'accommodate') {
        return accommodates.create({
          title,
          address,
          tel
        });
      }
      if (sort === 'attraction') {
        return attractions.create({
          title,
          address,
          tel
        });
      }
      if (sort === 'transportation') {
        return transportations.create({
          origin,
          destination,
          way,
          route,
          time
        });
      }
    })
    .then((result) => {
      return plan.create({
        date,
        member.id,
        titleId: result.id,
        attributeType: sort,
        attributeId: result.id,
      });
    })
    .catch(next);
});

module.exports = router;
