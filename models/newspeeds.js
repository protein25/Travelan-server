const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');
var images = require('./images');
var plans = require('./plans');

const options = {
  scopes: {
    addImage: () => ({
      where: {
        state: 1,
      },
      include:[{
        model:images,
          where:{
            newspeedId:Sequelize.col('newspeed.id'),
          },
      }],
    }),
    addMember: () => ({
      include: [{
        model: members,
      }]
    })
  },
};

const newspeed = sequelize.define('newspeed', {
  memberId: {
    type:Sequelize.STRING,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  content: {
    type:Sequelize.TEXT
  },
  planId: {
    type:Sequelize.INTEGER
  },
  state: {
    type:Sequelize.INTEGER,
    allowNull:false
  }
}, options);

newspeed.hasMany(images);
newspeed.belongsTo(plans);
newspeed.belongsTo(members);

module.exports = newspeed;
