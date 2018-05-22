const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');
var travel = require('./travel');

const plan = sequelize.define('plan',{
  memberId:{
    type:Sequelize.STRING,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  titleId:{
    type: Sequelize.INTEGER,
    allowNull:false
  },
  date:{
    type: Sequelize.DATE
  },
  attribeteType:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  attributeId:{
    type: Sequelize.INTEGER
  },
  order:{
    type: Sequelize.INTEGER
  }
});

plan.belongsTo(travel);

module.exports = plan;
