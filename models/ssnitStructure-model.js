const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const SSNITStruct = sequelize.define('ssnitstructure', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    teirOne: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    teirTwo: {
        type: Sequelize.FLOAT,
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

module.exports = SSNITStruct;