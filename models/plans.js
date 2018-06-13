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

travels.hasMany(plans, { foreignKey: 'titleId' });
plans.belongsTo(travels, { foreignKey: 'titleId' });

module.exports = plans;
