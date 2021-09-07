const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const HolidayEvents = sequelize.define('holidayEvents', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    eventName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    occurrence: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
});

module.exports = HolidayEvents;