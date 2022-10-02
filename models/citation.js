'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Citation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Citation.belongsTo(models.User,{foreignKey:{name:'idUser'}})
      Citation.belongsTo(models.Profil,{foreignKey:{name:'idProfil'}})
    }
  }
  Citation.init({
    post: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    idProfil: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Citation',
  });
  return Citation;
};