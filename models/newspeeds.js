const Sequelize = require('sequelize');
const sequelize = require('./database');
const Models = () => require('./index');

const options = {
  defaultScope: {
    where: {
      state: true,
    },
    order: [['id', 'desc']],
  },
  scopes: {
    addImage: () => {
      return {
        where: {
          state: 1,
        },
        include:[{
          model: Models().Images,
          required: true,
        }],
      };
    },
    addMember: () => ({
      include: [{
        model: Models().Members,
      }]
    }),
    addTravel: () => ({
      include: [{
        model: Models().Travels,
        required: true,
      }]
    })
  },
};

const newspeeds = sequelize.define('newspeeds', {
  memberId: {
    type:Sequelize.STRING,
    allowNull:false,
  },
  content: {
    type:Sequelize.TEXT
  },
  travelId: {
    type:Sequelize.INTEGER
  },
  state: {
    type:Sequelize.INTEGER,
    allowNull:false
  }
}, options);

module.exports = newspeeds;
