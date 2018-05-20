const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');

const  = sequelize.define('plan',{
  memberId:{
    type:Sequelize.STRING,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  titleId:{
    type: Sequelize.INTAGER,
    allowNull:false
  },
  date:{
    type: Sequelize.DATE
  },
  attribeteType:{
    type:Sequelize.INTAGER,
    allowNull:false
  },
  attributeId:{
    type: Sequelize.INTAGER
  },
  order:{
    type: Sequelize.INTAGER
  }
});

module.exports = plan;
