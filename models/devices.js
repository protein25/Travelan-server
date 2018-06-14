const Sequelize = require('sequelize');
const sequelize = require('./database');

const devices = sequelize.define('devices',{
  memberId:{
    type:Sequelize.INTEGER
  },
  mac:{
    type:Sequelize.STRING
  },
  lastLocation:{
    type:Sequelize.GEOMETRY('POINT'),
  }
});

module.exports = devices;
