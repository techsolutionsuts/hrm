const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const LeavesProcess = sequelize.define('leavesProcess', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    remarks: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: 'Pending'
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

module.exports = LeavesProcess;