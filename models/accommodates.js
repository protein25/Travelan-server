const Sequelize = require('sequelize');
const sequelize = require('./database');

const accommodates = sequelize.define('accommodates',{
  title:{
    type:Sequelize.STRING
  },
  address:{
    type:Sequelize.STRING
  },
  coordinates: {
    type:Sequelize.GEOMETRY('POINT'),
  }
});

module.exports = accommodates;
