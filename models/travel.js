const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');

const travel = sequelize.define('travel',{
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

module.exports = travel;
