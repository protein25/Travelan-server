const Sequelize = require('sequelize');

var plans = require('../models/plans');
var transportations = require('../models/transportations');
var attractions = require('../models/attractions');
var accommodates = require('../models/accommodates');

var express = require('express');
var router = express.Router();

//사용자의 여행 일정 출력
router.get('/:id[0-9]',function(req,res,next){
  var memberId = req.params.id;

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
router.get('/:id[0-9]/dates', function(req, res, next) {
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
router.post('/write',function(req,res,next){
  var sort = req.body.sort;
  var memberId = req.body.memberId;
  var date = req.body.date;

  var titleId = req.body.titleId;
  var title = req.body.title;
  var address = req.body.address;
  var tel = req.body.tel;

  var origin = req.body.origin;
  var destination = req.body.destination;
  var way = req.body.way;
  var route = req.body.route;
  var time = req.body.time;

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
        return accommodates.create({
          title,
          address,
          tel
        });
      }
      if (sort === 'transportations') {
        return accommodates.create({
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
        memberId,
        titleId: result.id,
        attributeType: sort,
        attributeId: result.id,
      });
    })
    .catch(next);
});

module.exports = router;
