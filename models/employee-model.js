const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Employee = sequelize.define('employee', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    staffID: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    mName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    dob: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: true,
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'img/avatar.svg'
    },
    maritalStatus: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    cardType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    cardNo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    tin: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    ssnitNo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    ssnitCardImage: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    ssnitimage: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    dateEmplyed: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    LeaveStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    terminate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    taxable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },

    ssnitable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    emplID: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    // reportToID:{type: Sequelize.INTEGER, allowNull: false},
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    shiftCode: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    deptCode: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    jobCode: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    salaryCode: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    superCode: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    // FKs
    // userID as FK from user model
    // jobtitleID as FK from jobTitle model
    // jobdescID as FK from jobDec model
    // reportToID as FK from this model
    // directReToID as FK from this model
    // deptID as FK from department model
    // salaryStructureID as FK from salaryStructure model
    // companyID as FK from company model

});

module.exports = Employee;