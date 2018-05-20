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
  route:{
    type:Sequelize.TEXT
  }
});

module.exports = transportation;
