const Sequelize = require('sequelize');
const sequelize = require('./database');

const  = sequelize.define('newspeed',{
  memberId:{
    type:Sequelize.STRING
  },
  content:{
    type:Sequelize.TEXT
  },
  planId:{
    type:Sequelize.INTEGER
  }
});

module.exports = newspeed;
