const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');

const device = sequelize.define('device',{
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

module.exports = device;
