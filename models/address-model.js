const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Address = sequelize.define('address', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    gpGPSCode: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    residAddress: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    nearestLandmark: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    postAddress: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    town: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    region: {
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
    // EmplyID as FK from employee model

});

module.exports = Address;