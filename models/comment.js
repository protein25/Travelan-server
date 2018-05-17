const Sequelize = require('sequelize');
const sequelize = require('./database');

const  = sequelize.define('comment',{
  memberId:{
    type:Sequelize.STRING
  },
  newspeedId:{
    type:Sequelize.STRING
  },
  content:{
    type:Sequelize.TEXT
  }
});

module.exports = comment;
