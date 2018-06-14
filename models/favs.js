const Sequelize = require('sequelize');
const sequelize = require('./database');
var members =require('./members');
var newspeeds = require('./newspeeds');

const favs = sequelize.define('favs',{
  memberId:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  newspeedId:{
    type:Sequelize.INTEGER,
    allowNull:false
  }
});

module.exports = favs;
