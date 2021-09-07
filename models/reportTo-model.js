const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Employee = require('./employee-model');

const ReportTo = sequelize.define('reportto', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    reportToEmplyId: {
        type: Sequelize.INTEGER,
        allowNull: true

    },
    immediateSupEmplyId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
    // employID as FK from employee model
});

module.exports = ReportTo;