const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const GroupUnderDept = sequelize.define('groupunderdept', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: true
    },
    description: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false
    },

    groupStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
    // departID as FK from department model
    // groupLeaderID as FK from employee model

});

module.exports = GroupUnderDept;