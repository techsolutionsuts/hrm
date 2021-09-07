const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Shift = sequelize.define('shift', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    shift_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start_hour: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    start_minute: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    end_hour: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    end_minute: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    shift_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    grace_period: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    days: {
        type: Sequelize.STRING,
        allowNull: false
    },
    allow_break: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    break_hour: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    break_minute: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    break_duration_minute: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },

    allow_over_time: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    overtime_hour: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    overtime_minute: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    overtime_rate: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
});

module.exports = Shift;