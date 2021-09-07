const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const TerminalUser = sequelize.define('terminalUser', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    terminal_user_id: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    // total_punch: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    // },

    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
});

module.exports = TerminalUser;