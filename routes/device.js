const express = require('express');
const kakaoToken = require('../middlewares/kakaoToken');

const Models = require('../models');

const { Devices, Members } = Models;

const router = express.Router();

router.get('/', kakaoToken, (req, res, next) => {
  Devices.findAll({

  })
});

router.post('/report/:mac', (req, res, next) => {
  const { mac } = req.params;
  const { lat, lng } = req.body;
console.log(lat, lng);
  const point = { type: 'Point', coordinates: [lng, lat]};

  Devices.findOne({
    where: {
      mac,
    },
  })
  .then((device) => {
    if (!device) throw new Error('NO DEVICE');

    return device.update({
      lastLocation: point,
    });
  })
  .then(() => {
    res.send({ result: 'success' });
  })
  .catch(next);
});

module.exports = router;
