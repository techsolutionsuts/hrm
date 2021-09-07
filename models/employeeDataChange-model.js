const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EmployDataChange = sequelize.define('employdatachange', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  fName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  mName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  nextOfKinName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  nextOfKinPhone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  emergenName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  emergenPhone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
  // FK 
  // userID as FK from user model
  // EmplyID as FK from employee model

});

module.exports = EmployDataChange;