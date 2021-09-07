const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const SSNITBenfit = sequelize.define('ssnitbenfit', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    benName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    benPhone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    benIDType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    benIDNo: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    benRelation: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    benfGender: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    benfDOB: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    benAddress: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    benfImage: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    percentage: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
    // EmplyID as FK from employee model

});

module.exports = SSNITBenfit;