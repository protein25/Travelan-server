const Sequelize = require('sequelize');

const sequelize = new Sequelize('travelan', 'kyubum', 'choi0245@', {
  host: 'kyubum.me',
  dialect: 'mysql',
  operatorsAliases: false,
  timezone: '+09:00',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

module.exports = sequelize;
