const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');

const newspeed = sequelize.define('newspeed',{
  memberId:{
    type:Sequelize.STRING,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  content:{
    type:Sequelize.TEXT
  },
  planId:{
    type:Sequelize.INTEGER
  }
});

module.exports = newspeed;
