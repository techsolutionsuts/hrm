const crypto = require('crypto');

// const throwError = require('./error');
const moment = require('moment');

const parseurl = require('parseurl');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const genFunct = require("../general-func/general-func");
const { Op, Sequelize } = require('sequelize');

const {
    validationResult
} = require('express-validator/check');

const Employee = require('../models/employee-model');
const AttendMarked = require('../models/attendmarked-model');
const Department = require('../models/department-model');
const Leaves = require('../models/leaves-model');
const LeaveType = require('../models/leavetype-model');
const JobDesc = require('../models/jobDesc-model');
const errorsfile = require('./error');
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
    try {

        const genderNAgeAnalysis = (await genFunct.genderNAgeAnalysis(req));
        const newStaff = genderNAgeAnalysis[4];

        let monthStart = moment().startOf('month');
        let today = new Date();
        monthStart = monthStart.format('YYYY-MM-DD');
        today = moment(today).format('YYYY-MM-DD');
        let month = new Date().toDateString() // moment(today).format('MM-YYYY');
        month = month.split(' ');
        month = `${month[1]} ${month[3]}`;
        const fr = moment(moment().startOf('month'), 'YYYY-MM-DD')
        const to = moment(new Date(), 'YYYY-MM-DD')
        const daysWorked = await genFunct.getMonthWorkingDays(monthStart, today) //Math.floor(-1 * moment.duration(fr.diff(to)).asDays() + 1);
        const daysInMonth = await genFunct.getMonthWorkingDays(monthStart) //Math.floor(-1 * moment.duration(fr.diff(to)).asDays() + 1);
        const dateArray = await genFunct.datearray(monthStart, today);
        const deptID = await Employee.findOne({ where: { id: req.user.currentUserEmployeeId, deleted: 0 } }).then(result => { if (result) { return result.departmentId } return null });
        let totalPres = 0;
        let totalAbs = 0;
        let lastDate = await genFunct.getTodayEvent(new Date()) || 'N/A';
        let punched = 0;
        // console.log('dateArray => ', dateArray);

        for (let i = 0; i < dateArray.length; i++) {
            const date = moment(dateArray[i]).format('YYYY-MM-DD');
            const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getUTCDay()];
            punched += ((await genFunct.getEmpMarkedAttendByDept(date, deptID)).length) ? 1 : 0;
        }
        const employees = await Employee.findAll({
            where: {
                dateEmplyed: {
                    [Op.lte]: today
                },
                departmentId: deptID,
                deleted: 0
            }
        });
        // console.log('employees => ', i, '=>', dateArray[i], (await genFunct.getEmpMarkedAttend(date, null)).length);

        for (let j = 0; j < employees.length; j++) {

            const punchData = await genFunct.getEmpMarkedAttend(today, employees[j].id);
            // console.log('punchData => ', employees[j].id, punchData.length);
            if (punchData.length) {
                const last = punchData.length - 1;
                if (punchData.length > 1) {
                    totalPres += (punchData[0].clock_type == 'CI' && punchData[last].clock_type == 'CO') ? 1 : 0;
                }
                if (punchData.length == 1) {
                    if (await genFunct.punchTimeExpire(today)) {
                        // console.log('punchData => ', employees[j].id, punchData.length, await genFunct.punchTimeExpire(today));
                        totalAbs += 1;
                    } else {
                        // if()
                        totalPres += (punchData[0].clock_type == 'CI') ? 1 : 0;
                    }
                }
                // console.log('employees=>', employees[j].id, punchData.length);
                const name = (await genFunct.getFullName(punchData[last].employeeId)).toString()
                lastDate = name + ' (' + moment(punchData[last].punch_date).format('DD-MM-YYYY') + ' ' + punchData[last].punch_time + ')';
            } else {
                totalAbs += 1;
            }
        }
        // }
        const percentPunched = ((punched / daysInMonth) * 100).toFixed(2);
        const pre = totalPres //((totalPres / (totalPres + totalAbs)) * 100).toFixed(2)
        const abs = totalAbs //100 - pre;
        const getLeaveStatus = await Leaves.findAll({
            where: { deleted: 0, status: ['Approved', 'Pending'] },
            include: [{
                    model: Employee,
                    where: {
                        deleted: 0,
                        departmentId: deptID
                    },
                    require: false,
                },
                {
                    model: LeaveType,
                    where: {
                        deleted: 0,
                    },
                    require: false,
                }
            ]
        });

        const emply_on_leave = [];
        const emply_pend_leave = [];
        for (let i = 0; i < getLeaveStatus.length; i++) {
            let date = Math.floor(new Date());
            let from = Math.floor(new Date(getLeaveStatus[i].from));
            let to = Math.floor(new Date(getLeaveStatus[i].to));
            // console.log('In loop get ==>', date, from, to);

            if ((date >= from) && (date <= to)  && getLeaveStatus[i].status === 'Approved') {
                // if (getLeaveStatus[i].status === 'Approved') {
                    emply_on_leave.push(`${getLeaveStatus[i].employee.title} ${getLeaveStatus[i].employee.fName} ${genFunct.getFulName(getLeaveStatus[i].employee.mName, getLeaveStatus[i].employee.lName)} on ${getLeaveStatus[i].leaveType.leaveType}`);
                }
                if (date <= to && getLeaveStatus[i].status === 'Pending') {

                    emply_pend_leave.push(`${getLeaveStatus[i].employee.title} ${getLeaveStatus[i].employee.fName} ${genFunct.getFulName(getLeaveStatus[i].employee.mName, getLeaveStatus[i].employee.lName)} for ${getLeaveStatus[i].leaveType.leaveType}`);
                }
            // }
        }

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

        await genFunct.log(req, ['View HODs-Dashboard', (await this.pathname(req)).toString()]);

        return res.render('hods/index', {
            pageTitle: 'HODs-Dashboard',
            globalhex: `/${process.env.MENT}`,
            path: `/${process.env.MUN}/index`,
            editing: false,
            user: req.user,
            userDetails: [req.user.id, req.user.name, req.user.email, req.user.image, req.user.role, req.user.uuid, req.user.timeoutsec, req.user.deptID],
            dashBoardUser: dashBoardUser, //[month, pre, abs, totalPres, totalAbs, days, status, last_leave[+last_leave.length - 1], totalLeaveDaysLeftAC, apply_status, unusedLeave, lastDate],
            dashBoardEmployee: [genderNAgeAnalysis[0], genderNAgeAnalysis[1], genderNAgeAnalysis[2], genderNAgeAnalysis[3], month, pre, abs, punched, percentPunched, daysInMonth, lastDate, newStaff, emply_on_leave, emply_pend_leave, daysWorked], // 13

        });
    } catch (err) {
        console.log('Error from hod dashboard ===>', err);
        if (req.xhr) {
            return res.status(500).json({ error: 'Sorry something went wrong, please try again' });
        } else {
            console.log("Here ===>");
            msg = 'Sorry something went wrong, please try again';
            return errorsfile.get500(req, res, next, msg); //res.render('404', {});

        }
    }
};