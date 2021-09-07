const express = require('express');
const {
    check,
    body
} = require('express-validator/check');
const bcrypt = require('bcryptjs');

const stduController = require('../controllers/stdu-controller');

const User = require('../models/user-model');
const isCompany = require('../mitm/is-company-setup');

const macrj45au = require('../mitm/is-auth');
const nic3310std = require('../mitm/is-stdu');
const Employee = require('../models/employee-model');

const router = express.Router();

// To the stdu-controller which render the dashboard for stdu users
router.get('/index', macrj45au, nic3310std, stduController.getDashboard);



module.exports = router;