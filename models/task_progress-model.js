const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const TaskProgress = sequelize.define('taskProgress', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    taskProgress: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    status: {
        type: Sequelize.INTEGER,
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

module.exports = TaskProgress;