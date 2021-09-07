const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EducationBacground = sequelize.define('educationbacground', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    institution: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    country: {
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
    qualification: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    programMajor: {
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
    // EmplyID as FKfrom employee model

});

module.exports = EducationBacground;