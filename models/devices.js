const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');

const devices = sequelize.define('devices',{
  memberId:{
    type:Sequelize.INTEGER,
    references:{
      model:members,
      key:'id'
    }
  },
  deviceId:{
    type:Sequelize.STRING
  },
  lastLocation:{
    type:Sequelize.STRING
  }
});

module.exports = devices;
