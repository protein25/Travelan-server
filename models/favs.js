const Sequelize = require('sequelize');
const sequelize = require('./database');
var members =require(./members);
var newspeed = require('./newspeed');

const  = sequelize.define('favs',{
  memberId:{
    type:Sequelize.INTAGER,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  newspeedId:{
    type:Sequelize.INTAGER,
    allowNull:false,
    references:{
      model:newspeed,
      key:'id'
    }
  }
});

module.exports = favs;
