// const {Model, DataTypes} = require('sequelize');

// class GuildTermooo extends Model {
//   static init(sequelize) {
//     super.init({
//       word: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//       },
//       word_ascii: {
//         type: DataTypes.STRING,
//         defaultValue: false,
//       },
//     }, {
//       underscored: true,
//       sequelize,
//       modelName: 'guild_termooo',
//     });
//   }
// }

// module.exports = GuildTermooo;

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GuildTermooo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.guild, { foreignKey: 'guild_id' });
    }
  }
  GuildTermooo.init({
    word: {
      type: DataTypes.STRING,
    },
    word_ascii: {
      type: DataTypes.STRING,
      defaultValue: false,
    },
  }, {
    underscored: true,
    sequelize,
    modelName: 'guild_termooo',
  });
  GuildTermooo.removeAttribute('id');
  return GuildTermooo;
};
