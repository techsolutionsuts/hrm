const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const JobTitle = sequelize.define('jobtitle', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: true
    },
    description: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
    // companyID as FK from company model

});

module.exports = JobTitle;