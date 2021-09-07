const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Terminal = sequelize.define('terminal', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    terminal_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    terminal_location: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    terminal_number: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    terminal_serial_number: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    terminal_api: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    terminal_status: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    // terminal_total_users: {
    //     type: Sequelize.INTEGER,
    //     allowNull: true,
    // },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Offline'
    },
    last_update: {
        type: Sequelize.DATE,
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

module.exports = Terminal;