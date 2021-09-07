const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const SalaryStructure = sequelize.define('salarystructure', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    grade: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    notch: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    basic: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    description: {
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
    // companyID as FK from company model

});

module.exports = SalaryStructure;