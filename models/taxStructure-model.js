const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const TaxStruct = sequelize.define('taxstructure', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    first: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nextOne: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nextTwo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nextThree: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nextFour: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    exceeding: {
        type: Sequelize.STRING,
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

module.exports = TaxStruct;