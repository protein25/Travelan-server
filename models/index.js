const Accommodates = require('./accommodates');
const Attractions = require('./attractions');
const Comments = require('./comments');
const Devices = require('./devices');
const Favs = require('./favs');
const Images = require('./images');
const Informations = require('./informations');
const Members = require('./members');
const Newspeeds = require('./newspeeds');
const Plans = require('./plans');
const Transportations = require('./transportations');
const Travels = require('./travels');

Travels.hasMany(Plans, { foreignKey: 'titleId' });
Plans.belongsTo(Travels, { foreignKey: 'titleId' });

Travels.hasMany(Newspeeds);
Newspeeds.belongsTo(Travels);

Newspeeds.hasMany(Images);
Images.belongsTo(Newspeeds);

Members.hasMany(Newspeeds);
Newspeeds.belongsTo(Members);

Newspeeds.hasMany(Comments);
Comments.belongsTo(Newspeeds);

Newspeeds.hasMany(Favs);
Favs.belongsTo(Newspeeds);

Members.hasMany(Comments);
Comments.belongsTo(Members);

console.log('model associated');

module.exports = {
  Accommodates,
  Attractions,
  Comments,
  Devices,
  Favs,
  Images,
  Informations,
  Members,
  Newspeeds,
  Plans,
  Transportations,
  Travels,
};
