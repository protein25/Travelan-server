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
          newspeedId:Sequelize.col('newspeed.id'),
          state:1
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
  },
  state:{
    type:Sequelize.INTEGER,
    allowNull:false
  }
}, options);

newspeed.hasMany(image);
newspeed.belongsTo(plan);

module.exports = newspeed;
