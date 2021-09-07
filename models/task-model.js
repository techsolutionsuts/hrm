const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Task = sequelize.define('task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    taskName: {
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    dueDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    dateCompleted: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
});

module.exports = Task;