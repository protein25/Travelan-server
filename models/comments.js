const Sequelize = require('sequelize');
const sequelize = require('./database');
const members = require('./members');
const newspeeds = require('./newspeeds');

const comments = sequelize.define('comments', {
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
  },
  content:{
    type:Sequelize.TEXT,
    allowNull:false
  }
});

module.exports = comments;
