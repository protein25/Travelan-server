const Sequelize = require('sequelize');
const sequelize = require('./database');

const transportations = sequelize.define('transportations',{
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

module.exports = transportations;
