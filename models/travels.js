const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');

const travels = sequelize.define('travels',{
  memberId:{
    type:Sequelize.INTEGER,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  title:{
    type: Sequelize.STRING,
    allowNull:false
  }
});

module.exports = travels;
