const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EmailMessage = sequelize.define('emailmessage', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    from: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    to: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    subject: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    
    attempts: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
    // FK 
    // userID as FK from user model
});

module.exports = EmailMessage;