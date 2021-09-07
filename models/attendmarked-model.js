const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const AttendMarked = sequelize.define('attendmark', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    date: { type: Sequelize.DATE },
    startTime: {
        type: Sequelize.TIME,
        allowNull: true,
    },
    closeTime: {
        type: Sequelize.TIME,
        allowNull: true
    },
    attend_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    leaveIds: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // This is a fk for leave type but since it dose not accept a null  
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
    // companyID as FK from company model
});

module.exports = AttendMarked;