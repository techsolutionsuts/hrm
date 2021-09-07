const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EmpSalaryHistory = sequelize.define('empsalaryhistory', {
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
    salary_code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = EmpSalaryHistory;