const crypto = require('crypto');

// const throwError = require('./error');
const moment = require('moment');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const genFunct = require("../general-func/general-func");
const { Op, Sequelize } = require('sequelize');

const parseurl = require('parseurl');


const {
    validationResult
} = require('express-validator/check');
const genFuct = require('../general-func/general-func');


const Employee = require('../models/employee-model');
const AttendMarked = require('../models/attendmarked-model');
const Department = require('../models/department-model');
const Leaves = require('../models/leaves-model');
const LeaveType = require('../models/leavetype-model');
const Company = require('../models/company-model');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.API_KEY
        }
    })
);

exports.pathname = async(req) => {
    // For global usage
    return await parseurl(req).pathname;
}

exports.getValidationErrors = async(mesg, errors) => {
    let error = mesg;
    console.log('Error ==> ', errors.array().length);

    for (let i = 0; i < errors.array().length; i++) {
        error += `${errors.array()[i].msg.toString()}\n`;
        // console.log('Error ==> ', errors.array()[i].msg);

    }
    return error;
}

exports.getDashboard = async(req, res, next) => {

    // From the general funct 
    
    const company = await Company.findOne({ where: { deleted: 0 } });
    let compDetails = `Company name: N/A || Address: N/A || Phone: N/A || Email: N/A`;
    if (company) {
        compDetails = `Company name: ${company.name} || Address: ${company.address} || Phone: ${company.phone} || Email: ${company.email}`;
    }
    const dashBoardUser = await genFunct.dashBoardUser(req);
    const getHolidaysNBirthdays = await genFunct.getHolidaysNBirthdays(req, res, next, true);

    await dashBoardUser.push(getHolidaysNBirthdays[0], getHolidaysNBirthdays[1]);
    const state = await genFunct.systemState(req);
    await dashBoardUser.push(state[0], state[1]);
    await dashBoardUser.push(compDetails);

    // return res.status(200).json({ data: last_leave });

    await genFunct.log(req, ['View STDU-Dashboard', (await this.pathname(req)).toString()]);

    res.render('stdu/index', {
        pageTitle: 'STDU-Dashboard',
        globalhex: `/${process.env.MENT}`,
        path: `/${process.env.DIST}/index`,
        editing: false,
        user: req.user,
        userDetails: [req.user.id, req.user.name, req.user.email, req.user.image, req.user.role,req.user.uuid, req.user.timeoutsec, req.user.deptID],
        dashBoardUser: dashBoardUser, //[month, pre, abs, totalPres, totalAbs, days, status, last_leave[+last_leave.length - 1], totalLeaveDaysLeftAC, apply_status, unusedLeave, lastDate],
    });
};