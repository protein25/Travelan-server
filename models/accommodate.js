const Sequelize = require('sequelize');
const sequelize = require('./database');

const accommodate = sequelize.define('accommodate',{
  title:{
    type:Sequelize.STRING
  },
  address:{
    type:Sequelize.STRING
  },
  tel:{
    type:Sequelize.STRING
  }
});

module.exports = accommodate;
