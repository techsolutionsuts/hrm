const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const LeaveType = sequelize.define('leaveType', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    leaveType: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING(1000)
    },
    nofdays: {
        type: Sequelize.INTEGER
    },
    genderBased: {
        type: Sequelize.STRING(6),
        allowNull: false,
        defaultValue: 'All'
    },
    carryon: {
        type: Sequelize.BOOLEAN
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = LeaveType;