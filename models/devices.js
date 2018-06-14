const Sequelize = require('sequelize');
const sequelize = require('./database');

const devices = sequelize.define('devices',{
  memberId:{
    type:Sequelize.INTEGER
  },
  mac:{
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
  },
  imageUrl: {
    type: Sequelize.STRING,
  },
  isReported: {
    type: Sequelize.BOOLEAN,
  },
  lastLocation:{
    type:Sequelize.GEOMETRY('POINT'),
  }
});

module.exports = devices;
