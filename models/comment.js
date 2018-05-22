const Sequelize = require('sequelize');
const sequelize = require('./database');
var models = require('./members');
var newspeed = require('./newspeed');

const  = sequelize.define('comment',{
  memberId:{
    type:Sequelize.INTEGER,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  newspeedId:{
    type:Sequelize.INTEGER,
    allowNull:false,
    references:{
      model:newspeed,
      key:'id'
    }
  },
  content:{
    type:Sequelize.TEXT,
    allowNull:false
  }
});

module.exports = comment;
