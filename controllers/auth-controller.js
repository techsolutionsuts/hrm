const crypto = require('crypto');

const fileHandler = require('../util/file');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const parseurl = require('parseurl');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {
    validationResult
} = require('express-validator/check');
const genFunct = require('../general-func/general-func');
const errorsfile = require('./error');
const chalk = require('chalk');

const User = require('../models/user-model');
const Company = require('../models/company-model');
const Employee = require('../models/employee-model');
const Leaves = require('../models/leaves-model');
const BankDetail = require('../models/bankDetails-model');
const Address = require('../models/address-model');
const Dependant = require('../models/dependant-model');
const ReportTo = require('../models/reportTo-model');
const Spouse = require('../models/spouse-model');
const SSNITBenfit = require('../models/ssnitBenefit-model');
const EducationBacground = require('../models/educationBackground-model');
const WorkExperience = require('../models/workExperiences-model');
const EmergencyContact = require('../models/emergency-contact-model');
const NextOfKin = require('../models/next-of-kin-model');
const JobDesc = require('../models/jobDesc-model');
const Department = require('../models/department-model');
const SalaryStructure = require('../models/salaryStructure-model');
const LeaveType = require('../models/leavetype-model');
const Logs = require('../models/logs-model');
const { pingForInternet, pullData } = require('../general-func/general-func');
const daemon = require('daemon');
const { v4: uuidv4 } = require("uuid");

// const csrfProtection = csrf();
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

exports.getLogin = async(req, res, next) => {
    // console.log('Auth => ');

    try {
        // console.log('Auth => ');
        const hasInternet = await genFunct.pingForInternet(req)
        if (hasInternet) {
            await genFunct.getIDD()
        }else{
            console.log('No Internet');
            await genFunct.getIDD()
            await fileHandler.writeLog(`\n${new Date() } => Internet NOT Available for Remote update on idd`);
        }
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        // user = await User.findOne({ where: { deleted: 0 } });

        // if(!user){

        // }
        // console.log('Auth => ');

        if (req.session.isLoggedIn) {

            if (req.user.role === 'Admin') {
                return res.redirect(`${process.env.MENT}/index`);
            }
            if (req.user.role === 'STDU') {
                return res.redirect(`${process.env.DIST}/index`);
            }
            if (req.user.role === 'HOD') {
                return res.redirect(`${process.env.MUN}/index`);
            }
        }

        // console.log('Auth => ');
        return res.render('auth/login', {
            path: '/',
            pageTitle: 'Login',
            errorMessage: message,
            oldInput: {
                email: '',
                password: ''
            },
            // csrfToken: req.csrfToken(),
            validationErrors: [] // or [{param: 'email', param: 'password'}]
        });
    } catch (err) {
        // throwError.throwError(err);
        console.log('Error from login form===>', err);
        msg = 'Sorry something is wrong, but still login';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return res.render('auth/login', {
                path: '/',
                pageTitle: 'Login',
                errorMessage: msg,
                oldInput: {
                    email: '',
                    password: ''
                },
                validationErrors: [] // or [{param: 'email', param: 'password'}]
            });
        }

    }
};

exports.getTimeout = async(req, res, next) => {
    try {
        return res.render('auth/timeout', {
            path: '/timeout',
            pageTitle: 'Timeout',
        });
    } catch (err) {
        console.log('Error from login form===>', err);
        msg = 'Sorry something is wrong, but still login';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return res.render('auth/timeout', {
                path: '/timeout',
                pageTitle: 'Timeout'
            });
        }
    }
};

exports.postLogin = async(req, res, next) => {
    try {
        // console.log('In loged => ');
        const email = req.body.email;
        const password = req.body.password;
        // const color = chalk.bgBlue.black.underline;
        if (req.session.isLoggedIn) {            
                return res.redirect(`/`);
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
            })
        }
        const isSession = await User.findOne({ where: { email: email, deleted: 0 } });
        let sessionExpired = 'N/A';
        if (isSession) {
            sessionExpired = moment(isSession.expiredAt).format('DD-MM-YYYY HH:m:s')
            if (Math.floor(new Date(isSession.expiredAt) / 1000) < Math.floor(new Date() / 1000)) {
                if (isSession.login) {
                    await User.update({ login: 0 }, { where: { email: email } });
                }
            }
        }
        User.findOne({
                where: {
                    email: email, deleted:0
                }
            })
            .then(async user => {
                if (!user) {
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: [] // or [{param: 'email', param: 'password'}]
                    });
                }
                if (!user.status) {
                    await genFunct.log(req, ['Login attempt failed due to account suspended', (await this.pathname(req)).toString()], user.id);

                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Your account is suspended, kindly contact system administrator.',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: [] // or [{param: 'email', param: 'password'}]
                    });
                }

                if (user.deleted) {
                    await genFunct.log(req, ['Login attempt failed due to account deleted', (await this.pathname(req)).toString()], user.id);

                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Your account is deleted, kindly contact system administrator.',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: [] // or [{param: 'email', param: 'password'}]
                    });
                }
                
                if (user.login) {
                    await genFunct.log(req, ['Already login on another device or browser', (await this.pathname(req)).toString()], user.id);
                    // return res.status(422).render('auth/login', {
                    //     path: '/login',
                    //     pageTitle: 'Login',
                    //     errorMessage: `You are already logged in on another device or browser, please log yourself out on that device or browser or try again after ${sessionExpired}`,
                    //     oldInput: {
                    //         email: email,
                    //         password: password
                    //     },
                    //     // csrfToken: req.csrfToken(),
                    //     validationErrors: [] // or [{param: 'email', param: 'password'}]
                    // });
                }

                if (user.firstTime) {
                    await genFunct.log(req, ['Redirect to create password', (await this.pathname(req)).toString()], user.id);

                    return res.render('auth/first-time-user', {
                        pageTitle: 'Create Password',
                        path: 'first-time-user',
                        userData: {
                            userId: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                }

                if (user.currentUserEmployeeId) {
                    const dept = await Department.findOne({ where: { headByEmployeeId: user.currentUserEmployeeId, deleted: 0 } });
                    if (!dept && user.role === 'HOD') {
                        await genFunct.log(req, ['Login attempt failed due to no longer a the head of department', (await this.pathname(req)).toString()], user.id);

                        return res.status(422).render('auth/login', {
                            path: '/login',
                            pageTitle: 'Login',
                            errorMessage: 'Sorry you are no longer the head of this department, kindly contact system administrator.',
                            oldInput: {
                                email: email,
                                password: password
                            },
                            validationErrors: [] // or [{param: 'email', param: 'password'}]
                        });
                    }
                }
                bcrypt
                    .compare(password, user.password)
                    .then(async doMatch => {
                        if (doMatch) {
                            // console.log('Session ===> ', Date.now);
                            let deptDDT = 0;
                            const emply = await Employee.findOne({ where: { id: user.currentUserEmployeeId, deleted: 0 } });
                            if (emply) {
                                const name = `${emply.title || ''} ${emply.fName} ${genFunct.getFulName(emply.mName, emply.lName)}`;
                                await User.update({ name: name, image: emply.photo }, { where: { id: user.id } });
                            }
                            deptDDT = await emply.departmentId;
                            const naw = new Date(Math.floor(Date.now()/1000));
                            req.session.isLoggedIn = true;
                            const user_details = { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image, userId: user.userId, currentUserEmployeeId: user.currentUserEmployeeId, createdAt: user.createdAt, uuid: user.uuid, timeoutsec: user.sessiontimeout, deptID:deptDDT};
                            req.session.createdAt = naw
                            req.session.user = user_details;
                            // console.log('User => ', user_details);
                            // return res.status(200).json({data: dept})
                            return req.session.save(async err => {
                                // console.log('Session ===> ', req.session.cookie.expires);
                                // console.log(err);
                                // save the user sessionID to the user table
                                await User.update({ session: req.session.id, login: 1, expiredAt: req.session.cookie.expires, lastLogin: Date.now(), updatedAt:naw }, { where: { email: email } });

                                await genFunct.log(req, ['Login', (await this.pathname(req)).toString()], req.session.user.id);
                                await genFunct.updateRemote(req);
                                // await genFunct.pullData(req);
                                let getIDD = await genFunct.getIDD();
                                getIDD = getIDD[0];
                                if (getIDD <= 1) {
                                    await fileHandler.writeLog(`\n${new Date() } => Software lincese have ended`);
                                    // return req.session.destroy(err => {
                                    //     res.status(422).render('auth/login', {
                                    //         path: '/login',
                                    //         pageTitle: 'Login',
                                    //         errorMessage: 'Sorry software lincese have ended, kindly contact sales for a renewal.',
                                    //         oldInput: {
                                    //             email: email,
                                    //             password: password
                                    //         },
                                    //         validationErrors: [] // or [{param: 'email', param: 'password'}]
                                    //     });
                                    // });
                                }


                                if (req.session.user.role === 'Admin') {
                                    // await genFunct.runSchedule(req, true, 'pulldata');
                                    return res.redirect(`${process.env.MENT}/index`);
                                }
                                if (req.session.user.role === 'STDU') {
                                    return res.redirect(`${process.env.DIST}/index`);
                                }
                                if (req.session.user.role === 'HOD') {
                                    // await genFunct.runSchedule(req, true, 'pulldata');
                                    return res.redirect(`${process.env.MUN}/index`);
                                }
                            });
                        }
                        return res.status(422).render('auth/login', {
                            path: '/login',
                            pageTitle: 'Login',
                            errorMessage: 'Invalid email or password',
                            oldInput: {
                                email: email,
                                password: password
                            },
                            validationErrors: [] // or [{param: 'email', param: 'password'}]
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/');
                    });
            })
            .catch(err => {
                // throwError.throwError(err);
                console.log('Error from login form===>', err);
                msg = 'Sorry something is wrong, please try again';

                if (req.xhr) {
                    return res.status(500).json({ error: msg });
                } else {
                    return res.render('auth/login', {
                        path: '/',
                        pageTitle: 'Login',
                        errorMessage: msg,
                        oldInput: {
                            email: '',
                            password: ''
                        },
                        validationErrors: [] // or [{param: 'email', param: 'password'}]
                    });
                }
            });
    } catch (err) {
        // console.log('Here ==>');
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return res.render('auth/login', {
                path: '/',
                pageTitle: 'Login',
                errorMessage: msg,
                oldInput: {
                    email: '',
                    password: ''
                },
                validationErrors: [] // or [{param: 'email', param: 'password'}]
            });
        }
    }
};

exports.postLogout = async(req, res, next) => {
    try {
        const hasInternet = await genFunct.pingForInternet(req)
        if(hasInternet) {
            await genFunct.getIDD()
        }else {
            // console.log('No Inter');
            await genFunct.getIDD()
            await fileHandler.writeLog(`\n${new Date() } => Internet NOT Available for Remote update on idd`);
        };

        await User.update({ login: 0, lockExpired: 0 }, { where: { email: req.user.email } });
        await genFunct.log(req, ['Logged out', (await this.pathname(req)).toString()]);

        await genFunct.runSchedule(req, false, 'pulldata');
        return req.session.destroy(err => {
            // console.log('What happened here =====> ', err);
            res.redirect('/');
        });
    } catch (err) {
        // throwError.throwError(err);
        console.log('Error during logout ===>', err);
        msg = 'Sorry something is wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return res.render('auth/login', {
                path: '/',
                pageTitle: 'Login',
                errorMessage: msg,
                oldInput: {
                    email: '',
                    password: ''
                },
                validationErrors: [] // or [{param: 'email', param: 'password'}]
            });
        }
    }
};

exports.autoLogout = async(req, res, next) => {
    try {
        const hasInternet = await genFunct.pingForInternet(req)
        if(hasInternet) {
            await genFunct.getIDD()
        }else {
            // console.log('No Inter');
            await genFunct.getIDD()
            await fileHandler.writeLog(`\n${new Date() } => Internet NOT Available for Remote update on idd`);
        };
        
        if (!req.user) {
            const getUser = await User.findOne({ where: { uuid: req.params.id } });
            await User.update({ login: 0, lockExpired: 0 }, { where: { email: getUser.email } });
            await genFunct.log(req, ['Auto logged out due to idleness by user and session has expired alread', (await this.pathname(req)).toString()], getUser.id);
            
            await genFunct.runSchedule(req, false, 'pulldata');
            return res.status(200).json({ data: 'ok'}); //csrfToken: req.csrfToken()
        } else {

            await User.update({ login: 0, lockExpired: 0 }, { where: { email: req.user.email } });
            await genFunct.log(req, ['Auto logged out due to idleness by user', (await this.pathname(req)).toString()]);

            await genFunct.runSchedule(req, false, 'pulldata');
            return req.session.destroy(err => {
                res.status(200).json({ data: 'ok'});
            });
        }
    } catch (err) {
        // throwError.throwError(err);
        console.log('Error during auto logout ===>', err);
        msg = 'Sorry something is wrong, please try again';
        return res.status(500).json({ error: msg });
    }
};

exports.getUser = async(req, res, next) => {
    const userId = req.params.userId;
    const errors = validationResult(req);
    const emplData = [];
    let status = false;
    try {
        if (!errors.isEmpty()) {
            return res.status(422).json({
                path: '/auth/getUser',
                pageTitle: 'Get user profile',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }

        await genFunct.log(req, ['View user profile and activity logs', (await this.pathname(req)).toString()]);

        const user = await User.findOne({
            where: { id: userId, deleted: 0 },
            // include: [{
            //     model: Employee,
            //     where: {
            //         deleted: 0,
            //     },
            //     // require: true,
            // }]
        });

        const getLogs = await Logs.findAll({
            where: { userId: user.id },
            order: [
                ['id', 'DESC']
            ]
        });

        const getLeaveStatus = await Leaves.findAll({
            where: { deleted: 0, employeeId: user.currentUserEmployeeId, status: 'Approved' },
        });
        for (let i = 0; i < getLeaveStatus.length; i++) {
            let date = Math.floor(new Date());
            let from = Math.floor(new Date(getLeaveStatus[i].from));
            let to = Math.floor(new Date(getLeaveStatus[i].to));
            // console.log('In loop get ==>', date, from, to);

            if ((date >= from) && (date <= to)) {
                status = true;
            }
        }

        const employee = await Employee.findOne({
            where: {
                id: user.currentUserEmployeeId,
                deleted: 0
            },
            include: [{
                    model: BankDetail
                        // where: {
                        //     deleted: 0,
                        // },
                        // require: false,
                },
                {
                    model: Address
                },
                {
                    model: Dependant
                },
                {
                    model: ReportTo

                },
                {
                    model: Spouse
                },
                {
                    model: SSNITBenfit
                },
                {
                    model: EducationBacground
                },
                {
                    model: WorkExperience
                },
                {
                    model: EmergencyContact
                },
                {
                    model: NextOfKin
                },
            ]
        });

        if (employee) {
            const jobDesc = await JobDesc.findOne({ where: { deleted: 0, id: employee.jobdescId } });
            const dept = await Department.findOne({ where: { deleted: 0, id: employee.departmentId } });
            const salary = await SalaryStructure.findOne({ where: { deleted: 0, id: employee.salarystructureId } });

            const annualLeave = await LeaveType.findOne({ where: { deleted: 0, id: employee.leaveTypeId } });

            let reportoNam;
            // console.log('Report: ', employee.reporttos[0].immediateSupEmplyId);
            if (employee.reporttos[0].immediateSupEmplyId) {
                const reportoName = await Employee.findOne({ where: { deleted: 0, id: employee.reporttos[0].immediateSupEmplyId } });
                reportoNam = await {
                    name: `${reportoName.title || ''} ${reportoName.fName} ${genFunct.getFulName(reportoName.mName, reportoName.lName)}`
                };
            } else {
                reportoNam = {};
            }

            let deptHeadNam;
            if (dept) {
                const deptHeadName = await Employee.findOne({ where: { deleted: 0, id: dept.headByEmployeeId } });
                if (deptHeadName) {
                    deptHeadNam = { name: `${(deptHeadName)? deptHeadName.title : ''} ${(deptHeadName)? deptHeadName.fName : ''} ${genFunct.getFulName((deptHeadName)?deptHeadName.mName : '', (deptHeadName)? deptHeadName.lName : '')}` };
                } else {
                    deptHeadNam = {};
                }
            } else {
                deptHeadNam = {};
            }

            await emplData.push(employee, jobDesc, dept, salary, reportoNam, deptHeadNam, annualLeave);
            // console.log('Logs ===> ', getLogs);
            return res.status(200).json({
                employee: emplData,
                status: status,
                user: user,
                pageTitle: 'User and employee Details for profile',
                path: '/auth/getUser/:userId',
                length: emplData.length,
                logs: getLogs
            });
        } else {
            // await genFunct.log(req, ['View system users', (await this.pathname(req)).toString()]);
            // console.log('Logs ===> ', getLogs);
            return res.status(200).json({
                employee: emplData,
                user: user,
                pageTitle: 'User and employee Details for profile',
                path: '/auth/getUser/:userId',
                logs: getLogs
            });
        }

    } catch (err) {
        console.log('Error from get user profile ===>', err);
        msg = 'Sorry something went wrong in your profile, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.linkUser = async(req, res, next) => {
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            return res.status(422).json({
                path: '/auth/linkUser',
                pageTitle: 'Link user to employee',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const employee = await Employee.findOne({ id: req.body.user_empl, deleted: 0 });
        const name = `${employee.title || ''} ${employee.fName} ${genFunct.getFulName(employee.mName, employee.lName)}`;
        const linkUser = await User.update({ currentUserEmployeeId: req.body.user_empl, name: name, image: employee.photo, userId: req.user.id }, { where: { id: req.body.userId } });

        if (linkUser) {
            await genFunct.log(req, ['Link user to employee informatio', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                // linkUser: linkUser,
                // user: user,
                pageTitle: 'Link user to employee information',
                path: '/auth/linkUser',
            });
        } else {
            return res.status(500).json({
                // linkUser: linkUser,
                // user: user,
                pageTitle: 'Link user to employee information',
                path: '/auth/linkUser',
            });
        }

    } catch (err) {
        console.log(err);

        console.log('Error from link user ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.changepassword = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        })
    }

    try {
        const user = await User.findOne({ where: { id: req.body.userId_pass, deleted: 0 } });
        if (user) {
            const hashPass = bcrypt.hashSync(req.body.new_pass, 12);
            await User.update({ password: hashPass }, { where: { id: user.id } });

            await genFunct.log(req, ['Changed password.', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                data: 'okay'
            }).req.session.destroy(err => {
                // console.log('What happened here =====> ', err);
                // res.redirect('/');
            });
        } else {
            return res.status(500).json({
                data: 'Something went wrong, try again !!'
            });
        }

        // console.log('Good to go =====>', req.body);
    } catch (err) {
        console.log('Error from change password ===>', err);
        msg = 'Sorry something went wrong in, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.getSystemUser = async(req, res, next) => {
    try {
        const users = await User.findAll({
            where: { deleted: 0 },
            // include: [{
            //     model: User,
            //     // where: {
            //     //     deleted: 0,
            //     // },
            //     // require: true,
            // }]
        }); // {where: { deleted: 0} }

        if (users) {
            const userData = [];

            // console.log('Users ======> ', users);
            let addedBy = 'N/A';
            let staffID = 'N/A';
            let phone = 'N/A';
            let image = 'img/avatar.svg';
            let deptName = 'N/A';
            let job = 'N/A';
            // users.forEach(element => {
            //     console.log('Foreach loop ========> ', element.name);
            // });
            for (let i = 0; i < users.length; i++) {
                if (users[i].userId) {
                    // console.log('users[i].userId ======> ', users[i].userId, i);
                    const user = await User.findOne({ where: { id: users[i].userId } });
                    addedBy = user.name;
                }
                if (users[i].currentUserEmployeeId) {
                    console.log('users[i].currentUserEmployeeId ======>', users[i].currentUserEmployeeId);
                    const employee = await Employee.findOne({ where: { id: users[i].currentUserEmployeeId, deleted: 0 } });
                    if (employee) {
                        staffID = employee.staffID;
                        phone = employee.phone;
                        image = employee.photo;
                        const dept = await Department.findOne({ where: { id: employee.departmentId, deleted: 0 } });
                        if (dept) {
                            deptName = dept.deptName;
                        }
                        const jobDesc = await JobDesc.findOne({ where: { deleted: 0, id: employee.jobdescId } });
                        if (jobDesc) {
                            job = jobDesc.jobTitle;
                        }

                        let data = {
                            id: users[i].id,
                            staffID: staffID,
                            name: users[i].name,
                            dept: deptName,
                            job: job,
                            phone: phone, // N/A not 
                            usermname: users[i].email,
                            role: users[i].role,
                            addedBy: addedBy,
                            status: (users[i].status) ? 'Active' : 'Inactive',
                            lastLog: (users[i].lastLogin) ? moment(users[i].lastLogin).format('DD-MM-YYYY HH:mm:ss') : 'N/A',
                            created: moment(users[i].createdAt).format('DD-MM-YYYY HH:mm:ss'),
                            request: users[i].requestpass,
                            image: image,
                            getCode: await genFunct.getPassword(),
                            expiredAt: (users[i].expiredAt) ? moment(users[i].expiredAt).format('DD-MM-YYYY HH:mm:ss') : 'N/A',
                            uuid: users[i].uuid,

                        }
                        await userData.push(data);
                        addedBy = 'N/A';
                        staffID = 'N/A';
                        phone = 'N/A';
                        image = 'img/avatar.svg';
                        deptName = 'N/A';
                        job = 'N/A';
                    }

                } else {
                    let data = {
                        id: users[i].id,
                        staffID: staffID,
                        name: users[i].name,
                        dept: deptName,
                        job: job,
                        phone: phone,
                        usermname: users[i].email,
                        role: users[i].role,
                        addedBy: addedBy,
                        status: (users[i].status) ? 'Active' : 'Inactive',
                        lastLog: moment(users[i].lastLogin).format('DD-MM-YYY HH:mm:ss'),
                        expiredAt: (users[i].expiredAt) ? moment(users[i].expiredAt).format('DD-MM-YYYY HH:mm:ss') : 'N/A',
                        uuid: users[i].uuid,
                    }
                    await userData.push(data);
                    addedBy = 'N/A';
                    staffID = 'N/A';
                    phone = 'N/A';
                    image = 'img/avatar.svg';
                    deptName = 'N/A';
                    job = 'N/A';
                }

            }

            await genFunct.log(req, ['View current system users', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                data: userData,
                // usr: users,
                // user: users[1].users
            });
        }
    } catch (err) {
        console.log('Error from get system users ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.changeIdleTimeout = async (req, res, next) => {
    try {
        const newTime = req.params.time;
        const upateTime = await User.update({ sessiontimeout: newTime }, { where: { id: req.user.id } });
        if (upateTime) {
            await genFunct.log(req, [`Change Idle timeout from ${req.user.timeoutsec} minutes to ${newTime} minutes`, (await this.pathname(req)).toString()])
            return res.status(200).json({ data: 'ok' });
        }
        return res.status(200).json({ data: 'Could not update time' });
        
    } catch (err) {
        return res.status(500).json({ error: 'Some thing went wrong' });
    }
}

exports.getEmplyToAdd = async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        });
    }

    try {

        const getCode = await genFunct.getPassword();
        const employee = await Employee.findOne({ where: { id: req.params.emplyID, deleted: 0 } });

        const dept = await Department.findOne({ where: { id: employee.departmentId, deleted: 0 } });
        const jobDesc = await JobDesc.findOne({ where: { id: employee.jobdescId, deleted: 0 } });

        if (getCode) {
            let data = await {
                name: `${employee.title || ''} ${employee.fName} ${genFunct.getFulName(employee.mName, employee.lName)}`,
                dept: dept.deptName || 'N/A',
                jobDesc: jobDesc.jobTitle || 'N/A',
                password: getCode,
                email: employee.email,
                role: (req.params.role === 'STDU') ? 'Standard user' : req.params.role
            }
            await genFunct.log(req, ['Accessed employees to be made system user', (await this.pathname(req)).toString()]);

            return res.status(200).json({ data: data })
        } else {
            return res.status(500).json({ err: 'Sorry something went wrong, please start the process again !' })

        }

        // console.log("getCode =======> ", getCode);

    } catch (err) {
        console.log('Error from get employee to add ===>', err);
        msg = 'Sorry something went wrong, please start the process again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }

    }
}

exports.getNonUserEmply = async(req, res, next) => {
    try {
        const nonUser = [];
        const employees = await Employee.findAll({ where: { deleted: 0 } });

        if (employees) {
            for (let i = 0; i < employees.length; i++) {
                const user = await User.findOne({ where: { currentUserEmployeeId: employees[i].id, deleted: 0 } });
                if (!user) {

                    let data = await {
                        id: employees[i].id,
                        fullname: `${employees[i].title || ''} ${employees[i].fName} ${genFunct.getFulName(employees[i].mName, employees[i].lName)}`,
                    }
                    await nonUser.push(data);
                    // console.log('employee =====> ', data);
                }
            }
            await genFunct.log(req, ['Accessed non sytem users', (await this.pathname(req)).toString()]);

            return res.status(200).json({ data: nonUser });
        }

    } catch (err) {
        console.log('From nonuserEmpl ==> ', err);
        msg = 'Sorry something went wrong, please start the process again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.createSystUser = async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    try {
        const employee = await Employee.findOne({ where: { id: req.body.emplytoadd, deleted: 0 } });
        if (employee) {
            let name = `${employee.title || ''} ${employee.fName} ${genFunct.getFulName(employee.mName, employee.lName)}`;
            const createUser = await new User({
                name: name,
                email: employee.email,
                password: await bcrypt.hashSync(req.body.gen_pass, 12),
                role: req.body.user_role,
                status: 1,
                firstTime: 1,
                image: employee.photo,
                userId: req.user.id,
                currentUserEmployeeId: employee.id,
                // uuid: uuid8()
            });

            await createUser.save();
            await genFunct.log(req, ['Created new system user', (await this.pathname(req)).toString()]);

            return res.status(200).json({ data: 'ok' });
        }
    } catch (err) {
        console.log('Error from create user ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.createpassword = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    try {

        const user = await User.findOne({ where: { id: req.body.user_id, email: req.body.cremail, deleted: 0 } });
        console.log('Here ==> OK');

        if (user) {
            const password = await bcrypt.hashSync(req.body.crpassword, 12)
            await User.update({ firstTime: 0, password: password }, { where: { id: user.id } });
        }
        await genFunct.log(req, ['Created password', (await this.pathname(req)).toString()], user.id);

        // console.log('Here ==> OK');

        return res.status(201).json({ data: 'ok' });
    } catch (err) {
        console.log('Create user ==> ', err);
        return res.status(500).json({ error: 'error' });
    }
}

exports.editUserRoleStatus = async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    try {
        await User.update({ role: req.body.edit_user_role, status: req.body.active }, { where: { id: req.body.user_ID } });

        await genFunct.log(req, ['Updated user role', (await this.pathname(req)).toString()]);

        return res.status(201).json({ data: 'ok' });

    } catch (err) {
        console.log('Edit user role', err);
        return res.status(500).json({ error: 'Something went wrong.' });

    }
}

exports.forceResetUserPass = async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        })
    }

    try {
        const user = await User.findOne({ where: { id: req.body.ussaid, deleted: 0 } });

        if (user) {
            const password = await bcrypt.hashSync(req.body.force_resetpass, 12);
            await User.update({ firstTime: 1, password: password, requestpass: 0 }, { where: { id: user.id } });
        }
        await genFunct.log(req, ['Force reset user password', (await this.pathname(req)).toString()]);

        return res.status(201).json({ data: 'ok' });

    } catch (err) {
        console.log('From force reset password');
        return res.status(500).json({ error: 'Sorry something went wrong, please try again.' });
    }
};

exports.forceLogUserOut = async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        })
    }

    try {
        const user = await User.findOne({ where: { uuid: req.body.usuuid, deleted: 0 } });

        if (user) {
            await User.update({ login: 0}, { where: { id: user.id } });
        }
        await genFunct.log(req, ['Force logged user out', (await this.pathname(req)).toString()]);

        return res.status(201).json({ data: 'ok' });

    } catch (err) {
        console.log('From Force logged user out');
        return res.status(500).json({ error: 'Sorry something went wrong, please try again.' });
    }
};

exports.requestPassResetForm = async(req, res, next) => {
    console.log('requestPassResetForm => ');
    return res.render('auth/forgot-password', {
        pageTitle: 'Forgot Password'
    })
}

exports.forgotpassword = async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    try {
        const email = req.body.forgemail;
        const user = await User.findOne({ where: { email: email, deleted: 0 } });

        if (user) {
            await User.update({ requestpass: 1 }, { where: { email: email } });

            await genFunct.log(req, ['Requested a password change.', (await this.pathname(req)).toString()], user.id);
        }

        return res.status(201).json({ data: 'ok' });
    } catch (err) {
        return res.status(500).json({ error: 'Sorry something went wrong, please try again' });
    }
}

exports.log = async(req, res, next, data = []) => {
    try {
        // console.log('Body => ', req.body);
        const ip = (await genFunct.getIPAddress(req)).toString();
        const browser = (await genFunct.getBrowser(req));
        const userId = req.user.id;

        let path;
        let action;

        action = req.body.action;
        path = req.body.path;

        const log = await new Logs({ action: action, path: path, ip: ip, browser: browser, userId: userId });
        await log.save();

        return res.status(200).json({ ok: 'logged' });
    } catch (err) {
        console.log('Error during logging', err);
        return res.status(500).json({ error: 'Something went wrong during logging' });
    }
}

exports.getUerLogs = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const userLogs = await Logs.findAll({
            where: { userId: userId },
            order: [
                ['id', 'DESC']
            ]
        });

        if (userLogs) {
            return res.status(200).json({ data: userLogs });
        }
    } catch (err) {
        console.log('Error in getting user logs', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.upload = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            if (req.files.image !== undefined) {
                    fileHandler.deleteFile(req.files.image[0].path);
                }
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }
        const user = await User.findOne({ where: { uuid: req.body.uuid_image, deleted: 0 } });
        await Employee.update({ photo: await genFunct.getPath(req, 'image') }, { where: { id: user.currentUserEmployeeId } });
        await User.update({ image: await genFunct.getPath(req, 'image') }, { where: { uuid: user.uuid } });
        await fileHandler.deleteFile(user.image);

        await genFunct.log(req, ['User changed their profile picture', (await this.pathname(req)).toString()]);
        
        return res.status(200).json({ data: 'done' });

    } catch (err) {
        console.log('Error from upload', err);
        return res.status(500).json({ error: 'Sorry something went wron' });
    }
}