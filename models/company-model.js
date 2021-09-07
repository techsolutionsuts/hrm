const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Company = sequelize.define('company', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        dateInco: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING(64),
            allowNull: false,
        },
        tin: {
            type: Sequelize.STRING,
            allowNull: false,
            // unique: true
        },
        regNum: {
            type: Sequelize.STRING,
            allowNull: false,
            // unique: true
        },
        compType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ceo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            // unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            // unique: true
        },
        region: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        digitalAdd: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        image: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        staff_ID_gene: {
            type: Sequelize.STRING,
            allowNull: false,
            defauldValue: 'Manual'
        },
        company_initials: { type: Sequelize.STRING, allowNull: false },

        website: { type: Sequelize.STRING, allowNull: true },
        totalEmp: { type: Sequelize.INTEGER, allowNull: true, defauldValue: true },
        totalDept: { type: Sequelize.INTEGER, allowNull: true, defauldValue: 0 },
        lastAccess: { type: Sequelize.DATE, allowNull: true, defauldValue: new Date() },

        // os_x86_64: {
        //     type: Sequelize.TEXT,
        //     allowNull: true
        // },


        deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
        // FK
        // userID as FK from user model
    }
    // , 
    // {
    //     indexes: [
    //         { unique: true, fields: ['name'] },
    //         { unique: true, fields: ['email'] },
    //         { unique: true, fields: ['phone'] },
    //         { unique: true, fields: ['tin'] },
    //         { unique: true, fields: ['regNum'] }
    //     ]
    // }
);

module.exports = Company;