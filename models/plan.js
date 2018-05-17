const Sequelize = require('sequelize');
const sequelize = require('./database');

const  = sequelize.define('plan',{
  memberId:{
    type:Sequelize.STRING
  },
  location:{
    type: Sequelize.STRING
  },
  date:{
    type: Sequelize.DATE
  }
});

module.exports = plan;
