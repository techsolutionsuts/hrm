const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Logs = sequelize.define('logs', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    action: {
        allowNull: false,
        type: Sequelize.STRING,
    },

    path: {
        allowNull: false,
        type: Sequelize.STRING
    },

    ip: {
        allowNull: false,
        type: Sequelize.STRING
    },

    browser: { allowNull: false, type: Sequelize.STRING },

});

module.exports = Logs;