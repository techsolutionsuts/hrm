const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const PunchData = sequelize.define('punchData', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    punch_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    punch_time: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    terminal_number: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    timestamp: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    punch_agent: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Terminal'
    },
    clock_type: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    late: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    over_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    left_earl: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    marked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    expire_after: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 48
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
});

module.exports = PunchData;