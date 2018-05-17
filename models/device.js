const Sequelize = require('sequelize');
const sequelize = require('./database');

const  = sequelize.define('device',{
  memberId:{
    type:Sequelize.STRING
  },
  deviceId:{
    type:Sequelize.STRING
  },
  lastLocation:{
    type:Sequelize.STRING
  }
});

module.exports = device;
