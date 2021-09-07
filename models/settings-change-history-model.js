const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// add more settings as and when needed later.
const SettingsChangeHistory = sequelize.define('settingsChangeHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    key: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    value: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = SettingsChangeHistory;