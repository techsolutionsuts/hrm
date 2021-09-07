const express = require('express');
const {
    check,
    body
} = require('express-validator/check');
const bcrypt = require('bcryptjs');

const hodsController = require('../controllers/hods-controller');

const User = require('../models/user-model');
const isCompany = require('../mitm/is-company-setup');

const rtyau754rj = require('../mitm/is-auth');
const v8r11hods = require('../mitm/is-hods');
const Employee = require('../models/employee-model');

const router = express.Router();

// To the stdu-controller which render the dashboard for stdu users
router.get('/index', rtyau754rj, v8r11hods, hodsController.getDashboard);



module.exports = router;