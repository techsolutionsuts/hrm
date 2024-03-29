require('dotenv').config();
const fs = require('fs');

module.exports = {
    development: {
        username: process.env.ROOT,
        password: process.env.PASSWORD,
        database: process.env.DB_NAME,
        host: '127.0.0.1', //192.168.100.14
        port: 3306,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    test: {
        username: process.env.CI_DB_USERNAME,
        password: process.env.CI_DB_PASSWORD,
        database: process.env.CI_DB_NAME,
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,

        },
    },
    production: {
        username: process.env.ROOT,
        password: process.env.PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.PROD_DB_PORT,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
            "strictSSL": false,
            // ssl: {
            //   ca: null //fs.readFileSync(__dirname + '/mysql-ca-master.crt')
            // },
        },
    },
};