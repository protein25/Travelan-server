const Sequelize = require('sequelize');
const sequelize = require('./database');

const attractions = sequelize.define('attractions',{
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

module.exports = attractions;
