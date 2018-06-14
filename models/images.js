const Sequelize = require('sequelize');
const sequelize = require('./database');
var newspeed = require('./newspeeds');

const images = sequelize.define('images',{
  newspeedId:{
    type:Sequelize.INTEGER,
    allowNull:false
  },
  originName:{
    type:Sequelize.STRING,
    allowNull:false
  },
  serverName:{
    type:Sequelize.STRING,
    allowNull:false
  }
});

module.exports = images;
