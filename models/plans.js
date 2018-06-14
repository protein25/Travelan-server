const Sequelize = require('sequelize');
const sequelize = require('./database');

const plans = sequelize.define('plans',{
  memberId:{
    type:Sequelize.STRING,
    allowNull:false,
  },
  titleId:{
    type: Sequelize.INTEGER,
    allowNull:false
  },
  date:{
    type: Sequelize.DATE,
  },
  attributeType:{
    type:Sequelize.ENUM(['accomodate','attraction','transportation']),
    allowNull:false
  },
  attributeId:{
    type: Sequelize.INTEGER,
  },
  order:{
    type: Sequelize.DOUBLE,
  },
});

module.exports = plans;
