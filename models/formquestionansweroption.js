'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormQuestionAnswerOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FormQuestionAnswerOption.belongsTo(models.FormQuestionAnswer, {
        foreignKey: "formQuestionAnswerId",
        as: "FormQuestionAnswer"
      });
    }
  };
  FormQuestionAnswerOption.init({
    formQuestionAnswerId: DataTypes.INTEGER,
    formQuestionOptionId: DataTypes.INTEGER,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FormQuestionAnswerOption',
  });
  return FormQuestionAnswerOption;
};