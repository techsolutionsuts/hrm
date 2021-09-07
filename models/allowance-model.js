const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Allowance = sequelize.define('allowance', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    allwTitle: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    allwAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
});

module.exports = Allowance;