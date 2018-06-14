const Sequelize = require('sequelize');
const sequelize = require('./database');

const travels = sequelize.define('travels',{
  memberId:{
    type:Sequelize.INTEGER,
    allowNull:false,
  },
  title:{
    type: Sequelize.STRING,
    allowNull:false
  }
});

module.exports = travels;
