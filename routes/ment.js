const express = require('express');
const {
    body,
    check
} = require('express-validator');
const path = require('path');
const router = express.Router();
const moment = require('moment');

const mentController = require('../controllers/ment');

const _0auxx2bf49c = require('../mitm/is-auth');
const _0xsu45b564 = require('../mitm/is-sudo');

const Company = require('../models/company-model');
const SalaryStructure = require('../models/salaryStructure-model');
const JobDesc = require('../models/jobDesc-model');
const Department = require('../models/department-model');
const { Op } = require('sequelize');
const genfunc = require("../general-func/general-func");
const Employee = require('../models/employee-model');
const BankDetail = require('../models/bankDetails-model');
const Spouse = require('../models/spouse-model');
const NextOfKin = require('../models/next-of-kin-model');
const EmergencyContact = require('../models/emergency-contact-model');
const Dependant = require('../models/dependant-model');
const SSNITBenfit = require('../models/ssnitBenefit-model');
const Allowance = require('../models/allowance-model');
const LeaveType = require('../models/leavetype-model');
const Leaves = require('../models/leaves-model');
const AttendMarked = require('../models/attendmarked-model');
const Shift = require('../models/shift-model');
const HolidayEvents = require('../models/holidays-events-model');
const TerminalUser = require('../models/terminal_users-model');
const Terminal = require('../models/terminal-model');
const PunchData = require('../models/punchData-model');
const SystemSettings = require('../models/system-settings-model');
const state = require('../mitm/state');
const Task = require('../models/task-model');

router.get('/index', _0auxx2bf49c, _0xsu45b564, mentController.getDashboard);

router.get('/employees', _0auxx2bf49c, mentController.getEmployees);

// router.get('/add-employee', _0auxx2bf49c, _0xsu45b564, mentController.getAddEmployee);

// Employee data validation route
router.post('/validate-basic', [
    body('title').not().isEmpty().withMessage('Title is required').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z]+$/.test(value))) {
            return Promise.reject('Title must be letters only.');
        }
        return true;
    }),
    body('fName').not().isEmpty().withMessage('First name is required').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('First name must be letters only.');
        }
        return true;
    }),
    body('mName').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z ]+$/.test(value))) {
                return Promise.reject('Middle name must be letters only.');
            }
            return true;
        }
        return true;
    }),
    body('lName').not().isEmpty().withMessage('Last name is required').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('Last name must be letters only.');
        }
        return true;
    }),
    body('gender').not().isEmpty().withMessage('Gender is required').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('Gender must be letters only.');
        }
        return true;
    }),
    body('bdate').not().isEmpty().withMessage('Birth date is required').custom((value, {
        req
    }) => {
        const _age = genfunc.getAge(value);
        // const datef = new Date(`2005 ${req.body.month}`);
        if (_age < 16) {
            return Promise.reject(`Employee age is below 16.`);
        }
        return true;
    }),
    body('mStatus').not().isEmpty().withMessage('Marriage status is required').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('Marriage status must be letters only.');
        }
        return true;
    }),

    // body('image')
    // .custom((value, {
    //     req
    // }) => {
    //     const images = req.files;
    //     let image_name = [];
    //     let image_size = [];
    //     if (images) { images.map(p => image_name.push(p.filename), image_size.push(p.size)); }

    //     if (!(value === undefined || value === null || value === "")) {
    //         let extension = value.split('.').pop().toLowerCase();
    //         if ($.inArray(extension, ['png', 'jpeg', 'gif', 'jpg']) == -1) {
    //             return Promise.reject('Please select a valid image file.');
    //         }
    //         return true;
    //     }
    //     return true;
    // }),
    // .custom((value, {
    //     req
    // }) => {
    //         let image_size = property.size;
    //     if (image_size > 1000000) {
    //         return Promise.reject('Please image file should be 1 Mb of size.');
    //     }
    //     return true;
    // }),
    body('phone').not().isEmpty().withMessage('Phone number is required').custom((value, {
        req
    }) => {
        let mobile_validation = /^\d{10}$/;
        if (!mobile_validation.test(value)) {
            return Promise.reject('Phone number must be a number and 10 digits only.');
        }
        return true;
    }).custom((value, { req }) => {
        let mode = req.body.mode;
        if (mode === 'add') {
            return Employee.findOne({
                where: {
                    phone: value,
                    deleted: 0
                }
            }).then(emp => {
                if (emp) {
                    return Promise.reject('Sorry phone number already exist.' + emp.id);
                }
                return true;
            });
        } else {
            return Employee.findOne({
                where: {
                    phone: value,
                    deleted: 0
                }
            }).then(emp => {
                if (emp) {
                    // console.log('EMP ID DB ====> ', emp.id);
                    // console.log('EMP ID FoRM ====> ', +req.body.empID);
                    if (emp.id !== +req.body.empID) {
                        return Promise.reject('Sorry phone number already exist.');
                    }
                    return true;
                }
                return true;
            });
        }
        // return true;
    }),

    body('email').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email is required and must be a valid email').custom((value, {
        req
    }) => {
        let mode = req.body.mode;
        if (mode === 'add') {
            return Employee.findOne({
                where: {
                    email: value,
                    deleted: 0
                }
            }).then(emp => {
                if (emp) {
                    return Promise.reject('Sorry email already exist.');
                }
                return true;
            });
        } else {
            return Employee.findOne({
                where: {
                    email: value,
                    deleted: 0
                }
            }).then(emp => {
                if (emp) {
                    // console.log('EMP ID ====> ', emp.id);
                    if (emp.id !== +req.body.empID) {
                        // console.log('EMP ID ====> ', emp.id);
                        return Promise.reject('Sorry email already exist.');
                    }
                    return true;
                }
                return true;
            });
        }
        // return true;
    })
], _0auxx2bf49c, _0xsu45b564, mentController.validateData);

router.post('/validate-address', [
    body('residAddress').not().isEmpty().withMessage('Residential address is required'),
    body('nearmark').not().isEmpty().withMessage('Nearest land mark is required').isString().withMessage('Nearest land mark is invalid.'),
    body('postAddress').isString(),
    body('town').not().isEmpty().withMessage('Town is required').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z0-9 ]+$/.test(value))) {
            return Promise.reject('Town name must be alphanumeric only.');
        }
        return true;
    }),
    body('region').not().isEmpty().withMessage('Region is required').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('Please select region.');
        }
        return true;
    }),
    body('gpCode').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9-]+$/.test(value))) {
                return Promise.reject('Code is invalid.');
            }
            return true;
        }
        return true;
    }),
    body('cardType').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z' ]+$/.test(value))) {
                return Promise.reject('Please enter a valid data for card type.');
            }
            return true;
        }
        return true;
    }),
    body('idCard').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9]+$/.test(value))) {
                return Promise.reject(`Enter a valid data for the selected ID card.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(req.body.cardType === undefined || req.body.cardType === null || req.body.cardType === "")) {
            if (value === undefined || value === null || value === "") {
                return Promise.reject(`Enter card no. for the selected ID card.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (req.body.cardType === undefined || req.body.cardType === null || req.body.cardType === "") {
            if (!(value === undefined || value === null || value === "")) {
                return Promise.reject(`Please select a card type before entering a card number.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return Employee.findOne({
                    where: {
                        cardNo: value,
                        deleted: 0
                    }
                }).then(card => {
                    if (card) {
                        return Promise.reject('Sorry card no already exist.');
                    }
                    return true;
                });
            } else {
                return Employee.findOne({
                    where: {
                        cardNo: value,
                        deleted: 0
                    }
                }).then(card => {
                    if (card) {
                        console.log('EMP ID ====> ', card.id);
                        if (card.id !== +req.body.empID) {
                            console.log('EMP ID ====> ', card.id);
                            return Promise.reject('Sorry card no already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }
        return true;
    }),
    body('tin').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9]+$/.test(value))) {
                return Promise.reject('Tin number must be alphanumeric only.');
            }
            return true;
        }
        return true;
    }).custom((value, { req }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return Employee.findOne({
                    where: {
                        tin: value,
                        deleted: 0
                    }
                }).then(tin => {
                    if (tin) {
                        return Promise.reject('Sorry tin no already exist.');
                    }
                    return true;
                });
            } else {
                return Employee.findOne({
                    where: {
                        tin: value,
                        deleted: 0
                    }
                }).then(tin => {
                    if (tin) {
                        // console.log('EMP ID ====> ', ssnitNo.id);
                        if (tin.id !== +req.body.empID) {
                            // console.log('EMP ID ====> ', ssnitNo.id);
                            return Promise.reject('Sorry tin no already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }
        return true;
    }),

    body('ssnitNo').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9]+$/.test(value))) {
                return Promise.reject('SSNIT number must be 10 digits.');
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9]+$/.test(value))) {
                return Promise.reject('SSNIT number must be alphanumeric only.');
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return Employee.findOne({
                    where: {
                        ssnitNo: value,
                        deleted: 0
                    }
                }).then(ssnitNo => {
                    if (ssnitNo) {
                        return Promise.reject('Sorry ssnit no already exist.');
                    }
                    return true;
                });
            } else {
                return Employee.findOne({
                    where: {
                        ssnitNo: value,
                        deleted: 0
                    }
                }).then(ssnitNo => {
                    if (ssnitNo) {
                        // console.log('EMP ID ====> ', ssnitNo.id);
                        if (ssnitNo.id !== +req.body.empID) {
                            // console.log('EMP ID ====> ', ssnitNo.id);
                            return Promise.reject('Sorry ssnit no already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }
        return true;
    }),
], _0auxx2bf49c, _0xsu45b564, mentController.validateData);

router.post('/validate-employmnet', [
    body('dateEmplyed').not().isEmpty().withMessage('Date employed is required').custom((value, {
        req
    }) => {
        let date = new Date(value)

        return Company.findOne({ where: { deleted: 0 } }).then(async results => {
            if (results) {
                let compDate = Math.floor(new Date(results.dateInco) / 1000);
                let emply = Math.floor(new Date(value) / 1000);
                if (emply < compDate) {
                    throw new Error('Sorry employment date cannot be before company incorperation date which is: ' + results.dateInco);
                }
            }

            if (date > Date.now()) {
                throw new Error('Sorry date must not be before today\'s date. ');
            }
            return true;

        })
    }),
    body('staffID').not().isEmpty().withMessage('Staff ID is required').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9 ]+$/.test(value))) {
                return Promise.reject('Staff ID must be letters and numbers only');
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return Employee.findOne({
                    where: {
                        staffID: value,
                        deleted: 0
                    }
                }).then(staffid => {
                    if (staffid) {
                        return Promise.reject('Sorry staff ID already exist.');
                    }
                    return true;
                });
            } else {
                return Employee.findOne({
                    where: {
                        staffID: value,
                        deleted: 0
                    }
                }).then(staffid => {
                    if (staffid) {
                        // console.log('EMP ID ====> ', ssnitNo.id);
                        if (staffid.id !== +req.body.empID) {
                            // console.log('EMP ID ====> ', ssnitNo.id);
                            return Promise.reject('Sorry staff ID already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }
        return true;
    }),
    body('jobTitle').not().isEmpty().withMessage('Job title is required').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[0-9 ]+$/.test(value))) {
                return Promise.reject('Job title is not valid.');
            }
            return true;
        }
        return true;
    }),
    body('dept').not().isEmpty().withMessage('Select department for employee.').custom((value, {
        req
    }) => {

        if (!(/^[0-9]+$/.test(value))) {
            return Promise.reject('Department is required.');
        }

        if (req.body.mode == 'edit') {
            return Department.findOne({ where: { headByEmployeeId: +req.body.empID } }).then(result => {
                console.log('Date => ', Date.now(req.body.bdate), Date.now());
                // console.log('Result => ', req.body.empID);
                if (result) {
                    if (result.id !== +value) {
                        // console.log('Dept => ', result.id, value);
                        return Promise.reject('Sorry this person is the current HOD, change that before new department can be given.');
                    }
                }
            })

        }
        // if (!(value === undefined || value === null || value === "")) {

        return true;
        // }
        // return true;
    }),
    body('immediatesuper').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[0-9]+$/.test(value))) {
                return Promise.reject('Data is invalid.');
            }
            return true;
        }
        return true;
    }),
    body('leavtype').not().isEmpty().withMessage('Select annual leave for employee.').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[0-9]+$/.test(value))) {
                return Promise.reject('Data is invalid.');
            }
            return true;
        }
        return true;
    }),
    body('institution').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`Institution name is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),
    body('qualification').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`Qualification is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),

    body('programMajor').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z. ]+$/.test(value[i]))) {
                    return Promise.reject(`Program is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),

    body('fromDate').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let date = new Date(value[i])
                if (date > Date.now()) {
                    return Promise.reject(`From date is not valid at row ${i+1} ${date}, must be month and year only`);
                }
            }
        }
        return true;
    }),

    body('toDate').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let date = new Date(value[i])
                if (date > Date.now()) {
                    return Promise.reject(`To date is not valid at row ${i+1}, must be month and year only`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let date = new Date(value[i]);
                let datef = new Date('1999/');
                let fromDate = new Date(req.body.fromDate[i]);
                if (date < fromDate) {
                    return Promise.reject(`To date is not valid at row ${i+1} ${datef}, must not be more than from date`);
                }
            }
        }
        return true;
    }),
    body('orgName').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z. ]+$/.test(value[i]))) {
                    return Promise.reject(`Organization name is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),
    body('position').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z. ]+$/.test(value[i]))) {
                    return Promise.reject(`Position is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),
    body('orgFromDate').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let date = new Date(value[i])
                if (date > Date.now()) {
                    return Promise.reject(`From date is not valid at row ${i+1}, must be month and year only`);
                }
            }
        }
        return true;
    }),
    body('orgToDate').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let date = new Date(value[i])
                if (date > Date.now()) {
                    return Promise.reject(`To date is not valid at row ${i+1}, must be month and year only`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let date = new Date(value[i]);
                let orgFromDate = new Date(req.body.orgFromDate[i]);
                if (date < orgFromDate) {
                    return Promise.reject(`To date is not valid at row ${i+1}, must not be more than from date`);
                }
            }
        }
        return true;
    })
], _0auxx2bf49c, _0xsu45b564, mentController.validateData);

// validate bank details
router.post('/validate-bank', [
    body('salaryStruct').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[0-9]+$/.test(value))) {
                return Promise.reject('Salary structure data is invalid');
            }
            return true;
        }
        return true;
    }),
    body('bankName').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z ]+$/.test(value))) {
                return Promise.reject('Bank data is invalid');
            }
            return true;
        }
        return true;
    }).custom((value, { req }) => {
        if ((req.body.branch || req.body.accNum) && (value === undefined || value === null || value === "")) {
            return Promise.reject('Bank name is required.');
        }
        return true;
    }),
    body('accNum').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[0-9]+$/.test(value))) {
                return Promise.reject('Account number must be numbers only.');
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return BankDetail.findOne({
                    where: {
                        accNo: value,
                        deleted: 0
                    }
                }).then(accNo => {
                    if (accNo) {
                        return Promise.reject('Sorry account no. already exist.');
                    }
                    return true;
                });
            } else {
                return BankDetail.findOne({
                    where: {
                        accNo: value,
                        deleted: 0
                    }
                }).then(accN => {
                    if (accN) {
                        // console.log('EMP ID ====> ', accN.employeeId);
                        if (accN.employeeId !== +req.body.empID) {
                            // console.log('EMP ID ====> ', accN.employeeId);
                            return Promise.reject('Sorry account no. already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }
        return true;
    }).custom((value, { req }) => {
        if (req.body.bankName && (value === undefined || value === null || value === "")) {
            return Promise.reject('Account number is required.');
        }
        return true;
    }),
    body('branch').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z ]+$/.test(value))) {
                return Promise.reject('Branch value must be letter only.');
            }
            return true;
        }
        return true;
    }).custom((value, { req }) => {
        if (req.body.bankName && (value === undefined || value === null || value === "")) {
            return Promise.reject('Branch is required.');
        }
        return true;
    })
], _0auxx2bf49c, _0xsu45b564, mentController.validateData);


// validate spouse and nok details
router.post('/validate-spouseNoK', [
    body('spName').custom((value, {
        req
    }) => {
        if (req.body.mStatus === 'Married') {
            if (!(/^[a-zA-Z ]+$/.test(value))) {
                return Promise.reject('Name must be letters only.');
            }
            return true;
        }
        return true;
    }),
    body('spcardType').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z' ]+$/.test(value))) {
                return Promise.reject('Please enter a valid data for card type.');
            }
            return true;
        }
        return true;
    }),
    body('spIDCard').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9]+$/.test(value))) {
                return Promise.reject(`Enter a valid data for the selected ID card.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(req.body.spcardType === undefined || req.body.spcardType === null || req.body.spcardType === "")) {
            if (value === undefined || value === null || value === "") {
                return Promise.reject(`Enter card no. for the selected ID card.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (req.body.spcardType === undefined || req.body.spcardType === null || req.body.spcardType === "") {
            if (!(value === undefined || value === null || value === "")) {
                return Promise.reject(`Please select a card type above.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return Spouse.findOne({
                    where: {
                        spouseIDNo: value,
                        deleted: 0
                    }
                }).then(spcard => {
                    if (spcard) {
                        return Promise.reject('Sorry card no. already exist.');
                    }
                    return true;
                });
            } else {
                return Spouse.findOne({
                    where: {
                        spouseIDNo: value,
                        deleted: 0
                    }
                }).then(spcard => {
                    if (spcard) {
                        // console.log('EMP ID ====> ', spcard.employeeId);
                        if (spcard.employeeId !== +req.body.empID) {
                            // console.log('EMP ID ====> ', spcard.employeeId);
                            return Promise.reject('Sorry card no. already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }
        return true;

    }),
    body('spphone').custom((value, {
        req
    }) => {
        let mobile_validation = /^\d{10}$/;
        if (req.body.mStatus === 'Married') {
            // if (!mobile_validation.test(value)) {
            if (!(/^[0-9]+$/.test(value))) {
                return Promise.reject(`Phone number must be numbers only.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return Spouse.findOne({
                    where: {
                        spousePhone: value,
                        deleted: 0
                    }
                }).then(spphone => {
                    if (spphone) {
                        return Promise.reject('Sorry phone no. already exist.');
                    }
                    return true;
                });
            } else {
                return Spouse.findOne({
                    where: {
                        spousePhone: value,
                        deleted: 0
                    }
                }).then(spphone => {
                    if (spphone) {
                        // console.log('EMP ID ====> ', spphone.employeeId);
                        if (spphone.employeeId !== +req.body.empID) {
                            // console.log('EMP ID ====> ', spphone.employeeId);
                            return Promise.reject('Sorry phone no. already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }

        return true;
    }),
    body('spDOB').custom((value, {
        req
    }) => {
        const _age = genfunc.getAge(value);
        if (!(value === undefined || value === null || value === "")) {
            if (_age < 16) {
                return Promise.reject('Spouse age is below 16.');
            }
            return true;
        }
        return true;
    }),
    body('nOKName').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z ]+$/.test(value))) {
                return Promise.reject('Name must be letters only.');
            }
            return true;
        }
        return true;
    }),
    body('nOkPhone').custom((value, {
        req
    }) => {
        let mobile_validation = /^\d{10}$/;
        if (!(value === undefined || value === null || value === "")) {
            // if (!mobile_validation.test(value)) {
            if (!(/^[0-9+]+$/.test(value))) {
                return Promise.reject(`Phone number must be numbers only.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return NextOfKin.findOne({
                    where: {
                        nokPhone: value,
                        deleted: 0
                    }
                }).then(nok => {
                    if (nok) {
                        return Promise.reject('Sorry phone no. already exist.');
                    }
                    return true;
                });
            } else {
                return NextOfKin.findOne({
                    where: {
                        nokPhone: value,
                        deleted: 0
                    }
                }).then(nok => {
                    if (nok) {
                        // console.log('EMP ID ====> ', nok.employeeId);
                        if (nok.employeeId !== +req.body.empID) {
                            // console.log('EMP ID ====> ', nok.employeeId);
                            return Promise.reject('Sorry phone no. already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }
        return true;
    }),
    body('nOKRelation').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z ]+$/.test(value))) {
                return Promise.reject('Relation must be letters only.');
            }
            return true;
        }
        return true;
    }),
    body('noKGender').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z ]+$/.test(value))) {
                return Promise.reject('Gender must be letters only.');
            }
            return true;
        }
        return true;
    }),
    body('noKCardType').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z' ]+$/.test(value))) {
                return Promise.reject('Please enter a valid data for card type.');
            }
            return true;
        }
        return true;
    }),
    body('noKIDCard').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9]+$/.test(value))) {
                return Promise.reject(`Enter a valid data for the selected ID card.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(req.body.noKCardType === undefined || req.body.noKCardType === null || req.body.noKCardType === "")) {
            if (value === undefined || value === null || value === "") {
                return Promise.reject(`Please enter a card number for the selected card type.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (req.body.noKCardType === undefined || req.body.noKCardType === null || req.body.noKCardType === "") {
            if (!(value === undefined || value === null || value === "")) {
                return Promise.reject(`Please select a card type before entering a card number.`);
            }
            return true;
        }
        return true;
    }).custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            let mode = req.body.mode;
            if (mode === 'add') {
                return NextOfKin.findOne({
                    where: {
                        nokIDNo: value,
                        deleted: 0
                    }
                }).then(nokcard => {
                    if (nokcard) {
                        return Promise.reject('Sorry card no. already exist.');
                    }
                    return true;
                });
            } else {
                return NextOfKin.findOne({
                    where: {
                        nokIDNo: value,
                        deleted: 0
                    }
                }).then(nokcard => {
                    if (nokcard) {
                        // console.log('EMP ID ====> ', nokcard.employeeId);
                        if (nokcard.employeeId !== +req.body.empID) {
                            // console.log('EMP ID ====> ', nokcard.employeeId);
                            return Promise.reject('Sorry card no. already exist.');
                        }
                        return true;
                    }
                    return true;
                });
            }
        }
        return true;
    }),

    // Emergency contact
    body('emergenName').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),
    body('emergenRelation').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),
    body('emergenPhone').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[0-9+]+$/.test(value[i]))) {
                    return Promise.reject(`Phone number must be numbers only at row ${i+1} in emergency phone number.`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {

                let mode = req.body.mode;
                if (mode === 'add') {
                    return EmergencyContact.findOne({
                        where: {
                            emergPhone: value[i],
                            deleted: 0
                        }
                    }).then(emrg => {
                        if (emrg) {
                            return Promise.reject('Sorry phone no. already exist at row ' + (i + 1));
                        }
                        // return true;
                    });
                } else {
                    return EmergencyContact.findOne({
                        where: {
                            emergPhone: value[i],
                            deleted: 0
                        }
                    }).then(emrg => {
                        if (emrg) {
                            if (emrg.employeeId !== +req.body.empID) {
                                return Promise.reject('Sorry phone no. already exist at row ' + (i + 1));
                            }
                            // return true;
                        }
                        // return true;
                    });
                }
            }
        }

        return true;
    }),

    body('emergenCardType').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z' ]+$/.test(value[i]))) {
                    return Promise.reject('Please enter a valid data for card type.');
                }
            }
        }
        return true;
    }),
    body('emergenIDCard').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z0-9]+$/.test(value[i]))) {
                    return Promise.reject(`Enter a valid data for the selected ID card.`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        let emergenCardType = req.body.emergenCardType
        for (let i = 0; i < emergenCardType.length; i++) {
            if (!(emergenCardType[i] === undefined || emergenCardType[i] === null || emergenCardType[i] === "")) {
                if (value[i] === undefined || value[i] === null || value[i] === "") {
                    return Promise.reject(`Enter card no. for the selected ID card. at row ${i + 1}`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        let emergenCardType = req.body.emergenCardType
        for (let i = 0; i < emergenCardType.length; i++) {
            if (emergenCardType[i] === undefined || emergenCardType[i] === null || emergenCardType[i] === "") {
                if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                    return Promise.reject(`Please select a card type before entering a card number at row ${i + 1}`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let mode = req.body.mode;
                if (mode === 'add') {
                    return EmergencyContact.findOne({
                        where: {
                            emergIDNo: value[i],
                            deleted: 0
                        }
                    }).then(emergcard => {
                        if (emergcard) {
                            return Promise.reject('Sorry card no. already exist at row ' + (i + 1));
                        }
                        // return true;
                    });
                } else {
                    return EmergencyContact.findOne({
                        where: {
                            emergIDNo: value[i],
                            deleted: 0
                        }
                    }).then(emergcard => {
                        if (emergcard) {
                            if (emergcard.employeeId !== +req.body.empID) {
                                return Promise.reject('Sorry card no. already exist at row ' + (i + 1));
                            }
                            // return true;
                        }
                        // return true;
                    });
                }
            }
        }

        return true;
    }),
], _0auxx2bf49c, _0xsu45b564, mentController.validateData);

// validate dependant and ssnit beneficiaries details
router.post('/validate-depdSBen', [
    body('depdName').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),
    body('depdGender').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}`);
                }
            }
        }
        return true;
    }),
    body('depdDOB').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let date = new Date(value[i]);
                if (date > Date.now()) {
                    return Promise.reject('Sorry date must not be after today\'s date at row ' + (i + 1));
                }
            }
        }
        return true;
    }),
    body('depdRelation').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),
    body('depdCardType').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z' ]+$/.test(value[i]))) {
                    return Promise.reject('Please enter a valid data for card type.');
                }
            }
        }
        return true;
    }),
    body('depdIDCard').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z0-9]+$/.test(value[i]))) {
                    return Promise.reject(`Enter a valid data for the selected ID card at row ${i + 1}`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        let depdCardType = req.body.depdCardType
        for (let i = 0; i < depdCardType.length; i++) {
            if (!(depdCardType[i] === undefined || depdCardType[i] === null || depdCardType[i] === "")) {
                if (value[i] === undefined || value[i] === null || value[i] === "") {
                    return Promise.reject(`Enter card no. for the selected ID card at row ${i + 1}`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        let depdCardType = req.body.depdCardType
        for (let i = 0; i < depdCardType.length; i++) {
            if ((depdCardType[i] === undefined || depdCardType[i] === null || depdCardType[i] === "")) {
                if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                    return Promise.reject(`Please select a card type before entering a card number at row ${i + 1}`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let mode = req.body.mode;
                if (mode === 'add') {
                    return Dependant.findOne({
                        where: {
                            dependIDNo: value[i],
                            deleted: 0
                        }
                    }).then(dependcard => {
                        if (dependcard) {
                            return Promise.reject('Sorry card no. already exist at row ' + (i + 1));
                        }
                    });
                } else {
                    return Dependant.findOne({
                        where: {
                            dependIDNo: value[i],
                            deleted: 0
                        }
                    }).then(dependcard => {
                        if (dependcard) {
                            if (dependcard.employeeId !== +req.body.empID) {
                                return Promise.reject('Sorry card no. already exist at row ' + (i + 1));
                            }
                        }
                    });
                }
            }
        }

        return true;
    }),
    body('benfName').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}, must be letters only.`);
                }
            }
        }
        return true;
    }),
    body('benfPhone').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[0-9+]+$/.test(value[i]))) {
                    return Promise.reject(`Phone number must be numbers only at ${i + 1}.`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {

                let mode = req.body.mode;
                if (mode === 'add') {
                    return SSNITBenfit.findOne({
                        where: {
                            benPhone: value[i],
                            deleted: 0
                        }
                    }).then(benf => {
                        if (benf) {
                            return Promise.reject('Sorry phone no. already exist at row ' + (i + 1));
                        }
                    });
                } else {
                    return SSNITBenfit.findOne({
                        where: {
                            benPhone: value[i],
                            deleted: 0
                        }
                    }).then(benf => {
                        if (benf) {
                            if (benf.employeeId !== +req.body.empID) {
                                return Promise.reject('Sorry phone no. already exist at row ' + (i + 1));
                            }
                        }
                    });
                }
            }
        }

        return true;
    }),
    body('benfGender').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}`);
                }
            }
        }
        return true;
    }),
    body('benfDOB').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                let date = new Date(value[i]);
                if (date > Date.now()) {
                    return Promise.reject('Sorry date must not be after today\'s date at row ' + (i + 1));
                }
            }
        }
        return true;
    }),
    body('benfRelation').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z ]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}, must be letters only`);
                }
            }
        }
        return true;
    }),
    body('percent').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[0-9.]+$/.test(value[i]))) {
                    return Promise.reject(`(${value[i]}) is not valid at row ${i+1}, must be numbers only`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        let total;
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                total += parseFloat(value[i]);
            }
        }
        if (total > 100) {
            return Promise.reject(`Beneficiary percentage cannot exceed 100%`);
        }
        return true;
    }),

    body('benfCardType').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z' ]+$/.test(value[i]))) {
                    return Promise.reject(`Please enter a valid data for card type at row ${i + 1}`);
                }
            }
        }
        return true;
    }),
    body('benfIDCard').custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                if (!(/^[a-zA-Z0-9]+$/.test(value[i]))) {
                    return Promise.reject(`Enter a valid data for the selected ID card at row ${i + 1}`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        let benfCardType = req.body.benfCardType
        for (let i = 0; i < benfCardType.length; i++) {
            if (!(benfCardType[i] === undefined || benfCardType[i] === null || benfCardType[i] === "")) {
                if (value[i] === undefined || value[i] === null || value[i] === "") {
                    return Promise.reject(`Enter card no. for the selected ID card at row ${i + 1}`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        let benfCardType = req.body.benfCardType
        console.log(benfCardType);
        for (let i = 0; i < benfCardType.length; i++) {
            if ((benfCardType[i] === undefined || benfCardType[i] === null || benfCardType[i] === "")) {
                if (!(value[i] === undefined || value[i] === null || value[i] === "")) {
                    return Promise.reject(`Please select a card type before entering a card number at row ${i + 1}.`);
                }
            }
        }
        return true;
    }).custom((value, {
        req
    }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(value[i] === undefined || value[i] === null || value[i] === "")) {

                let mode = req.body.mode;
                if (mode === 'add') {
                    return SSNITBenfit.findOne({
                        where: {
                            benIDNo: value[i],
                            deleted: 0
                        }
                    }).then(benfcard => {
                        if (benfcard) {
                            return Promise.reject('Sorry phone no. already exist at row ' + (i + 1));
                        }
                    });
                } else {
                    return SSNITBenfit.findOne({
                        where: {
                            benIDNo: value[i],
                            deleted: 0
                        }
                    }).then(benfcard => {
                        if (benfcard) {
                            if (benfcard.employeeId !== +req.body.empID) {
                                return Promise.reject('Sorry phone no. already exist at row ' + (i + 1));
                            }
                        }
                    });
                }
            }
        }

        return true;
    }),

], _0auxx2bf49c, _0xsu45b564, mentController.validateSubmit);

router.post('/add-department', [
    body('deptName', 'Please enter a valid name').not().isEmpty().custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z.,:;()& ]+$/.test(value))) {
            return Promise.reject('Department name must be letters only ');
        }
        return true;
    }),
    body('deptDesc', 'Please enter a valid description').not().isEmpty().custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z.,:;()& ]+$/.test(value))) {
            return Promise.reject('Description must be letters only ');
        }
        return true;
    }),
    // body('deptHead').trim().custom((value, {
    //     req
    // }) => {
    //     if (!(value === undefined || value === null || value === "")) {
    //         if (!(/^[0-9]+$/.test(value))) {
    //             return Promise.reject('Invalid department head.');
    //         }
    //         return true;
    //     }
    //     return true;
    // }).custom((value, { req }) => {
    //     if (!(value === undefined || value === null || value === "")) {

    //         return Employee.findOne({
    //             where: {
    //                 id: value,
    //                 deleted: 0
    //             }
    //         }).then(result => {
    //             if (result) {
    //                 if (result.departmentId != req.body.deptId) {
    //                     return Promise.reject('Department head must come from that department.');
    //                 }
    //             }
    //         });
    //     }
    //     return true;
    // }),
    body('deptId').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            return Department.findOne({
                where: {
                    id: value,
                    deleted: 0
                }
            }).then(dept => {
                if (!dept) {
                    return Promise.reject('Data not found for this department!');
                }
                return true;
            });
        }
        return true;
    })
], _0auxx2bf49c, _0xsu45b564, mentController.postAddEditDepartment);

router.post('/appoint-hod', [body('headStatus').custom((value, { req }) => {
            const options = ['Permanent', 'Interim'];
            const options2 = ['Transfer', 'Terminated', 'Others', 'Promotion'];
            return Department.findOne({ where: { id: req.body.deptID, deleted: 0 } }).then(async(result) => {
                if (!result) {
                    return Promise.reject('Sorry department data cannot be found.');
                }
                if (result) {
                    if ((!result.headByEmployeeId) && (!options.includes(value))) {
                        console.log('headByEmployeeId', result.headByEmployeeId, value);
                        return Promise.reject('Sorry status must be either permanent or interim.');
                    }
                }

                if (result) {
                    if ((result.headByEmployeeId) && (!options2.includes(value))) {
                        return Promise.reject('Sorry status must be either Promotion, Transfer, Terminated or Others.');
                    }
                }
                return true;
            })
        }),
        body('employID').custom((value, { req }) => {
            console.log('employID => ', value);
            return Employee.findOne({ where: { id: value, deleted: 0 } }).then(async(result) => {
                if (!result) {
                    return Promise.reject('Sorry employee data cannot be found.');
                }
                if (result) {
                    if (result.departmentId !== +req.body.deptID) {
                        return Promise.reject('Department head must come from that department');
                    }
                }

                return true;
            })
        }),

        body('employIDIN').custom((value, { req }) => {
            if ((value === undefined || value === null || value === "")) {
                return Department.findOne({ where: { id: req.body.deptID, deleted: 0 } }).then(async result => {
                    if (result) {
                        if (result.headByEmployeeId) {
                            return Promise.reject('Please select employee to be HOD');
                        }
                    }

                });
            }
            if (!(value === undefined || value === null || value === "")) {
                return Employee.findOne({ where: { id: value, deleted: 0 } }).then(async result => {
                    if (!result) {
                        return Promise.reject('Sorry employee data cannot be found.');
                    }
                    if (result.departmentId !== +req.body.deptID) {
                        return Promise.reject('Department head must come from that department');
                    }
                })
            }

            return true;
        }),

        body('headStatusIN').custom((value, { req }) => {
            const options = ['Permanent', 'Interim'];
            if ((value === undefined || value === null || value === "")) {
                return Department.findOne({ where: { id: req.body.deptID, deleted: 0 } }).then(async result => {
                    if (result) {
                        if (result.headByEmployeeId) {
                            return Promise.reject('Please select status.');
                        }
                    }

                });
            }
            if (!(value === undefined || value === null || value === "")) {

                return Department.findOne({ where: { id: req.body.deptID, deleted: 0 } }).then(async(result) => {
                    if (!result) {
                        return Promise.reject('Sorry department data cannot be found.');
                    }
                    if (result) {
                        if ((result.headByEmployeeId) && (!options.includes(value))) {
                            return Promise.reject('Sorry status must be either permanent or interim.');
                        }
                    }
                })
            }
            return true;
        }),
        body('appointTerDate').notEmpty().withMessage('Please provide date').custom((value, { req }) => {
            return Company.findOne({ where: { deleted: 0 } }).then(async results => {
                if (results) {
                    let compDate = Math.floor(new Date(results.dateInco) / 1000);
                    let emply = Math.floor(new Date(value) / 1000);
                    if (emply < compDate) {
                        throw new Error('Sorry appointment date cannot be before company incorperation date which is: ' + results.dateInco);
                    }
                }
                console.log('Date =>1 ', Date.now(value), Date.now());

                if (Math.floor(new Date(value) / 1000) > Math.floor(new Date() / 1000)) {
                    // console.log('Date =>2 ', Math.floor(new Date(value) / 1000), Math.floor(new Date() / 1000));
                    throw new Error('Sorry date cannot be after today`s date');
                }

                return true;
            })
        }),
        body('appointTerDateIN').custom((value, { req }) => {
            console.log('Value => ', value);
            if (!(value === undefined || value === null || value === "")) {
                console.log('Value => 2', value);

                return Company.findOne({ where: { deleted: 0 } }).then(async results => {
                    if (results) {
                        let compDate = Math.floor(new Date(results.dateInco) / 1000);
                        let emply = Math.floor(new Date(value) / 1000);
                        if (emply < compDate) {
                            throw new Error('Sorry appointment date cannot be before company incorperation date which is: ' + results.dateInco);
                        }
                    }

                    if (Math.floor(new Date(value) / 1000) > Math.floor(new Date() / 1000)) {
                        throw new Error('Sorry date cannot be after today`s date');
                    }

                    return true;
                })
            }
            return true;

        })
    ],
    _0auxx2bf49c, _0xsu45b564, mentController.appointHOD);

router.get('/getHODHistory/:deptId', [check('deptId').custom((value, { req }) => {
    return Department.findOne({ where: { id: value, deleted: 0 } }).then(async result => {
        if (!result) {
            return Promise.reject('Sorry no data for this department');
        }
    })
})], _0auxx2bf49c, _0xsu45b564, mentController.getHODHistory);


router.get('/departments', _0auxx2bf49c, _0xsu45b564, mentController.getDepartments);

router.get('/department/:deptId', _0auxx2bf49c, _0xsu45b564, mentController.getDept);

router.get('/jobTitleDescs', _0auxx2bf49c, _0xsu45b564, mentController.getJobTitleDesc);

router.post('/add-jobTitle', [
    body('jobPosition', 'Invalid data at job position').not().isEmpty().custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z&.:; ]+$/.test(value))) {
                return Promise.reject('Job position must contain only letters.');
            }
            return true;
        }
        return true;

    }),
    body('keyRespn').not().isEmpty().withMessage('This field is required.'),
    // .custom((value, {
    //     req
    // }) => {
    //     if (!(value === undefined || value === null || value === "")) {
    //         if (!(value.length <= 300)) {
    //             return Promise.reject('Length of text exceeds the required inputs at key duties.');
    //         }
    //         return true;
    //     }
    //     return true;
    // }),
    // .custom((value, {
    //     req
    // }) => {
    //     if (!(value === undefined || value === null || value === "")) {
    //         if (!(/^[a-zA-Z.,:;() ]+$/.test(value))) {
    //             return Promise.reject('This field must contain only letters,.:;().');
    //         }
    //         return true;
    //     }
    //     return true;
    // }),

    body('jobSummary').not().isEmpty().withMessage('Job summary is required'),
    // .isString().custom((value, {
    //     req
    // }) => {
    //     if (!(value === undefined || value === null || value === "")) {
    //         if (!(value.length <= 300)) {
    //             return Promise.reject('Length of text exceeds the required inputs at job summary.');
    //         }
    //         return true;
    //     }
    //     return true;
    // }),
    // .custom((value, {
    //     req
    // }) => {
    //     if (!(value === undefined || value === null || value === "")) {
    //         if (!(/^[a-zA-Z.,:;() ]+$/.test(value))) {
    //             return Promise.reject('This field must contain only letters,.:;().');
    //         }
    //         return true;
    //     }
    //     return true;
    // }),

    body('jobDesc').not().isEmpty().not().isEmpty().withMessage('Job description is required'),
    // .custom((value, {
    //     req
    // }) => {
    //     if (!(value === undefined || value === null || value === "")) {
    //         if (!(value.length <= 300)) {
    //             return Promise.reject('Length of text exceeds the required inputs at job description.');
    //         }
    //         return true;
    //     }
    //     return true;
    // }),
    // .custom((value, {
    //     req
    // }) => {
    //     if (!(value === undefined || value === null || value === "")) {
    //         if (!(/^[a-zA-Z.,:;() ]+$/.test(value))) {
    //             return Promise.reject('This field must contain only letters,.:;().');
    //         }
    //         return true;
    //     }
    //     return true;
    // })
], _0auxx2bf49c, _0xsu45b564, mentController.postEditJobTitle);

router.get('/jobTitleDec/:jobId', _0auxx2bf49c, _0xsu45b564, mentController.getJobTitle);

router.post('/add-salaryStructure', [
    // body('job').not().isEmpty().withMessage('Cannot be empty').custom((value, {
    //     req
    // }) => {
    //     if (!(/^[0-9]+$/.test(value))) {
    //         return Promise.reject('This field must contain only numbers');
    //     }
    //     return true;
    // }).custom((value, { req }) => {
    //     return JobDesc.findOne({ where: { id: value, deleted: 0 } }).then(result => {
    //         if (!result) {
    //             return Promise.reject('This job description does not exist');
    //         }
    //         return true;
    //     });
    // }),
    body('grade').not().isEmpty().withMessage('Cannot be empty').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z0-9 ]+$/.test(value))) {
            return Promise.reject('This field must contain only letters and numbers');
        }
        return true;
    }).custom((value, { req }) => {
        return SalaryStructure.findOne({ where: { grade: value, deleted: 0 } }).then(result => {
            if (result) {
                return Promise.reject('This salary grade already exist');
            }
            return true;
        });
    }),
    body('notch').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9 ]+$/.test(value))) {
                return Promise.reject('This field must contain only letters and numbers');
            }
            return true;
        }
        return true;
    }).custom((value, { req }) => {
        return SalaryStructure.findOne({ where: { notch: value, deleted: 0 } }).then(result => {
            if (result) {
                return Promise.reject('Notch already exist');
            }
            return true;
        });
    }),

    body('basic').not().isEmpty().isFloat().withMessage('Please enter a proper value for gross salary.'),
    body('salaryDesc').not().isEmpty().isString().withMessage('Please enter a proper value for description.'),

    body('allwTitle').not().isEmpty().withMessage('enter a proper value for allowance title.').custom((value, { req }) => {
        for (let i = 0; i < value.length; i++) {
            if (!(/^[a-zA-Z0-9 ]+$/.test(value[i]))) {
                return Promise.reject('Allowance title must be letters and numbers only at row ' + (i + 1));
            }
        }
        return true;
    }),
    // .custom((value, { req }) => {
    //     for (let i = 0; i < value.length; i++) {
    //         return Allowance.findOne({ where: { allwTitle: value[i], deleted: 0 } }).then(result => {
    //             if (result) {
    //                 return Promise.reject('This salary grade already exist');
    //             }
    //         });
    //     }
    //     return true;

    // }),

    body('allwnce').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
], _0auxx2bf49c, _0xsu45b564, mentController.postSaveEditSalaryStructure);

router.post('/edit-salaryStructure', [
    // body('editjob').not().isEmpty().withMessage('Cannot be empty').custom((value, {
    //     req
    // }) => {
    //     if (!(/^[0-9]+$/.test(value))) {
    //         return Promise.reject('This field must contain only numbers');
    //     }
    //     return true;
    // }).custom((value, { req }) => {
    //     return JobDesc.findOne({ where: { id: value, deleted: 0 } }).then(result => {
    //         if (!result) {
    //             return Promise.reject('This job description does not exist');
    //         }
    //         return true;
    //     });
    // }),
    body('editgrade').not().isEmpty().withMessage('Cannot be empty').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z0-9 ]+$/.test(value))) {
            return Promise.reject('This field must contain only letters and numbers');
        }
        return true;
    }).custom((value, { req }) => {
        return SalaryStructure.findOne({ where: { grade: value, deleted: 0 } }).then(result => {
            if (result && (+req.body.salaID !== result.id)) {
                return Promise.reject('This salary grade already exist');
            }
            return true;
        });
    }),
    body('editnotch').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z0-9 ]+$/.test(value))) {
                return Promise.reject('This field must contain only letters and numbers');
            }
            return true;
        }
        return true;
    }).custom((value, { req }) => {
        return SalaryStructure.findOne({ where: { notch: value, deleted: 0 } }).then(result => {
            if (result && (+req.body.salaID !== result.id)) {
                return Promise.reject('Notch already exist');
            }
            return true;
        });
    }),
    body('editbasic').not().isEmpty().isFloat().withMessage('Please enter a proper value for gross salary.'),

    body('editsalaryDesc').custom((value, {
        req
    }) => {
        if (!(value === undefined || value === null || value === "")) {
            if (!(/^[a-zA-Z.,:;() ]+$/.test(value))) {
                return Promise.reject('This field must contain only letters,.:;().');
            }
            return true;
        }
        return true;
    })

], _0auxx2bf49c, _0xsu45b564, mentController.postSaveEditSalaryStructure);

router.post('/postSaveAllowance', [
    body('salStruct').not().isEmpty().withMessage('Cannot be empty').custom((value, {
        req
    }) => {
        if (!(/^[0-9]+$/.test(value))) {
            return Promise.reject('This field must contain only numbers');
        }
        return true;
    }).custom((value, { req }) => {
        return JobDesc.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('This salary structure does not exist');
            }
            return true;
        });
    }),
    body('allwTitle').not().isEmpty().withMessage('Cannot be empty').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z0-9 ]+$/.test(value))) {
            return Promise.reject('This field must contain only letters and numbers');
        }
        return true;
    }).custom((value, { req }) => {
        return Allowance.findOne({ where: { allwTitle: value, deleted: 0 } }).then(result => {
            if (result && (+req.body.salStruct === result.salarystructureId) && req.body.allwMode === 'add') {
                return Promise.reject('An allowance for this salary grade already exist.');
            }
            return true;
        });
    }),
    body('amount').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.')

], _0auxx2bf49c, _0xsu45b564, mentController.postSaveAllowance);

router.post('/postSaveTax', [
    body('miniW').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('nextOneAmt').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('nextOneRate').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('nextTwoAmt').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('nextTwoRate').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('nextThreeAmt').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('nextThreeRate').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('nextFourAmt').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('nextFourRate').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('exceedAmt').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('exceedRate').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
], _0auxx2bf49c, _0xsu45b564, mentController.postSaveTax);

router.post('/postSaveSSNIT', [
    body('t1').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.'),
    body('t2').not().isEmpty().isFloat().withMessage('Please enter a proper value for amount.')

], _0auxx2bf49c, _0xsu45b564, mentController.postSaveSSNIT);

router.post('/postSaveLeaveType', [
    body('leaveType').not().isEmpty().custom((value, { req }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('This field must contain only letters');
        }
        return true;
    }).custom((value, { req }) => {
        return LeaveType.findOne({ where: { leaveType: value, deleted: 0 } }).then(result => {
            console.log('req.body.leaveType', req.body.leaveID);
            if (result && (req.body.leaveType.toUpperCase() === result.leaveType.toUpperCase()) && req.body.leaveMode === 'add') {
                return Promise.reject('This Leave type already exist.');
            }
            return true;
        });
    }),

    body('genderbased').not().isEmpty().custom((value, { req }) => {
        if (!(/^[a-zA-Z]+$/.test(value))) {
            return Promise.reject('This field must contain only letters');
        }
        return true;
    }),

    body('carryon').not().isEmpty().custom((value, { req }) => {
        if (!(+value == 0 || +value == 1)) {
            return Promise.reject('This field must contain only letters');
        }
        return true;
    }),

    body('nofdays').not().isEmpty().custom((value, { req }) => {
        if (!(/^[0-9]+$/.test(value))) {
            return Promise.reject('This field must contain only letters');
        }
        return true;
    }),
    body('leaveDesc').not().isEmpty()
    .custom((value, { req }) => {
        return LeaveType.findOne({ where: { leaveType: value, deleted: 0 } }).then(result => {
            if (result && (+req.body.leaveDesc.toUpperCase() === result.description.toUpperCase()) && req.body.leaveMode === 'add') {
                return Promise.reject('An Leave type description already exist.');
            }
            return true;
        });
    })
], _0auxx2bf49c, _0xsu45b564, mentController.postSaveLeaveType)

router.get('/delete-salary/:salaryId', _0auxx2bf49c, _0xsu45b564, mentController.deleteSalaryStruct);

router.get('/delete-allowance/:allwId', _0auxx2bf49c, _0xsu45b564, mentController.deleteAllowance);

router.get('/salaryStructures', _0auxx2bf49c, _0xsu45b564, mentController.getSalaryStructure);

router.get('/getEmployee/:emplyId', _0auxx2bf49c, mentController.getEmployee);

router.get('/countries', mentController.getCountries);

router.get('/getLeaveTypes', _0auxx2bf49c, mentController.getLeaveTypes);

router.get('/removeLeaveType/:leaveID', _0auxx2bf49c, _0xsu45b564, mentController.removeLeaveType);

router.get('/getLeaves/:leavesID/:emply_id', _0auxx2bf49c, mentController.getLeaves);

router.post('/applyLeave', [
    body('emply_id').not().isEmpty().withMessage('Please select employee').custom((value, { req }) => {
        return Employee.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Please select employee to proceed');
            }
            return true;
        });
    }).custom((value, { req }) => {
        if (!(/^[0-9]+$/.test(value))) {
            return Promise.reject('Please select employee to proceed');
        }
        return true;
    }),
    body('approvedBy').not().isEmpty().withMessage('Please select employee').custom((value, { req }) => {
        return Employee.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Please select employee to proceed');
            }
            return true;
        });
    }).custom((value, { req }) => {
        if (!(/^[0-9]+$/.test(value))) {
            return Promise.reject('Please select employee to proceed');
        }
        return true;
    }),

    body('leave_id').not().isEmpty().withMessage('Please select employee').custom((value, { req }) => {
        const id = value.split('_');
        return LeaveType.findOne({ where: { id: id[0], deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Please select leave type to proceed');
            }
            return true;
        });
    }).custom((value, { req }) => {
        const id = value.split('_');
        if (!(/^[0-9]+$/.test(id[0]))) {
            return Promise.reject('Please select leave type to proceed');
        }
        return true;
    }),

    body('fromDate').not().isEmpty().withMessage('Please provide from date').isDate().withMessage('Please provide valid date').custom((value, { req }) => {
        const fr = Math.floor(new Date(value) / 1000);
        const to = Math.floor(new Date(req.body.toDate) / 1000);
        if (fr > to) {
            return Promise.reject('From date cannot be more than to date');
        }
        return true;

    }),

    body('toDate').not().isEmpty().withMessage('Please provide from date').isDate().withMessage('Please provide valid date').custom((value, { req }) => {
        const fr = Math.floor(new Date(value) / 1000);
        const to = Math.floor(new Date(req.body.toDate) / 1000);
        if (to < fr) {
            return Promise.reject('To date cannot be less than from date');
        }
        return true;
    }),

    body('reason').custom((value, { req }) => {
        const mesg = genfunc.validateLeave(req.body);
        // console.log('log1 ====> ', mesg);
        if (mesg) {
            // console.log('log2 ====> ', mesg);
            return Promise.reject(mesg);
        }
        return true;
    })

], _0auxx2bf49c, mentController.applyLeave);

router.get('/getAllLeaves', _0auxx2bf49c, mentController.getAllLeaves);


router.post('/approveReLeave', [body('remark').not().isEmpty().withMessage('Remark is rquired'), body('leaveAppID').not().isEmpty().withMessage('Something went wrong, try again').custom((value, { req }) => {
        if (!(/^[0-9]+$/.test(value))) {
            return Promise.reject('Please select leave type to proceed');
        }
        return true;
    }).custom((value, { req }) => {
        return Leaves.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Something went wrong, try again');
            }
            return true;
        });
    }),

    body('statusLev').custom((value, { req }) => {
        return Leaves.findAll({
            where: { deleted: 0, employeeId: req.body.emID, status: 'Approved' }
        }).then(getLeaveStatus => {
            if (getLeaveStatus) {
                for (let i = 0; i < getLeaveStatus.length; i++) {
                    let date = Math.floor(new Date());
                    let from = Math.floor(new Date(getLeaveStatus[i].from));
                    let to = Math.floor(new Date(getLeaveStatus[i].to));
                    console.log('In loop get ==>', req.body.emID);

                    if ((date >= from) && (date <= to) && (value === 'Approved')) {
                        console.log('In if get ==>', req.body.emID);
                        return Promise.reject('Sorry employee is already on leave, approve this leave when the current leave is exhausted');
                    }
                }
            }
            return true;

        });

    })
], _0auxx2bf49c, mentController.postApproveReLeave);

router.get('/getDeleteEmploy/:id', [check('id').custom((value, { req }) => {
    return Department.findOne({ where: { headByEmployeeId: value, deleted: 0 } }).then(async result => {
        if (result) {
            return Promise.reject(`Sorry you cannot remove or terminate this employee since he/she is the current head of the ${result.deptName} department`);
        }
        // console.log('ID ==> ', value, req.user.currentUserEmployeeId);

        if (+value == req.user.currentUserEmployeeId) {
            // console.log('ID ==> ', value, req.user.currentUserEmployeeId);
            return Promise.reject('Sorry you cannot remove or terminate yourself since you are the login user, use a different account to do so.');
        }

        return true;
    })
})], _0auxx2bf49c, _0xsu45b564, mentController.getDeleteEmploy);

router.get('/getAllDeptHead', _0auxx2bf49c, mentController.getAllDeptHead);

router.get('/deleteLeaveApply/:leaveId', [check('leaveId').not().isEmpty().withMessage('No leave to delete').isNumeric().withMessage('Leave Id must be numbers only').custom((value, { req }) => {

    return Leaves.findOne({ where: { id: value, deleted: 0 } }).then(result => {
        if (!result) {
            return Promise.reject('No leave exxt!!');
        }
    })
})], _0auxx2bf49c, mentController.deleteLeaveApply);

router.get('/getDeptEmployees/:deptId', _0auxx2bf49c, mentController.getDeptEmployees);

router.get('/getShifts', _0auxx2bf49c, _0xsu45b564, mentController.getShifts);

router.post('/add-shift', [

    body('shiftName').notEmpty().withMessage('Provide shift name').custom((value, { req }) => {
        if (req.body.shiftMode == 'addShift') {
            return Shift.findOne({ where: { shift_name: value, deleted: 0 } }).then(result => {
                if (result) {
                    return Promise.reject('A shift with this name already exist');
                }
                if (value.toUpperCase() == 'SHIFT' || value.toUpperCase() == 'SHIFTS') {
                    return Promise.reject('Sorry this name is reserved!');
                }

                return true;
            })
        } else {
            return Shift.findOne({ where: { shift_name: value, deleted: 0 } }).then(result => {
                if (result) {
                    if (result.id != req.body.shiftID) {
                        return Promise.reject('A shift with this name already exist');
                    }
                }
                if (value.toUpperCase() == 'SHIFT' || value.toUpperCase() == 'SHIFTS') {
                    return Promise.reject('Sorry this name is reserved!');
                }

                return true;
            })
        }
    }),

    body('startHour').notEmpty().withMessage('Start hour is required'),
    body('startMin').notEmpty().withMessage('Start minute is required'),
    body('endHour').notEmpty().withMessage('End hour is required'),
    body('endMin').notEmpty().withMessage('End minute is required'),
    body('shiftDuration').notEmpty().withMessage('Shift duration is required'),
    body('gracePeriod').notEmpty().withMessage('Grace period is required'),

    body('days').notEmpty().withMessage('Select a day at least.').custom((value, { req }) => {
        // console.log('value => ', (value));
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        for (let i = 0; i < (value != undefined) ? value.length : 0; i++) {
            // if (!(value[1] == undefined || value[i] == null || value[i] == '')) {
            if (!days.includes(value[i])) {
                return Promise.reject('Sorry wrong day selected');
                // }
            }
        }
        return true;
    }),

    body('break').custom((value, { req }) => {

        if (!(value === undefined || value === null || value === '')) {
            if (req.body.breakHour === undefined || req.body.breakHour === null || req.body.breakHour === '') {
                return Promise.reject('Break hour is required');
            }

            if (req.body.breakMin === undefined || req.body.breakMin === null || req.body.breakMin === '') {
                return Promise.reject('Break minute is required');
            }

            if (req.body.breakDuraMin === undefined || req.body.breakDuraMin === null || req.body.breakDuraMin === '') {
                return Promise.reject('Break duration is required');
            }
        }

        return true

    }),

    body('overtime').custom((value, { req }) => {

        if (!(value === undefined || value === null || value === '')) {
            if (req.body.overtimeHour === undefined || req.body.overtimeHour === null || req.body.overtimeHour === '') {
                return Promise.reject('Overtime hour is required');
            }

            if (req.body.overtimeMin === undefined || req.body.overtimeMin === null || req.body.overtimeMin === '') {
                return Promise.reject('Overtime minute is required');
            }

            if (req.body.overtimeRate === undefined || req.body.overtimeRate === null || req.body.overtimeRate === '') {
                return Promise.reject('Rate is required');
            }
        }

        return true

    }),
], _0auxx2bf49c, _0xsu45b564, mentController.addShift);

router.get('/getShift/:id', _0auxx2bf49c, _0xsu45b564, mentController.getShift);

router.get('/getNoShiftEmployees', _0auxx2bf49c, _0xsu45b564, mentController.getNoShiftEmployees);

router.post('/add-employee-toshift', [body('selectID').notEmpty().withMessage('Please select a shift').custom((value, { req }) => {
        return Shift.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Selected shift does not exist.');
            }

            return true;
        })
    }),

    body('adEmploy').notEmpty().withMessage('Please select at least').custom((value, { req }) => {

        // console.log('adEmploy =>', value);
        const val = [];
        if (!Array.isArray(value)) {
            val.push(value);
            value = val;
        }
        for (let i = 0; i < value.length; i++) {
            return Employee.findOne({ where: { id: value, deleted: 0 } }).then(result => {
                if (!result) {
                    return Promise.reject('Sorry one or more employees from the selection not found');
                }
                if (result) {
                    if (result.shiftId) {
                        return Promise.reject(`Sorry ${result.title } ${result.fName} already belongs to a shift`);
                    }
                }
            })
        }
        return true;
    })
], _0auxx2bf49c, _0xsu45b564, mentController.addEmployeeToShift);

router.get('/remove-from-shift/:shifID/:employID', [check('shifID').notEmpty().withMessage('Shift data is wrong.').custom((value, { req }) => {
    return Shift.findOne({ where: { id: value, deleted: 0 } }).then(result => {
        if (!result) {
            return Promise.reject('Sorry shift does not exist.');
        }

        return true;
    })
}), check('employID').notEmpty().withMessage('Employee data is wrong.').custom((value, { req }) => {
    return Employee.findOne({ where: { id: value, deleted: 0 } }).then(result => {
        if (!result) {
            return Promise.reject('Sorry employee does not exist.');
        }

        return true;
    })
})], _0auxx2bf49c, _0xsu45b564, mentController.removeEmplyFromShift);

router.post('/remove-all', [], _0auxx2bf49c, _0xsu45b564, mentController.removeAll);

router.get('/get-emp-underDept/:deptId', [check('deptId').notEmpty().withMessage('Dept data is required').custom((value, { req }) => {
    return Department.findOne({ where: { id: value, deleted: 0 } }).then(result => {
        if (!result) {
            return Promise.reject('Sorry dept not found.');
        }

        return true;
    });
})], _0auxx2bf49c, _0xsu45b564, mentController.getEmpUnderDept);

router.post('/add-event', [body('eventName').notEmpty().withMessage('Holiday name is required.').custom((value, { req }) => {
        return HolidayEvents.findOne({ where: { eventName: value, deleted: 0 } }).then(result => {
            if (result) {
                if (req.body.eventMode == 'add') {
                    if (new Date(req.body.eventDate).getFullYear() == new Date(result.date).getFullYear()) {
                        return Promise.reject('Holiday name already exist.');
                    }
                }
            }
            if (result) {

                if (req.body.eventMode == 'edit') {
                    // console.log('==> ', result.id, req.body.eventId);
                    if (result.id !== +req.body.eventId && (new Date(result.date).getFullYear() == new Date().getFullYear())) {
                        return Promise.reject(`Holiday name already exist under the year ${new Date().getFullYear()}.`);
                    }
                }
            }
            return true;
        })
    }),
    body('eventDate').notEmpty().withMessage('Holiday date is required.').custom((value, { req }) => {
        return HolidayEvents.findOne({ where: { date: value, deleted: 0 } }).then(result => {
            if (result) {
                if (req.body.eventMode == 'add') {
                    return Promise.reject('Holiday date already exist.');
                }
            }
            if (result) {

                if (req.body.eventMode == 'edit') {
                    if (result.id !== req.body.eventId || (new Date(result.date).getFullYear() == new Date().getFullYear())) {
                        return Promise.reject(`Holiday date already exist under the year ${new Date().getFullYear()}.`);
                    }
                }
            }
            return true;
        })
    }),

    body('occur').notEmpty().withMessage('Holiday occurrence is required.').custom((value, { req }) => {
        const elem = [0, 1];
        if (!elem.includes(+value)) {
            return Promise.reject('Wrong value for holiday occurance')
        }
        return true;
    })

], _0auxx2bf49c, _0xsu45b564, mentController.AddEvent);

router.get('/all-calendar-events', _0auxx2bf49c, _0xsu45b564, mentController.getAllCalendarEvents);

router.get('/getpast-years-events/:year', _0auxx2bf49c, _0xsu45b564, mentController.getPastYearsEvents)

router.post('/calibrate-events', [body('calibrateEvent').notEmpty().withMessage('Please select a holiday.').custom((value, { req }) => {
    const year = new Date().getFullYear();

    // console.log('Value => ', Array.isArray(value));
    const val = [];
    if (!Array.isArray(value)) {
        val.push(value);
        value = val;

    }
    // console.log('Value => ', value);

    for (let i = 0; i < value.length; i++) {
        // console.log('value[i]>', +value[i]);
        return HolidayEvents.findOne({ where: { id: +value[i], deleted: 0 } }).then(async result => {
            // console.log('Result => ', result);

            if (!result) {
                return Promise.reject(`Sorry holiday id ${value[i]} does not exist`);
            }

            if (result) {
                let date = `${year}-${moment(result.date).format('MM-DD')}T00:00:00.000Z`;
                // console.log('Date => ', date);
                const events = await HolidayEvents.findAndCountAll({ where: { date: date, eventName: result.eventName, deleted: 0 } });
                // console.log('Count => ', events.count);
                if (events.count >= 1) {
                    return Promise.reject(`Sorry ${result.eventName} on ${moment(result.date).format('DD-MM-YYYY')} has alredy been calibrated for this year`);
                }
            }
        });
    }
    return true;

})], _0auxx2bf49c, _0xsu45b564, mentController.calibrateEvents);

// Attendance

router.get('/get-attendbydate/:date', [check('date').isDate().withMessage('Proper date is required.').custom((value, { req }) => {
    let today = moment(new Date()).format('DD-MM-YYYY');
    today = Math.floor(today / 1000);
    let date = Math.floor(new Date(value) / 1000);
    if (date > today) {
        return Promise.reject("Sorry date must not be above today's date");
    }
    return true;
})], _0auxx2bf49c, _0xsu45b564, mentController.getAttendByDate)

// not needed except for pdf generating
router.post('/getAttendReport', [
    body('repFromDate').not().isEmpty().withMessage('Please select from date').isDate().withMessage('From date is not valid'),
    body('repToDate').not().isEmpty().withMessage('Please select to date').isDate().withMessage('To date is not valid').custom((value, { req }) => {

        let from = Math.floor(new Date(req.body.repFromDate) / 1000);
        let to = Math.floor(new Date(value) / 1000);
        if (from > to) {
            return Promise.reject("Please select date in a correct order");
        }
        return true;
    }),

    body('getdept').custom((value, { req }) => {
        console.log('getdept =====> ', value);

        if (value) {
            console.log('getdept2 =====> ', value);
            return Department.findOne({ where: { id: value, deleted: 0 } }).then(result => {

                if (!result) {
                    return Promise.reject('Selected department dose not exist!');
                }
            });
        }
        return true;
    })
], _0auxx2bf49c, _0xsu45b564, mentController.postAttendReport)

router.post('/get-attend-report-bydate', [
    body('repFromDate').not().isEmpty().withMessage('Please select from date').isDate().withMessage('From date is not valid'),
    body('repToDate').not().isEmpty().withMessage('Please select to date').isDate().withMessage('To date is not valid').custom((value, { req }) => {

        let from = Math.floor(new Date(req.body.repFromDate) / 1000);
        let to = Math.floor(new Date(value) / 1000);
        if (from > to) {
            return Promise.reject("Please select date in a correct order");
        }
        return true;
    }),

    body('getdept').custom((value, { req }) => {
        console.log('getdept =====> ', value);

        if (value) {
            console.log('getdept2 =====> ', value);
            return Department.findOne({ where: { id: value, deleted: 0 } }).then(result => {

                if (!result) {
                    return Promise.reject('Selected department dose not exist!');
                }
            });
        }
        return true;
    })
], _0auxx2bf49c, _0xsu45b564, mentController.postAttendReportByDate)

// router.get('/getAttendMarked/:date', _0auxx2bf49c, _0xsu45b564, mentController.getAttendMarked);
router.get('/getEmplyAttendMarked/:from/:to/:id', [
    check('from').isDate().withMessage('Date is not valid'),
    check('to').isDate().withMessage('Date is not valid').custom((value, { req }) => {
        let from = Math.floor(new Date(req.params.from) / 1000);
        let to = Math.floor(new Date(value) / 1000);
        if (from > to) {
            return Promise.reject("Date order not correct.");
        }
        return true;
    }).custom((value, { req }) => {
        console.log('Date => ', value);
        return Employee.findOne({ where: { id: req.params.id, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Employee not exist.');
            }
            return true;
        });
    }),
], _0auxx2bf49c, _0xsu45b564, mentController.getEmplyAttendMarked)

router.get('/getAttendReportPDF/:from/:to', _0auxx2bf49c, _0xsu45b564, mentController.postAttendReport);

router.post('/clockMan', [body('date').notEmpty().withMessage('Date is required').custom((value, { req }) => {
        const today = Math.floor(new Date() / 1000);
        const date = Math.floor(new Date(value) / 1000);
        return SystemSettings.findOne({ where: { key: 'Manual Clocking' } }).then(result => {
            if (result) {
                const getPeriod = +result.value * 3600;
                const diff = today - date;
                console.log('Data => ', getPeriod, diff);
                if (diff > getPeriod) {
                    return Promise.reject(`Manual clocking is allowed beyond ${result.value} hours`);
                }
            }
            if (date > today) {
                return Promise.reject(`Date cannot be more than today's date`);
            }
            return true;
        });
    }),
    body('getterminals').notEmpty().withMessage('Terminal is required').custom((value, { req }) => {
        return Terminal.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Sorry terminal not exist');
            }
            return true;
        })
    }),
    body('unpunched').notEmpty().withMessage('Employee is required').custom((value, { req }) => {
        return Employee.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Sorry employee not exist');
            }

            if (result) {
                return TerminalUser.findOne({
                    where: { terminalId: req.body.getterminals, employeeId: value, deleted: 0 },
                    include: [{
                        model: Employee,
                        where: {

                            deleted: 0,
                        },
                        require: false,
                    }]
                }).then(result => {
                    if (!result) {
                        return Promise.reject('Sorry employee dose belong to this terminal.');
                    }

                    if (!result.employee.shiftId) {
                        return Promise.reject('Sorry employee is not on any shift.');
                    }
                })
            }
            return true;
        })
    }),

    body('approveby').notEmpty().withMessage('Approved by is required').custom((value, { req }) => {
        return Employee.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Sorry employee not exist');
            }

            if (result) {
                return Department.findOne({ where: { headByEmployeeId: value, deleted: 0 } }).then(result => {
                    if (!result) {
                        return Promise.reject('Sorry employee is not HOD');
                    }
                })
            }
            return true;
        })
    }),

    body('fillform').custom(async(value, { req }) => {
        if (req.files.fillform == undefined) {

        }
        if (req.files.fillform !== undefined) {
            const file = req.files.fillform[0];
            // console.log('File => ', req.files.fillform[0]);

            const checkFile = (await genfunc.checkFiles(file)).toString();
            if (checkFile == 'type') {
                // console.log('Type => ', checkFile);

                return Promise.reject('Sorry file must be image type or PDF only');
            }

            if (checkFile == 'size') {
                // console.log('size => ', checkFile);

                return Promise.reject('Sorry file size exceeds 1mb.');
            }
        }
        return true
    }),
    body('session').notEmpty().withMessage('Session by is required').custom((value, { req }) => {
        const array = ['CI', 'CO', 'A'];
        if (!array.includes(value)) {
            return Promise.reject('Wrong value selected for session');
        }
        if (value == 'CI' && req.body.clockInTime == undefined) {
            return Promise.reject('Provide time for clock in');
        }

        if (value == 'CO' && req.body.clockOutTime == undefined) {
            return Promise.reject('Provide time for clock out');
        }
        if (value == 'A' && req.body.clockInTime == undefined && eq.body.clockOutTime == undefined) {
            return Promise.reject('Provide time for clock in and out');
        }
        return true
    }),

    body('clockInTime').custom((value, { req }) => {
        const array = ['CI', 'CO', 'A'];
        if (value !== undefined) {
            console.log('clockInTime => ', value);

            return TerminalUser.findOne({
                where: { terminalId: req.body.getterminals, employeeId: req.body.unpunched, deleted: 0 },
                include: [{
                    model: Employee,
                    where: {
                        shiftId: {
                            [Op.ne]: null
                        },
                        deleted: 0,
                    },
                    require: false,
                }]
            }).then(async result => {
                console.log('Result => ', value);

                if (result) {
                    // console.log('Result 2 => ', result);
                    const shiftStartEnd = await genfunc.shiftSE(result.employee.shiftId);
                    if (shiftStartEnd.length === 2) {
                        if (value + ':00' > shiftStartEnd[1]) {
                            // console.log('shiftStartEnd2 => ', shiftStartEnd, value);
                            return Promise.reject('Sorry clock in time cannot be more than shift end time')
                        }
                    }
                    if (shiftStartEnd.length === 0) {
                        return Promise.reject('Sorry shift time, ensure the shift is set properly.')
                    }

                    return PunchData.findOne({
                        where: { punch_date: req.body.date, user_id: result.terminal_user_id, deleted: 0 }

                    }).then(async result2 => {
                        if (result2) {
                            if (result2.punch_time <= shiftStartEnd[1]) {
                                return Promise.reject(`Sorry there is a clock in at ${result2.punch_time} for this employee.`)
                            }
                        }
                    });

                }
            })
        }
        return true
    }),

    body('clockOutTime').custom((value, { req }) => {
        const array = ['CI', 'CO', 'A'];
        if (value !== undefined) {
            console.log('clockOutTime => ', value);
            return TerminalUser.findOne({
                where: { terminalId: req.body.getterminals, employeeId: req.body.unpunched, deleted: 0 },
                include: [{
                    model: Employee,
                    where: {
                        shiftId: {
                            [Op.ne]: null
                        },
                        deleted: 0,
                    },
                    require: false,
                }]
            }).then(async result => {
                console.log('Result => ', value);

                if (result) {
                    // console.log('Result 2 => ', result);
                    const shiftStartEnd = await genfunc.shiftSE(result.employee.shiftId);
                    if (shiftStartEnd.length === 2) {
                        if (value + ':00' < shiftStartEnd[1]) {
                            // console.log('shiftStartEnd2 => ', shiftStartEnd, value);
                            return Promise.reject('Sorry clock out time cannot be less than shift end time')
                        }
                    }
                    if (shiftStartEnd.length === 0) {
                        return Promise.reject('Sorry shift time, ensure the shift is set properly.')
                    }

                    return PunchData.findAll({
                        where: { punch_date: req.body.date, user_id: result.terminal_user_id, deleted: 0 }

                    }).then(async result2 => {
                        // console.log('result2 => ', result2);
                        if (result2) {
                            for (let i = 0; i < result2.length; i++) {
                                if (result2[i].punch_time >= shiftStartEnd[1]) {
                                    return Promise.reject(`Sorry there is a clock out at ${result2[i].punch_time} for this employee.`)
                                }
                            }
                        }
                    });
                }
            })
        }
        return true
    }),

], _0auxx2bf49c, _0xsu45b564, mentController.saveManualClock);

router.post('/report-manager', [body('reportType').notEmpty().withMessage('Report type is required').custom((value, { req }) => {
        const options = ['employees', 'leaves', 'attendance'];

        if (!options.includes(value)) {
            return Promise.reject('Invalid option selected.');
        }
        return true;

    }),
    body('fromDate').custom((value, { req }) => {
        if (req.body.toDate !== '' && value == '' && req.body.subtypeOne !== 'bydate') {
            return Promise.reject('Please provide date.')
        }

        if (req.body.toDate !== '' && value !== '') {
            if (new Date(value) > new Date(req.body.toDate)) {
                return Promise.reject('From date can\'t be more than to date')
            }
        }
        if (value !== '' && new Date(value) > new Date()) {
            return Promise.reject('From date can\'t be more than today\'s date');
        }
        return true;
    }),
    body('toDate').custom((value, { req }) => {
        // console.log('Val => ', value);
        if (value == '' && req.body.fromDate !== '' && req.body.subtypeOne !== 'bydate') {
            return Promise.reject('Please provide date.')
        }

        if (req.body.fromDate !== '' && value !== '') {
            if (new Date(value) < new Date(req.body.fromDate)) {
                return Promise.reject('To date can\'t be less than from date')
            }
        }
        if (value !== '' && new Date(value) > new Date()) {
            return Promise.reject('To date can\'t be more than today\'s date');
        }

        return true;

    })
], _0auxx2bf49c, _0xsu45b564, mentController.reportManager);

router.post('/systemSettings', [
    body('staffIDgen').notEmpty().withMessage('Please select an option').custom((value, { req }) => {
        const expect = ['Auto', 'Manual'];
        if (!expect.includes(value)) {
            return Promise.reject('Option selected is invalid');
        }
        return true;
    }),
    body('amanclock').notEmpty().withMessage('Please select an option').custom((value, { req }) => {
        const expect = ['24', '48', '72'];
        if (!expect.includes(value)) {
            return Promise.reject('Option selected is invalid');
        }
        return true;
    }),
], _0auxx2bf49c, _0xsu45b564, state, mentController.updateSettings);

router.get('/getSettings', _0auxx2bf49c, _0xsu45b564, mentController.getSettings);

router.get('/getTasks', _0auxx2bf49c, mentController.getTasks);

router.post('/add-task', [
    body('taskName').notEmpty().withMessage('Task name is required').custom((value, { req }) => {
    
    return Task.findOne({ where: { taskName: value, deleted: 0 } }).then(result => {
        if (result) {
            if (req.body.taskMode == 'editMode') {
                if (result.id !== +req.body.taskID) {
                    console.log('TAK => ', result.id, req.body.taskID);
                    return Promise.reject('Sorry a task with this name exist 2.');
                }
            }
            else{
                return Promise.reject('Sorry task exist.');
            }
        }
        if (value.toUpperCase() == 'TASK' || value.toUpperCase() == 'TASKS') {
                return Promise.reject('Sorry this name is reserved!');
            }
        if (!(/^[a-zA-Z0-9 ]+$/.test(value))) {
            return Promise.reject('Task name must be letters, numbers only.');
        }
        return true;
        })
    }),
    body('assignTo').notEmpty().withMessage('Employee required').custom((value, { req }) => {
        const asignedTo = (req.user.role == 'STDU') ? req.user.currentUserEmployeeId : value;
        console.log('User =>', asignedTo);
        return Employee.findOne({ where: { id: asignedTo, deleted: 0 } }).then(result => {
            if(!result) {
                return Promise.reject('Sorry employee not found.');
            }
            if (result) {
                if ((result.departmentId !== req.user.deptID) && req.user.role !== 'Admin' && req.user.role !== 'STDU') {
                    return Promise.reject('Sorry employee not found in your department.');
                }
            }
            if(req.user.role == 'STDU'){
                if(req.user.uuid !== value){
                    return Promise.reject('Sorry employee not found.');
                }
            }
            return true;
        })
    }),
    body('dueDate').notEmpty().withMessage('Date required').custom((value, { req }) => {
        const mont = moment(new Date()).format('YYYY-MM-DD');
        const date = Math.floor(new Date(mont) / 1000);
        const dueDate = Math.floor(new Date(value) / 1000);
        // console.log('Data =>', date, value);
        if (dueDate < date) {
            return Promise.reject("Date cannot be less than today's date");
        }
        return true;
    }),
    body('dueDate').notEmpty().withMessage('Description required')
], _0auxx2bf49c, mentController.addTask);

router.post('/add-proogres', [body('taskStatus').custom((value, { req }) => {
    if (!(value === undefined || value === null || value === "")) {
        if (![1].includes(+value)) {
            return Promise.reject("Wrong status");
        }
    }
    return true;
}),
body('progressDescript').notEmpty().withMessage('Description is required').custom((value, { req }) => {
    return Task.findOne({ where: { id: req.body.taskProID } }).then(result => {
        if (!result) {
            return Promise.reject("Task not found.");
        }
        return true;
    })
    })
], _0auxx2bf49c, mentController.addProgress)

router.get('/del-task/:taskId', _0auxx2bf49c, mentController.delTask);

router.get('/view-task-progress/:taskId', _0auxx2bf49c, mentController.viewTaskProgress)


module.exports = router;
// exports.routes = router;
// exports.products = products;