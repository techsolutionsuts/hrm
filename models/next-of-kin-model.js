const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const NextOfKin = sequelize.define('nextofkin', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nokName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nokPhone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nokIDType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nokIDNo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nokRelation: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nokAddress: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nokGender: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nokImage: {
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

module.exports = NextOfKin;