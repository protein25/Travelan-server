var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var informations = require('../models/informations');

router.get('/', (req, res, next) => {
  informations.findAll()
    .then((result) => {
      res.send(result);
    }).catch(next);
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
