const Sequelize = require('sequelize');
const sequelize = require('./database');

const  = sequelize.define('transportation',{
  origin:{
    type:Sequelize.STRING
  },
  destination:{
    type:Sequelize.STRING
  },
  way:{
    type:Sequelize.STRING
  },
  time:{
    type:Sequelize.STRING
  },
  planId:{
    type:Sequelize.INTEGER
  }
});

module.exports = transportation;
