const Sequelize = require('sequelize');
const sequelize = require('./database');

const attractions = sequelize.define('attractions',{
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

module.exports = attractions;
