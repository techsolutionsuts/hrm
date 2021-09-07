const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Employee = require('./employee-model');

const Department = sequelize.define('department', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    deptName: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: true
    },
    description: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false
    },
    // deptHead: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     constraints: false,
    //     model: Employee,
    //     kek: 'id'
    //   }
    // },
    deptHeadStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Vacant'
    },
    trackCode: {
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
    // companyID as FK from company model
    // deptHeadID as FK from employee model

});

module.exports = Department;