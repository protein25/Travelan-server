const Sequelize = require('sequelize');
const sequelize = require('./database');

const members = sequelize.define('members', {
  id : {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  kakaoId: {
    type: Sequelize.INTEGER,
  },
  userId: {
    type: Sequelize.STRING,
    unique:true,
    allowNull:false
  },
  name: {
    type: Sequelize.STRING,
    allowNull:false
  },
  thumb: {
    type: Sequelize.STRING
  }
});

module.exports = members;
