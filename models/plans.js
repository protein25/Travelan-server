const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');
var travels = require('./travels');

const plans = sequelize.define('plans',{
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
  attributeType:{
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

plans.belongsTo(travels, { foreignKey: 'titleId' });

module.exports = plans;
