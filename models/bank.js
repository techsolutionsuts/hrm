'use strict';
const {
  Model
} = require('sequelize');

const User = require('./user-model');

module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(Bank);
      Bank.belongsTo(User);
    }
  };
  Bank.init({
    bankName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bank',
  });
  return Bank;
};