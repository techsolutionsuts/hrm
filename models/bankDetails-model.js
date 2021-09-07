const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const BankDetail = sequelize.define('bankdetail', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    bankName: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    branch: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    accNo: {
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
    // EmplyID as FKfrom employee model

});

module.exports = BankDetail;