const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Leaves = sequelize.define('leaves', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    daysleft: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    expecteddays: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    from: {
        type: Sequelize.DATE,
        allowNull: false
    },

    to: {
        type: Sequelize.DATE,
        allowNull: false
    },

    days: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    reason: {
        type: Sequelize.STRING,
        allowNull: true
    },
    remarks: {
        type: Sequelize.STRING,
        allowNull: true
    },

    fileupload: {
        type: Sequelize.STRING,
        allowNull: true
    },

    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: 'Pending'
    },
    employId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // references: { model: 'Employees', key: 'id' }
    }
    // FK 
    // userID as FK from user model
    // companyID as FK from company model
});

module.exports = Leaves;