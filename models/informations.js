const Sequelize = require('sequelize');
const sequelize = require('./database');

function makeFlagImage(countryEnName) {
  return `${countryEnName.toLowerCase().replace(/ /g, '-')}.png`;
}

const options = {
  defaultScope: {
    order: [['wrtDt', 'desc'], ['createdAt', 'asc']],
  },
  hooks: {
    afterFind: (result) => {
      if (result instanceof Array) {
        for (var i in result) {
          result[i].flagImage = makeFlagImage(result[i].countryEnName);
        }
      } else {
        result.flagImage = makeFlagImage(result.countryEnName);
      }

      return result;
    },
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
  countryEnName: {
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
