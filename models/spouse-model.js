const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Spouse = sequelize.define('spouse', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    spouseName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    spouseDOB: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    spousePhone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    spousePhoto: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    spouseIDType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    spouseIDNo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: false
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
    // EmplyID as FK from employee model

});

module.exports = Spouse;