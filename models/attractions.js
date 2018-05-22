const Sequelize = require('sequelize');
const sequelize = require('./database');

const attraction = sequelize.define('attraction',{
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

module.exports = attraction;
