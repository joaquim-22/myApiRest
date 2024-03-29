'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Posts.belongsTo(models.User, {as: 'user', foreignKey: 'userId'})
    }
  }
  Posts.init({
    content: DataTypes.CHAR,
    date: DataTypes.DATE,
    image: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};