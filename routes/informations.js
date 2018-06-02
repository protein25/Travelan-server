var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var informations = require('../models/informations');

router.get('/', (req, res, next) => {
  const page = req.query.page || 0;
  const pageCount = 10;

  informations.findAll({
    offset: page,
    limit: pageCount,
  })
  .then((result) => {
    return result.map((item) => {
      const { id, title, countryName, countryEnName, content, wrtDt, flagImage } = item;

      return {
        id, title, countryName, countryEnName, content, wrtDt,
        flagImage: `http://${req.get('host')}/images/flags/${flagImage}`,
      };
    });
  })
  .then((result) => {
    res.send(result);
  })
  .catch(next);
});

router.get('/:keyword', (req,res,next) => {
  var keyword = req.params.keyword;

  informations.findAll({
    where:{
      [Op.or]: [{
        countryName : {
          [Op.like] : `%${keyword}%`
        }
      }, {
        content:{
          [Op.like] : `%${keyword}%`,
        }
      },{
        title:{
          [Op.like] : `%${keyword}%`,
        }
      }]
    },
  }).then(function(result){
    if (!result) {
      throw Error('NO_RESULT');
      res.send(result);
    }
  }).catch(next);
});

module.exports = router;
