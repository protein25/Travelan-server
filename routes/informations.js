var informations = require('../models/informations');
var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  informations.findAll()
    .then((result) => {
      res.send(result);
    }).catch(next);
});

router.get('/:keyword',function(req,res,next){
  var keyword = req.params.keyword;

  informations.findAll({
    where:{
      $or: [{
        countryName : {
          like : `%${keyword}%`
        }
      }, {
        content:{
          like : `%${keyword}%`,
        }
      },{
        title:{
          like : `%${keyword}%`,
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
