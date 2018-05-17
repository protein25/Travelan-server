const Sequelize = require('sequelize');
const sequelize = require('./database');

const  = sequelize.define('attraction',{
  title:{
    type:Sequelize.STRING
  },
  address:{
    type:Sequelize.STRING
  },
  tel:{
    type:Sequelize.STRING
  },
  planId:{
    type:Sequelize.INTEGER
  }
});

module.exports = attraction;
