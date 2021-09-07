const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const WorkExperience = sequelize.define('workexperience', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    organization: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    position: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    fromMonthYear: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    toMonthYear: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
    // EmplyID as FKfrom employee model

});

module.exports = WorkExperience;