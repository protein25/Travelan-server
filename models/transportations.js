const Sequelize = require('sequelize');
const sequelize = require('./database');

const transportations = sequelize.define('transportations',{
  origin: {
    type:Sequelize.STRING
  },
  originCoordinates: {
    type: Sequelize.GEOMETRY('POINT'),
  },
  destination: {
    type:Sequelize.STRING
  },
  destinationCoordinates: {
    type: Sequelize.GEOMETRY('POINT'),
  },
  time: {
    type:Sequelize.STRING
  },
  route: {
    type:Sequelize.TEXT
  },
  polyline: {
    type: Sequelize.GEOMETRY('LINESTRING'),
  },
});

module.exports = transportations;
