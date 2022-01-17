'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormQuestionAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FormQuestionAnswer.hasMany(models.FormQuestionAnswerOption, {
        foreignKey: "formQuestionAnswerId",
        as: "FormQuestionAnswerOptions"
      });
      FormQuestionAnswer.belongsTo(models.FormQuestion, {
        foreignKey: "formQuestionId",
        as: "FormQuestion"
      })
    }
  };
  FormQuestionAnswer.init({
    userUuid: DataTypes.STRING,
    formQuestionId: DataTypes.INTEGER,
    answerText: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FormQuestionAnswer',
  });
  return FormQuestionAnswer;
};