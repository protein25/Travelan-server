const Promise = require('bluebird');
const express = require('express');
const Sequelize = require('sequelize');
const moment = require('moment');

const Plans = require('../models/plans');
const Travels = require('../models/travels');
const transportations = require('../models/transportations');
const attractions = require('../models/attractions');
const accommodates = require('../models/accommodates');

const kakaoToken = require('../middlewares/kakaoToken');

const GoogleApi = require('../utils/googleApi');

const router = express.Router();
const { Op } = Sequelize;

//사용자의 여행 일정 출력
router.get('/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)', kakaoToken, (req,res,next) => {
  const { member } = req;
  const { year, month, day } = req.params;

  Plans.findAll({
    where: {
      memberId: member.id,
      date: `${year}-${month}-${day}`,
    },
    order:[['order', 'asc']],
  })
  .then((plans) => Promise.map(plans, (plan) => {
    return Promise.resolve()
      .then(() => {
        if (plan.attributeType === 'accomodate') {
          return accommodates.findById(plan.attributeId);
        }
        if (plan.attributeType === 'attraction') {
          return attractions.findById(plan.attributeId);
        }
        if (plan.attributeType === 'transportation') {
          return transportations.findById(plan.attributeId);
        }
      })
      .then((attribute) => {
        const attributeObject = attribute.get({ plain: true });
        attributeObject.date = plan.date;
        attributeObject.order = plan.order;
        attributeObject.attributeType = plan.attributeType;
        attributeObject.travelId = plan.titleId;

        return attributeObject;
      });
  }))
  .then((result) => {
    res.send(result);
  })
  .catch(next);
});

//작성하기
router.post('/write', kakaoToken, (req,res,next) => {
  const { member } = req;

  const {
    sort, date, travelId, title, address, origin, originLat, originLng,
    destination, destinationLat, destinationLng, way, route, time, order,
    lat, lng, polyline,
  } = req.body;

  Promise.resolve()
    .then(() => {
      if (sort === 'accomodate') {
        return accommodates.create({
          title,
          address,
          coordinates: {
            type: 'Point',
            coordinates: [lng, lat]
          },
        });
      }
      if (sort === 'attraction') {
        return attractions.create({
          title,
          address,
          coordinates: {
            type: 'Point',
            coordinates: [lng, lat]
          },
        });
      }
      if (sort === 'transportation') {
        const polylineArray = JSON.parse(polyline);
        const polylineGeo = polylineArray.map((geo) => [geo.lng, geo.lat]);
        return transportations.create({
          origin,
          originCoordinates: {
            type: 'Point',
            coordinates: [originLng, originLat]
          },
          destination,
          destinationCoordinates: {
            type: 'Point',
            coordinates: [destinationLng, destinationLat],
          },
          way,
          route,
          polyline: {
            type: 'LineString',
            coordinates: polylineGeo,
          },
          time
        });
      }
    })
    .then((result) => {
      return Plans.create({
        date,
        order,
        memberId: member.id,
        titleId: travelId,
        attributeType: sort,
        attributeId: result.id,
      });
    })
    .then((result) => {
      res.send(result);
    })
    .catch(next);
});

router.get("/findLocation", (req, res, next) => {
  const { keyword } = req.query;

  GoogleApi.place(keyword)
    .then((results) => {
      res.send(results);
    })
    .catch(next);
});

router.get("/findRoute", (req, res, next) => {
  const { originLat, originLng, destinationLat, destinationLng } = req.query;

  GoogleApi.direction({ lat: originLat, lng: originLng }, { lat: destinationLat, lng: destinationLng })
    .then((results) => {
      res.send(results);
    })
    .catch(next);
})

module.exports = router;
