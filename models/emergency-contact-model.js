const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EmergencyContact = sequelize.define('emergencycontact', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    emergName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    emergPhone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    emergIDType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    emergIDNo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    emergRelation: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    emergAddress: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    emergGender: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    emergimage: {
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

module.exports = EmergencyContact;