const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const PunchData = require('./punchData-model');
const SalaryStructure = require('./salaryStructure-model');
// const sequelize = new Sequelize( /* ... */ );

const queryInterface = sequelize.getQueryInterface();

exports.alterTables = async() => {
    // try {
    // await SalaryStructure.findAll({ attributes: ['notch'] }).then(result => {
    //     if (!result) {
    queryInterface.addColumn('salarystructures', 'notch', { type: Sequelize.STRING, after: 'grade' });
    //     }
    // });
    // await PunchData.findAll({ attributes: ['expire_after'] }).then(result => {
    //         if (!result) {
    queryInterface.addColumn('punchData', 'expire_after', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 48,
        after: 'marked'
    });

    queryInterface.addColumn('users', 'uuid', {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        after: 'currentUserEmployeeId'
    })

    queryInterface.addColumn('users', 'sessiontimeout', {
        type: Sequelize.INTEGER,
        defaultValue: 30,
        after: 'session'
    })
    //     }
    // })
    // down
    // } catch (error) {
    //     console.log('Error: alter table', error);
    // }
};


// sequelize.query('ALTER TABLE salarystructures AFTER grade ADD column (notch VARCHAR(255))', function(err, result) {
//     if (err) {
//         console.log("ERROR:" + err.message);
//     } else {
//         console.log("new column added");
//     }
// });