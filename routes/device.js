const express = require('express');
const multer = require('multer');
const kakaoToken = require('../middlewares/kakaoToken');

const AWS = require('../utils/aws');

const Models = require('../models');

const { Devices, Members } = Models;
const Multer = multer();

const router = express.Router();

router.get('/', kakaoToken, (req, res, next) => {
  const { member } = req;

  Devices.findAll({
    where: {
      memberId: member.id,
    },
  })
  .then((devices) => {
    res.send(devices);
  })
  .catch(next);
});

router.post('/add', kakaoToken, (req, res, next) => {
  const { member } = req;
  const { mac } = req.body;

  Devices.count({
    where: {
      mac,
    },
  })
  .then((cnt) => {
    if (cnt > 0) {
      throw new Error('이미 등록된 기기 입니다.');
    }

    return Devices.create({
      memberId: member.id,
      mac,
      name: mac,
    });
  })
  .then((device) => {
    res.send(device);
  })
  .catch(next);
});

router.post('/:id([0-9]+)/addImage', kakaoToken, Multer.single('image'), (req, res, next) => {
  const { member, file } = req;
  const { id } = req.params;

  Devices.findOne({
    where: {
      id,
      memberId: member.id,
    },
  })
  .then((device) => {
    if (!device) throw new Error('NO DEVICE');

    return [
      device,
      AWS.s3Upload(file),
    ];
  })
  .spread((device, upload) => {
    const { serverName, originName } = upload;

    return device.update({ imageUrl: serverName + originName });
  })
  .then((update) => {
    res.send(update);
  })
  .catch(next);

});

router.post('/report/:mac', (req, res, next) => {
  const { mac } = req.params;
  const { lat, lng } = req.body;

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
