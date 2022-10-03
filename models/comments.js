'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comments.belongsTo(models.Posts, {as: 'post', foreignKey: 'postId'});
      models.Comments.belongsTo(models.User, {as: 'user', foreignKey: 'userId'})
    }
  }
  Comments.init({
    content: DataTypes.CHAR,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};