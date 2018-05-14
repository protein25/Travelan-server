const Sequelize = require('sequelize');
const sequelize = require('./database');

const members = sequelize.define('members', {
  id : {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.STRING
  },
  thumb: {
    type: Sequelize.STRING
  }
});

module.exports = members;
