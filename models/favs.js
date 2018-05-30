const Sequelize = require('sequelize');
const sequelize = require('./database');
var members =require('./members');
var newspeeds = require('./newspeeds');

const favs = sequelize.define('favs',{
  memberId:{
    type:Sequelize.INTEGER,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  newspeedId:{
    type:Sequelize.INTEGER,
    allowNull:false,
    references:{
      model:newspeeds,
      key:'id'
    }
  }
});

module.exports = favs;
