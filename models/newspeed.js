const Sequelize = require('sequelize');
const sequelize = require('./database');
var members = require('./members');
var image = require('./image');
var plan = require('./plan');

const options = {
  scopes: {
    addImage: () => ({
      include:[{
      model:image,
        where:{
          newspeedId:Sequelize.col('newspeed.id')
        },
      }],
    }),
  },
};

const newspeed = sequelize.define('newspeed',{
  memberId:{
    type:Sequelize.STRING,
    allowNull:false,
    references:{
      model:members,
      key:'id'
    }
  },
  content:{
    type:Sequelize.TEXT
  },
  planId:{
    type:Sequelize.INTEGER
  }
}, options);

newspeed.hasMany(image);
newspeed.belongsTo(plan);

module.exports = newspeed;
