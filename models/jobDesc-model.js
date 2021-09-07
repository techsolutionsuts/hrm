const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const JobDesc = sequelize.define('jobdesc', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    jobTitle: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    jobDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    jobSummary: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    keyDutiesRespon: {
        type: Sequelize.TEXT,
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

module.exports = JobDesc;