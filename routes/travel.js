const express = require('express');
const Sequelize = require('sequelize');
const moment = require('moment');

const Plans = require('../models/plans');
const Travels = require('../models/travels');
const transportations = require('../models/transportations');
const attractions = require('../models/attractions');
const accommodates = require('../models/accommodates');

const kakaoToken = require('../middlewares/kakaoToken');

const router = express.Router();
const { Op } = Sequelize;

//사용자의 여행 일정 출력
router.get('/:year([0-9]+)/:month([0-9]+)', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { year, month } = req.params;

  const minDate = moment().set({ year, month: parseInt(month), date: 1 }).format('YYYY-MM-DD');
  const maxDate = moment(minDate).add({ month: 1 }).subtract({ day: 1 }).format('YYYY-MM-DD');

  Travels.findAll({
    where: {
      memberId: member.id,
    },
    include: [{
      model: Plans,
      where: {
        date: {
          [Op.gte]: minDate,
          [Op.lte]: maxDate,
        },
      },
      required: true,
    }],
  })
  .then((travels) => travels.map((travel) => {
    const { id, title, plans } = travel;
    const dates = {};

    for(var i in plans) {
      dates[plans[i].date.valueOf().toString()] = true;
    }

    return ({ id, title, dates: Object.keys(dates) });
  }))
  .then((results) => {
    res.send(results);
  })
  .catch(next);
});

router.post('/', kakaoToken, (req, res, next) => {
  const { member } = req;
  const { title } = req.body;

  Travels.create({
    title,
    memberId: member.id,
  })
  .then((travel) => {
    res.send(travel);
  })
  .catch(next);
});

module.exports = router;
