const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        // unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.TINYINT,
        defaultValue: 1
    },
    firstTime: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    image: {
        type: Sequelize.STRING(500),
        defaultValue: 'img/avatar.svg'
    },
    requestpass: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    login: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    session: {
        type: Sequelize.STRING,
        allowNull: true
    },
    sessiontimeout: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:30
    },
    expiredAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    lockExpired: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    lastLogin: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
        allowNull: true
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    uuid:{type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4},
    // FK
    // userID as FK from user model
    // emplyID as FK from employee model

});

module.exports = User;