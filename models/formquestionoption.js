'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormQuestionOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FormQuestionOption.belongsTo(models.FormQuestion, {
        foreignKey: "formQuestionId",
        as: 'FormQuestion'
      })
    }
  };
  FormQuestionOption.init({
    title: DataTypes.STRING,
    oType: DataTypes.STRING,
    formQuestionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FormQuestionOption',
  });
  return FormQuestionOption;
};