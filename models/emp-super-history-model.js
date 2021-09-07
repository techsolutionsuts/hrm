const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// add more settings as and when needed later.
const EmpSuperHistory = sequelize.define('empSuperHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    from: {
        type: Sequelize.DATE,
        allowNull: false
    },
    to: {
        type: Sequelize.DATE,
        allowNull: true
    },
    super_code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = EmpSuperHistory;