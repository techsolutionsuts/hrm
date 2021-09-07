'use strict';
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
// exports.base_url = BASE_URL;


let sequelize;
if (config.use_env_variable) {
    // sequelize = new Sequelize(process.env[config.use_env_variable], config);
    sequelize = new Sequelize(process.env.DB_NAME, process.env.ROOT, process.env.PASSWORD, config);
} else {
    // sequelize = new Sequelize(config.database, config.username, config.password, config);
    sequelize = new Sequelize(process.env.DB_NAME, process.env.ROOT, process.env.PASSWORD, config);
}

module.exports = sequelize;


// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.ROOT, process.env.PASSWORD, {
//   dialect: 'mysql',
//   host: 'localhost'
// });
// module.exports = sequelize;