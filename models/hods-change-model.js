const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const HODsChanged = sequelize.define('hodsChange', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    remarks: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    statusAs: {
        type: Sequelize.STRING,
        allowNull: true
    },
    position: {
        type: Sequelize.STRING,
        allowNull: true
    },
    file: {
        type: Sequelize.STRING,
        allowNull: true
    },
    trackCode: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = HODsChanged;