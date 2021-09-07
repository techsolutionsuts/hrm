const fileHandler = require('../util/file');
const path = require('path');
const fs = require('fs');
const base_url = require('../util/base-url');
//'Basic ' + btoa(process.env.TERMINAL1 + ':' + process.env.TERMINAL2); not needed for anything
const axios = require('axios');
// axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.AUTH_KEY}`

const crypto = require('crypto');

const Login = require('../util/call');
const FormData = require('form-data');
const moment = require('moment');

const parseurl = require('parseurl');

const throwError = require('./error');
const genFunct = require("../general-func/general-func");
const pushData = require('../data/push.js');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {
    validationResult
} = require('express-validator/check');

const User = require('../models/user-model');
const Company = require('../models/company-model');
const JobDesc = require('../models/jobDesc-model');
const Department = require('../models/department-model');
const SalaryStructure = require('../models/salaryStructure-model');
const Employee = require('../models/employee-model');

const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');
const Terminal = require('../models/terminal-model');
const PunchData = require('../models/punchData-model');
const TerminalUser = require('../models/terminal_users-model');
const LinkedTermUserHitory = require('../models/linkedTermUserHitory-model');
const { Op, Sequelize } = require('sequelize');
const SystemSettings = require('../models/system-settings-model');
const LeaveType = require('../models/leavetype-model');
const Shift = require('../models/shift-model');
const Leaves = require('../models/leaves-model');
// const uuid8 = require('uuid');

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

exports.getCompanySetup = async(req, res, next) => {
    const hasInternet = await genFunct.pingForInternet(req)
    if (hasInternet) {
        try {
            // console.log('here');
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            // console.log('It it here ======>');

            if (req.user) {
                if (req.user.role === 'Admin') {
                    // await genFunct.log(req, ['Company setup has been tampered', (await this.pathname(req)).toString()]);

                    return res.redirect(`${process.env.MENT}/index`);
                } else {
                    // await genFunct.log(req, ['Company setup has been tampered', (await this.pathname(req)).toString()]);
                    return res.redirect('company-setup');
                }
            }
            // await genFunct.log(req, ['Company setup has been tampered', (await this.pathname(req)).toString()]);
            console.log('Let see what here ====> ');
            return res.render('company-setup', {
                path: '/',
                pageTitle: 'Company Setup',
                errorMessage: message,
                oldInput: {
                    email: '',
                    password: ''
                },
                validationErrors: [], // or [{param: 'email', param: 'password'}]
            });
        } catch (err) {
            console.log('Lgs =====> ', err);
            // throwError.throwError(err);
        }

    }else{
        // console.log('Internet NOT Available');
        await fileHandler.writeLog(`\n${new Date() } => Internet NOT Available for Remote update for company setup`)
        return res.render('conn-lost', { path: 'conn-lost' });
    }

}
exports.postCompany = async(req, res, next) => {
    try {
        const image = req.files;
        const errors = validationResult(req);
        if (!image) {
            if (req.xhr) {
                return res.status(422).json({
                    path: '/create-company',
                    pageTitle: 'Add Company',
                    errorMessage: 'Please provide company logo',
                    validationErrors: [{ msg: "Please provide company logo", param: "company_logo", value: "" }],
                });
            }
        }
        const imageUrl = image['company_logo'][0].path;
        if (!errors.isEmpty()) {
            if (imageUrl) {
                fileHandler.deleteFile(imageUrl);
            }
            // if (req.xhr) {
            return res.status(422).json({
                path: '/create-company',
                pageTitle: 'Add Company',
                image: imageUrl,
                errorMessage: errors.array()[0].msg,

                validationErrors: errors.array(),
            });
            // }
        }

        let companyData = {
            dateInco: req.body.date,
            name: req.body.company_name,
            tin: req.body.tin,
            regNum: req.body.reg_number,
            compType: req.body.company_type,
            ceo: req.body.direct,
            phone: req.body.contact,
            email: req.body.email,
            region: req.body.region,
            city: req.body.city,
            digitalAdd: req.body.dac,
            address: req.body.address,
            image: imageUrl,
            staff_ID_gene: req.body.staff_id,
            company_initials: req.body.company_ini,
            website: req.body.website,
            totalEmp: 0,
            totalDept: 0,
            lastAccess: new Date()
        }

        const url = base_url.BASE_URL + "/endpoint/get-license-update-data";
        axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.AUTH_KEY}`
        await axios.post(url, companyData).then(async function(response) {
            if (response) {
                if (response.status == 200) {
                    // console.log('response.data ====>', response.data.results);
                    const company = await new Company(companyData);
                    await company.save();

                    await fileHandler.writeText({ os_bits: response.data.results, os_x86: response.data.iat, os_64: response.data.eat, os_count: response.data.os_count });
                    if (req.body.compMode === 'setup' && !req.session.isLoggedIn) {
                        console.log('In Continue');
                        Company.findOne().then((allComp) => {
                            console.log('Created Company.');
                            return res.status(201).json({
                                message: 'continue',
                                data: allComp,
                            });
                        });
                    } else {
                        Company.findOne().then((allComp) => {
                            console.log('In Ok');
                            console.log('Created Company.');
                            return res.status(201).json({
                                message: 'ok',
                                data: allComp,
                            });
                        });
                    }
                }
            }
        }).catch(function(error) {
            console.log('error.request ====>', error);
            if (error.response.status == 422) {
                console.log('error.request ====>', error.response.data);
                return res.status(422).json({
                    errorMessage: error.response.data.data[0].msg,
                    validationErrors: error.response.data.data,
                });
            } else {
                console.log('Error ====>', error.response.data);
                return res.status(500).json({ error: "Sorry something went wrong, try again" });
            }
        });
    } catch (err) {
        console.log('Error in catch', err);
        return res.status(500).json({ error: "Sorry something went wrong, try again" });

    }
};

exports.getCompany = async(req, res, next) => {

    try {
        let staffID = await genFunct.getStaffID();
        const comp = await Company.findOne({ where: { deleted: 0 } });
        if (comp) {
            // console.log('Staff IDs ==> ', genFunct.getStaffID());
            await genFunct.log(req, ['Accessed company list', (await this.pathname(req)).toString()]);

            res.status(200).json({
                comp: comp,
                staffID: staffID,
                pageTitle: 'Company List',
                path: '/companys',
            });
        } else {
            await genFunct.log(req, ['Accessed company list', (await this.pathname(req)).toString()]);

            res.status(200).json({
                comp: 0,
                pageTitle: 'Company List',
                path: '/companys',
            });
        }

    } catch (err) {
        console.log('Error from getcompanies ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.getCompProfile = async(req, res, next) => {

    try {
        let staffID = await genFunct.getStaffID();
        const comp = await Company.findOne({ where: { deleted: 0 } });
        const depts = await Department.findAndCountAll({ where: { deleted: 0 } });
        const employees = await Employee.findAndCountAll({ where: { deleted: 0 } });
        const terminals = await Terminal.findAndCountAll({ where: { deleted: 0 } });
        const jobs = await JobDesc.findAndCountAll({ where: { deleted: 0 } });
        const salaries = await SalaryStructure.findAndCountAll({ where: { deleted: 0 } });
        const users = await User.findAndCountAll({ where: { deleted: 0 } });
        if (comp) {
            let countDept = 0;
            let countEmp = 0;
            let data = {
                    id: comp.id,
                    name: comp.name,
                    ceo: comp.ceo,
                    initials: comp.company_initials,
                    phone: comp.phone,
                    email: comp.email,
                    website: comp.website,
                    compImage: comp.image,
                    dateInco: moment(comp.dateInco).format('DD-MM-YYYY'),
                    countDept: (depts) ? depts.count : countDept,
                    countEmp: (employees) ? employees.count : countEmp,
                    os_x86: (await fileHandler.readText()).os_x86,
                    os_count: (await fileHandler.readText()).os_count,
                    os_64: (await fileHandler.readText()).os_64,
                    ternumb: terminals.count,
                    jobs: jobs.count,
                    salaries: salaries.count,
                    users: users.count
                }

            // await fileHandler.writeText({ os_bits: (await fileHandler.readText()).os_bits, os_x86: data.os_x86, os_64: data.os_64, os_count: data.os_count });
            // console.log('Read Text => ', await fileHandler.readText());
            // await genFunct.systemState(req);
            // await genFunct.runSchedule(req, false, 'pulldata');
            
            // let [id] = employees;
            await genFunct.log(req, ['View company profile', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                data: data,
                staffID: staffID,
                pageTitle: 'Company List',
                path: '/companys',
            });
        } else {
            await genFunct.log(req, ['View company profile', (await this.pathname(req)).toString()]);

            res.status(200).json({
                data: 0,
                pageTitle: 'Company List',
                path: '/companys',
            });
        }

    } catch (err) {
        console.log('Error from getcompanies ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.getCheckPoint = async(req, res, next) => {

    try {
        let allData = [];
        const comp = await Company.findAndCountAll({ where: { deleted: 0 } });
        await allData.push(comp);
        const jobDesc = await JobDesc.findAndCountAll({ where: { deleted: 0 } });
        await allData.push(jobDesc);
        const department = await Department.findAndCountAll({ where: { deleted: 0 } });
        await allData.push(department);
        const salary = await SalaryStructure.findAndCountAll({ where: { deleted: 0 } });
        await allData.push(salary);
        let orNot = []

        for (let i = 0; i < allData.length; i++) {
            await orNot.push(allData[i].count)
        }
        res.status(200).json({
            data: orNot
        });

    } catch (err) {
        console.log('Error from checkpoint ===>', err);
        msg = 'Sorry something went wrong in checking company septup process, please try again or kindly contact system admin.';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.setup = async(req, res, next) => {
    try {
        const company = await Company.findOne({ where: { deleted: 0 } });
        const user = await User.findAll();
        console.log('company-setup =====> ');
        if (!company) {
            return res.render('company-setup', {
                pageTitle: 'Setup Company',
                path: `/${process.env.MENT}/index`,
                user: [],
                userDetails: [],
            });
        }
        console.log('setup =====> ');

        return res.redirect('/');
    } catch (err) {
        console.log(err);
    }
}

exports.create_user = async(req, res, next) => {
    try {
        const user = await User.findOne({ where: { deleted: 0 } });
        if (!user) {
            return res.render('create-user', {
                pageTitle: 'Create User',
                path: 'create-user',
                user: [],
                userDetails: [],
            });

        }
        if (req.session.isLoggedIn) {
            await genFunct.log(req, ['create-user route visited', (await this.pathname(req)).toString()]);
            return res.redirect('/');

        }

    } catch (err) {
        console.log(err);
    }
}

exports.createUser = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }
        const user = await new User({
            name: req.body.fullname,
            email: req.body.nuseremail,
            password: bcrypt.hashSync(req.body.nuserpassword, 12),
            role: 'Admin',
            // uuid: uuid8()
        })
        const saveUser = await user.save();
        if (saveUser) {
            const compny = await Company.findOne({ where: { deleted: 0 } });
            if (compny) {
                let saveSettings = new SystemSettings({ key: 'Staff ID generation', value: compny.staff_ID_gene, userId: saveUser.id});
                await saveSettings.save();
            } else {
                let saveSettings = new SystemSettings({ key: 'Staff ID generation', value: 'Auto', userId: saveUser.id });
                await saveSettings.save();
            }
            

            await pushData.pushData(saveUser.id);
            if (!req.session.isLoggedIn) {
                User.findOne().then((alluser) => {
                    res.status(201).json({
                        message: 'continue',
                        data: alluser,
                    });
                });
            } else {
                User.findOne().then((alluser) => {
                    console.log('Created User.');
                    res.status(201).json({
                        message: 'ok',
                        data: alluser,
                    });
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
}

exports.call_api = async(req, res, next) => {

    try {
        const url = base_url.BASE_URL + "/auth/get-license-update-data";

        const start_date = moment().format('DD/MM/YYYY');
        const end_date = moment().format('DD/MM/YYYY');
        const deviceurl = `${process.env.ENDPOINT}${start_date}&end_date=${end_date}`

        const basicAuth = 'Basic ' + process.env.TERMINAL;
        axios.defaults.headers.common['Authorization'] = basicAuth;

        await axios.get(deviceurl).then(async function(response) {
            if (response) {
                if (response.status == 200) {

                    console.log('response.data ====>', (response.data.data));
                    if (response.data.data.length) {
                        const date = response.data.data[9].punch_date;
                        const time = response.data.data[9].punch_time;
                        let timestamp = new Date(+response.data.data[9].timestamp * 1000);
                        timestamp = timestamp.toLocaleString('en-GB', { timeZone: 'UTC' });

                        return res.status(200).json({ data: { date: date, time: time, timestamp: timestamp } });
                    }

                    return res.status(200).json({ data: 'no data found' });
                }
            }
        }).catch(function(error) {
            console.log(error);
            // if (error.response.status == 422) {
            //     console.log('error.request ====>', error.response.data.data);

            //     return res.status(422).json({
            //         errorMessage: error.response.data.data[0].msg,
            //         validationErrors: error.response.data.data,
            //     });
            // } else {
            //     console.log('Error ====>', error.response.data);
            //     return res.status(500).json({ error: "Sorry something went wrong, try again" });

            // }
        })

        // const login = await Login.authenticate(email, password);
        /* await axios.post(base_url.BASE_URL + "/auth/login", { "email": process.env.EMAIL, "password": process.env.AUTH_PASSWORD }).then(function(response) {
            if (response) {
                if (response.status == 200) {
                    console.log('error.response.status ====>', response.status);
                    console.log('error.response.data ====>', response.data);
                }
                // console.log('error.response.data ====>', response.headers);
            }
            // console.log(response);
        }).catch(function(error) {
            if (error.request) {
                console.log('error.request ====>', error.request);
            } else {
                console.log('Error ====>', error.message);
            }
        }) 
        */

        // continue from here 
        // if (login) {
        //     console.log('Here <=====> 200');
        // } else {
        //     console.log('Worked =======>');
        // }
        // console.log('Respose ====> ', login.data);
        // console.log('Respose ====> ', login.status);
        // console.log('Respose ====> ', login.statusText);
        // console.log('Respose ====> ', login);

        // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    } catch (err) {
        console.log('ERRORS ===>', err);
    }
}

exports.getPDF = async(req, res, next) => {

    return res.render('pdf/template');


};

exports.addTerminal = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }

        const terminal = await new Terminal({
            terminal_name: req.body.termName,
            terminal_location: req.body.termLocation,
            terminal_number: req.body.termNumber,
            terminal_serial_number: req.body.termSerial,
            terminal_api: req.body.termAPI,
            terminal_status: req.body.termAPI.split('?')[0]+'-status',
            userId: req.user.id
        })
        await genFunct.log(req, ['Added a new terminal and load data from server', (await this.pathname(req)).toString()]);
        return res.status(201).json({ data: 'ok' })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong, please try again' });
    }
};

exports.getTerminals = async(req, res, next) => {
    try {
        const dataArray = [];
        const terminals = await Terminal.findAll({ where: { deleted: 0 } });
        for (let i = 0; i < terminals.length; i++) {
            const getUsers = await TerminalUser.findAndCountAll({ where: { terminalId: terminals[i].id } });
            const terminalStatus = await genFunct.terminalStatus(terminals[i].terminal_status, req);
            // await genFunct.pullData(req);
            let data = await { id: terminals[i].id, date: moment(terminals[i].createdAt).format('DD-MM-YYYY'), name: terminals[i].terminal_name, location: terminals[i].terminal_location, number: terminals[i].terminal_number, sNumber: terminals[i].terminal_serial_number, totalUsers: getUsers.count, status: terminalStatus.status, last_online: moment(terminalStatus.last_online).format('DD-MM-YYYY HH:m:s') };
            dataArray.push(data);
        }
        // console.log('hasInternet => ', (await genFunct.getIPAddress(req)).toString());
        if (dataArray.length) {
            await genFunct.log(req, ['View terminals and load data from server', (await this.pathname(req)).toString()]);
            return res.status(200).json({ data: dataArray });
        }
        await genFunct.log(req, ['View terminals and load data from server', (await this.pathname(req)).toString()]);

        return res.status(200).json({ data: dataArray });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

exports.getTerminal = async(req, res, next) => {
    try {
        await genFunct.pullData(req);
        const termID = req.params.termID;
        let dataBj = {};
        const newUser = [];
        const employees = [];
        const unLinkEmployees = [];

        const terminal = await Terminal.findOne({ where: { id: termID, deleted: 0 } });
        // await genFunct.pullData(req);
        const terminalStatus = await genFunct.terminalStatus(terminal.terminal_status, req);

        if (terminal) {

            dataBj = await { id: terminal.id, date: moment(terminal.createdAt).format('DD-MM-YYYY'), name: terminal.terminal_name, location: terminal.terminal_location, number: terminal.terminal_number, sNumber: terminal.terminal_serial_number, status: terminalStatus.status, last_online: moment(terminalStatus.last_online).format('DD-MM-YYYY HH:m:s') };


            const newUsers = await TerminalUser.findAndCountAll({ where: { terminalId: terminal.id, deleted: 0 } });

            if (newUsers.count) {
                for (let i = 0; i < newUsers.count; i++) {
                    if (!newUsers.rows[i].employeeId) {
                        let data = { id: newUsers.rows[i].id, user: newUsers.rows[i].terminal_user_id };
                        newUser.push(data);
                    }
                    if (newUsers.rows[i].employeeId) {
                        const employee = await Employee.findOne({ where: { id: newUsers.rows[i].employeeId, deleted: 0 } });
                        const dept = await Department.findOne({ where: { id: employee.departmentId } });
                        let data = { id: newUsers.rows[i].id, employeeId: employee.id, name: `${employee.title} ${employee.fName} ${genFunct.getFulName(employee.mName, employee.lName)}`, dept: dept.deptName, user_id: newUsers.rows[i].terminal_user_id };

                        employees.push(data);
                    }
                }
            }

            const nonEmployees = await Employee.findAndCountAll({ where: { deleted: 0 } });

            if (nonEmployees) {
                for (let i = 0; i < nonEmployees.count; i++) {
                    const isNotLink = await TerminalUser.findOne({ where: { terminalId: terminal.id, employeeId: nonEmployees.rows[i].id, deleted: 0 } });

                    if (!isNotLink) {
                        const dept = await Department.findOne({ where: { id: nonEmployees.rows[i].departmentId } });

                        let data = { id: nonEmployees.rows[i].id, name: `${nonEmployees.rows[i].title} ${nonEmployees.rows[i].fName} ${genFunct.getFulName(nonEmployees.rows[i].mName, nonEmployees.rows[i].lName)}`, dept: dept.deptName };

                        unLinkEmployees.push(data);
                    }

                }
            }
        }
        await genFunct.log(req, [`View a terminal ${terminal.terminal_number} and load data from server`, (await this.pathname(req)).toString()]);

        return res.status(200).json({ dataBj: dataBj, newUser: newUser, employees: employees, unLinkEmployees: unLinkEmployees });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.linkEmployTemUser = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }

        let newTerUserList = req.body.newTerUserList;
        let unLinkEmploy = req.body.unLinkEmploy;

        let val = [];
        if (!Array.isArray(newTerUserList)) {
            val.push(newTerUserList);
            newTerUserList = val;
        }

        val = [];
        if (!Array.isArray(unLinkEmploy)) {
            val.push(unLinkEmploy);
            unLinkEmploy = val;
        }

        for (let i = 0; i < newTerUserList.length; i++) {
            const updateUser = await TerminalUser.update({ employeeId: unLinkEmploy[i].split('=>')[0], userId: req.user.id }, { where: { id: newTerUserList[i].split('=>')[0] } });

            const saveHistory = await new LinkedTermUserHitory({
                status: 'Linked',
                userId: req.user.id,
                terminalUserId: newTerUserList[i].split('=>')[0],
                employeeId: unLinkEmploy[i].split('=>')[0]
            });

            await saveHistory.save();
        }

        await genFunct.log(req, [`Linked new terminal users to employees`, (await this.pathname(req)).toString()]);
        return res.status(201).json({ data: 'ok' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.unlinkTermuser = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }

        const user = req.params.termID;

        const getUser = await TerminalUser.findOne({ where: { id: user } });

        const updateUser = await TerminalUser.update({ employeeId: null, userId: req.user.id }, { where: { id: user } });

        const saveHistory = await new LinkedTermUserHitory({
            status: 'Uninked',
            userId: req.user.id,
            terminalUserId: user,
            employeeId: getUser.employeeId
        });

        await saveHistory.save();

        await genFunct.log(req, [`Unlinked employees from terminal users ${user}.`, (await this.pathname(req)).toString()]);
        return res.status(201).json({ data: 'ok' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.unlinkAll = async(req, res, next) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(422).json({
        //         errorMessage: errors.array()[0].msg,
        //         validationErrors: errors.array()
        //     })
        // }

        const user = req.body.termID;

        for (let i = 0; i < user.length; i++) {

            const getUser = await TerminalUser.findOne({ where: { id: user[i] } });

            const updateUser = await TerminalUser.update({ employeeId: null, userId: req.user.id }, { where: { id: user[i] } });

            const saveHistory = await new LinkedTermUserHitory({
                status: 'Uninked',
                userId: req.user.id,
                terminalUserId: user[i],
                employeeId: getUser.employeeId
            });

            await saveHistory.save();
        }

        await genFunct.log(req, [`Unlinked ${user.length} employees from their respective terminal users`, (await this.pathname(req)).toString()]);
        return res.status(201).json({ data: 'ok' });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
}

exports.getTerminalByDate = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }
        const terminalId = req.params.termID;
        const date = req.params.date;

        const terminalEmp = await TerminalUser.findOne({
            where: {
                terminalId: terminalId,
                employeeId: {
                    [Op.ne]: null
                }
            },
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
        });

        if (terminalEmp) {

        }

    } catch (err) {
        console.log('Error from getTerminalByDate', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.chartData = async(req, res, next) => {
    try {
        if (req.user.role == 'Admin') {
            const data = [];
            const depts = await Department.findAndCountAll({ where: { deleted: 0 } }).then(result => {
                return { name: 'Departments', count: result.count };
            });
            const jobs = await JobDesc.findAndCountAll({ where: { deleted: 0 } }).then(result => {
                return { name: 'Job titles', count: result.count };
            });
            const salary = await SalaryStructure.findAndCountAll({ where: { deleted: 0 } }).then(result => {
                return { name: 'Salary grades', count: result.count };
            });
            const leave = await LeaveType.findAndCountAll({ where: { deleted: 0 } }).then(result => {
                return { name: 'Leave policies', count: result.count };
            });
            const shift = await Shift.findAndCountAll({ where: { deleted: 0 } }).then(result => {
                return { name: 'Shifts', count: result.count };
            });
            const users = await User.findAndCountAll({ where: { deleted: 0 } }).then(result => {
                return { name: 'System users', count: result.count };
            });

            // leave status
            const getLeaveStatus = await Leaves.findAll({
                where: { deleted: 0, status: ['Approved', 'Pending'] },
                include: [{
                        model: Employee,
                        where: {
                            deleted: 0,
                            // departmentId: employDetails.rows[0].id
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
            const emply_leave_status = [];
            let pend = 0;
            let onlev = 0;
            for (let i = 0; i < getLeaveStatus.length; i++) {
                let date = Math.floor(new Date());
                let from = Math.floor(new Date(getLeaveStatus[i].from));
                let to = Math.floor(new Date(getLeaveStatus[i].to));

                if ((date >= from) && (date <= to) && getLeaveStatus[i].status === 'Approved') {
                    // if (getLeaveStatus[i].status === 'Approved') {
                        onlev += 1;
                    }
                    if (date <= to && getLeaveStatus[i].status === 'Pending') {
                        pend += 1;
                    }
                // }
            }

            const totalEmp = await Employee.findAndCountAll({ where: { deleted: 0 } });
            const nolev = totalEmp.count - (pend + onlev);
            emply_leave_status.push({ lable: 'On leave', no: onlev }, { lable: 'Pending leave', no: pend }, { lable: 'No leave', no: nolev });
            data.push(depts, jobs, salary, leave, shift, users);

            // attendance
            const attendByMonths = [];
            const months = []
            let monthInYear = moment.months();
            var startDate = moment(moment().startOf('year'));
            var endDate = moment(new Date());
            const currentMonth = genFunct.MonthsToNow(startDate, endDate);
            // console.log('currentMonth => ', currentMonth);
            for (let i = 0; i < (await currentMonth).length; i++) {

                months.push(monthInYear[i] + ' (' + await genFunct.getMonthWorkingDays(moment((await currentMonth)[i]).format('YYYY-MM-DD')) + ')');
            }
            for (let i = 0; i < (await currentMonth).length; i++) {
                let countMonth = 0;
                const monthStart = moment((await currentMonth)[i]).startOf('month').format('YYYY-MM-DD');
                const monthEnd = moment((await currentMonth)[i]).endOf('month').format('YYYY-MM-DD');
                const dateArray = await genFunct.datearray(monthStart, monthEnd);
                for (let j = 0; j < dateArray.length; j++) {
                    const date = moment(dateArray[j]).format('YYYY-MM-DD');
                    countMonth += ((await genFunct.getEmpMarkedAttend(date, null)).length) ? 1 : 0;
                }
                attendByMonths.push({ month: months[i], attend: countMonth });
                countMonth = 0;
            }

            // gender pie chart
            const genderNAgeAnalysis = (await genFunct.genderNAgeAnalysis(req));
            const loginUserMonthlyAttend = (await genFunct.loginUserMonthlyAttend(req));

            const gend = [{ totalEmp: genderNAgeAnalysis[0], g: genderNAgeAnalysis[1], gl: 'Male' }, { g: genderNAgeAnalysis[2], gl: 'Female' }];

            // console.log('Day => ', (await genFunct.getEmpInDept(req, null)));
            return res.status(200).json({ status: 422, data: data, leave: emply_leave_status, monthAttend: attendByMonths, gend: gend, user: loginUserMonthlyAttend });
        }
        if (req.user.role == 'HOD') {
            // will get the id from there if the head is logged in
            const getEmpInDept = (await genFunct.getEmpInDept(req, null));
            const empids = [];
            for (let i = 0; i < getEmpInDept.length; i++) {
                empids.push(getEmpInDept[i].id);
            }
            const getLeaveStatus = await Leaves.findAll({
                where: { employeeId: empids, deleted: 0, status: ['Approved', 'Pending'] },
                include: [{
                        model: Employee,
                        where: {
                            deleted: 0,
                            // departmentId: employDetails.rows[0].id
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
            const emply_leave_status = [];
            let pend = 0;
            let onlev = 0;
            for (let i = 0; i < getLeaveStatus.length; i++) {
                let date = Math.floor(new Date());
                let from = Math.floor(new Date(getLeaveStatus[i].from));
                let to = Math.floor(new Date(getLeaveStatus[i].to));

                if ((date >= from) && (date <= to) && getLeaveStatus[i].status === 'Approved') {
                    // if (getLeaveStatus[i].status === 'Approved') {
                        onlev += 1;
                    }
                    if (date <= to && getLeaveStatus[i].status === 'Pending') {
                        pend += 1;
                    }
                // }
            }

            // Attendance 
            const attendByMonths = [];
            const months = []
            let monthInYear = moment.months();
            var startDate = moment(moment().startOf('year'));
            var endDate = moment(new Date());
            const currentMonth = genFunct.MonthsToNow(startDate, endDate);
            const deptID = await Employee.findOne({ where: { id: req.user.currentUserEmployeeId, deleted: 0 } }).then(result => { if (result) { return result.departmentId } return null });

            // console.log('currentMonth => ', currentMonth);
            for (let i = 0; i < (await currentMonth).length; i++) {

                months.push(monthInYear[i] + ' (' + await genFunct.getMonthWorkingDays(moment((await currentMonth)[i]).format('YYYY-MM-DD')) + ')');
            }
            for (let i = 0; i < (await currentMonth).length; i++) {
                let countMonth = 0;
                const monthStart = moment((await currentMonth)[i]).startOf('month').format('YYYY-MM-DD');
                const monthEnd = moment((await currentMonth)[i]).endOf('month').format('YYYY-MM-DD');
                const dateArray = await genFunct.datearray(monthStart, monthEnd);
                for (let j = 0; j < dateArray.length; j++) {
                    const date = moment(dateArray[j]).format('YYYY-MM-DD');
                    countMonth += ((await genFunct.getEmpMarkedAttendByDept(date, deptID)).length) ? 1 : 0;
                }
                attendByMonths.push({ month: months[i], attend: countMonth });
                countMonth = 0;
            }
            const totalEmp = await Employee.findAndCountAll({ where: { deleted: 0 } });
            const nolev = empids.count - (pend + onlev);
            emply_leave_status.push({ lable: 'On leave', no: onlev }, { lable: 'Pending leave', no: pend }, { lable: 'No leave', no: nolev });
            // data.push(depts, jobs, salary, leave, shift, users);
            const genderNAgeAnalysis = (await genFunct.genderNAgeAnalysis(req));
            const loginUserMonthlyAttend = (await genFunct.loginUserMonthlyAttend(req));

            const gend = [{ totalEmp: genderNAgeAnalysis[0], g: genderNAgeAnalysis[1], gl: 'Male' }, { g: genderNAgeAnalysis[2], gl: 'Female' }];

            // console.log('Day => ', (await genFunct.getEmpInDept(req, null)));
            return res.status(200).json({ status: 500, leave: emply_leave_status, monthAttend: attendByMonths, gend: gend, user: loginUserMonthlyAttend });
        }
        if (req.user.role == 'STDU') {
            const loginUserMonthlyAttend = (await genFunct.loginUserMonthlyAttend(req));
            // console.log('Day => ', (await genFunct.getEmpInDept(req, null)));
            return res.status(200).json({ status: 200, user: loginUserMonthlyAttend });
        }
        // genFunct.pullData(req);
        return res.status(200).json({ data: 'You have no business here' });

    } catch (err) {
        console.log('Error from chart Data', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.getFile = async (req, res) => {
    try {
        // console.log(req.params)
        const key = req.params.key
        const readStream = await getFileStream(key)
        readStream.pipe(res)
        // /s3files/LeaveAttFile_IMG_6335.JPG
    } catch (err) {
        console.log('Error from get file');
    }
};

exports.addENV = async (req, res, next) => {
    try {
        res.render('add-env', {
            pageTitle: 'Add ENV',
            path: 'add-env',
            user: [],
            done: '',
            userDetails: [],
        });
    } catch (err) {
        console.log('Error from =>add-env', err);
    }
};

exports.addEnv = async (req, res, next) => {
    try {
        const entry = `\n${req.body.key}=${req.body.value}`;
        await fileHandler.writeEnv(entry);
        res.render('add-env', {pageTitle: 'Add ENV',
                path: 'add-env',
                user: [],
                done:'Good job !!!',
                userDetails: [],})
    } catch (err) {
        console.log('Error from =>add-env', err);
    }
}


