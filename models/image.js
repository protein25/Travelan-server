const Sequelize = require('sequelize');
const sequelize = require('./database');
var newspeed = require('./newspeed');

const image = sequelize.define('image',{
  newspeedId:{
    type:Sequelize.INTAGER,
    allowNull:false,
    references:{
      model:newspeed,
      key:'id'
    }
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

module.exports = image;
