const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Dependant = sequelize.define('dependant', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    dependName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    dependDOB: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    dependGender: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    dependPhone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    dependIDType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    dependIDNo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    relation: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    dependAddress: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    dependimage: {
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

module.exports = Dependant;