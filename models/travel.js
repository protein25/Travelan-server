const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');

const  = sequelize.define('travel',{
  memberId:{
    type:Sequelize.INTAGER
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
