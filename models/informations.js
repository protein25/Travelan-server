const Sequelize = require('sequelize');
const sequelize = require('./database');

const options = {
  defaultScope: {
    order: [['wrtDt', 'desc']],
  },
}

const informations = sequelize.define('informations', {
  id : {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  dataId: {
    type: Sequelize.STRING,
    unique:true,
    allowNull:false
  },
  title: {
    type: Sequelize.STRING
  },
  countryName: {
    type: Sequelize.STRING
  },
  content: {
    type: Sequelize.TEXT
  },
  fileUrl:{
    type: Sequelize.STRING
  },
  wrtDt:{
    type: Sequelize.DATE
  }
}, options);

module.exports = informations;
