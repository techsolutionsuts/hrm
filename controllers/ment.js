const puppeteer = require("puppeteer");
const countries = require('../data/countries');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const sequelize = require('../util/database');
const errorsfile = require('./error');
const { Op, Sequelize } = require('sequelize');
// const pdf = require('html-pdf');
const options = { format: 'A4' };
const fs = require('fs')
const parseurl = require('parseurl');
// const base_url = require('../util/base-url');


// pdf
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');

const pdf = require('pdf-creator-node');

// const doc = new PDFDocument();
// const stream = doc.pipe(blobStream());


const Company = require('../models/company-model');
const {
    validationResult
} = require('express-validator/check');

const fileHandler = require('../util/file');
// const path = require('../util/path');
const path = require('path');
const Allowance = require('../models/allowance-model');
const Employee = require('../models/employee-model');
const Department = require('../models/department-model');
const User = require('../models/user-model');
const Dependant = require('../models/dependant-model');
const JobDesc = require('../models/jobDesc-model');
const SalaryStructure = require('../models/salaryStructure-model');
const Address = require('../models/address-model');
const ReportTo = require('../models/reportTo-model');
const BankDetail = require('../models/bankDetails-model');
const Spouse = require('../models/spouse-model');
const SSNITBenfit = require('../models/ssnitBenefit-model');
const EducationBacground = require('../models/educationBackground-model');
const WorkExperience = require('../models/workExperiences-model');
const EmergencyContact = require('../models/emergency-contact-model');
const NextOfKin = require('../models/next-of-kin-model');
const genFunct = require('../general-func/general-func');
// const { get } = require('../routes/shop');
const SSNITStruct = require('../models/ssnitStructure-model');
const TaxStruct = require('../models/taxStructure-model');

const LeaveType = require('../models/leavetype-model');
const Leaves = require('../models/leaves-model');
const AttendMarked = require('../models/attendmarked-model');
const HODsChanged = require('../models/hods-change-model');
const internetAvailable = require('internet-available');

const http = require('http');
const Shift = require("../models/shift-model");
const EmpShiftHistory = require("../models/emp-shift-history-model");
const { isNull } = require("util");
const HolidayEvents = require("../models/holidays-events-model");
const TerminalUser = require("../models/terminal_users-model");
const PunchData = require("../models/punchData-model");
const { count } = require("console");
const EmpDeptHistory = require("../models/emp-dept-history-model");
const EmpJobHistory = require("../models/emp-job-history-model");
const EmpSalaryHistory = require("../models/emp-salary-hitory-model");
const EmpSuperHistory = require("../models/emp-super-history-model");
const SystemSettings = require("../models/system-settings-model");
const SettingsChangeHistory = require("../models/settings-change-history-model");
const LeavesProcess = require("../models/leaves-process-model");
const Task = require("../models/task-model");
const TaskProgress = require("../models/task_progress-model");
const { sendMail } = require("../email/mails");
const { newTask, taskCompleted } = require("../email/html/task");

exports.pathname = async(req) => {
    // For global usage
    return await parseurl(req).pathname;
}

exports.reload = (res) => {
    let i = 1;
    setInterval(function() {
        console.log('Respose ==>', res);
        // return res.render('auth/login', {
        //     path: '/',
        //     pageTitle: 'Login',
        //     errorMessage: 'message',
        //     oldInput: {
        //         email: '',
        //         password: ''
        //     },
        //     validationErrors: []
        // });
    }, 100);
}

// this.reload(http);

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
        let monthEnd = moment().endOf('month');
        let today = new Date();
        monthStart = monthStart.format('YYYY-MM-DD');
        monthEnd = monthEnd.format('YYYY-MM-DD');
        today = moment(today).format('YYYY-MM-DD');
        let month = new Date().toDateString() // moment(today).format('MM-YYYY');
        month = month.split(' ');
        month = `${month[1]} ${month[3]}`;
        const fr = moment(moment().startOf('month'), 'YYYY-MM-DD')
        const to = moment(new Date(), 'YYYY-MM-DD')
        const daysWorked = await genFunct.getMonthWorkingDays(monthStart, today) //Math.floor(-1 * moment.duration(fr.diff(to)).asDays() + 1);
        const daysInMonth = await genFunct.getMonthWorkingDays(monthStart) //Math.floor(-1 * moment.duration(fr.diff(to)).asDays() + 1);
        const dateArray = await genFunct.datearray(monthStart, today);
        let totalPres = 0;
        let totalAbs = 0;
        let lastDate = await genFunct.getTodayEvent(new Date()) || 'N/A';
        let punched = 0;
        // console.log('dateArray => ', dateArray);

        for (let i = 0; i < dateArray.length; i++) {
            const date = moment(dateArray[i]).format('YYYY-MM-DD');
            const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getUTCDay()];
            punched += ((await genFunct.getEmpMarkedAttend(date, null)).length) ? 1 : 0;
        }
        const employees = await Employee.findAll({
            where: {
                dateEmplyed: {
                    [Op.lte]: today
                },
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
            order: [
                    ['id', 'DESC']
                ],
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

        const emply_on_leave = [];
        const emply_pend_leave = [];
        for (let i = 0; i < getLeaveStatus.length; i++) {
            let date = Math.floor(new Date());
            let from = Math.floor(new Date(getLeaveStatus[i].from));
            let to = Math.floor(new Date(getLeaveStatus[i].to));
            // console.log('In loop get ==>', date, from, to);

            if ((date >= from) && (date <= to) && getLeaveStatus[i].status === 'Approved') {
                // if () {
                    emply_on_leave.push(`${getLeaveStatus[i].employee.title} ${getLeaveStatus[i].employee.fName} ${genFunct.getFulName(getLeaveStatus[i].employee.mName, getLeaveStatus[i].employee.lName)} on ${getLeaveStatus[i].leaveType.leaveType}`);
                }
                if (date <= to && getLeaveStatus[i].status === 'Pending') {

                    emply_pend_leave.push(`${getLeaveStatus[i].employee.title} ${getLeaveStatus[i].employee.fName} ${genFunct.getFulName(getLeaveStatus[i].employee.mName, getLeaveStatus[i].employee.lName)} for ${getLeaveStatus[i].leaveType.leaveType}`);
                }
            // }
        }

        let deptList = [];
        let totalDept = 0

        const depts = await Department.findAll({ where: { deleted: 0 } });

        // return res.status(200).json({ data: depts });
        if (depts) {
            totalDept = depts.length;
            for (let i = 0; i < depts.length; i++) {
                let j = await (depts.length - (i + 1));
                if (depts[j].headByEmployeeId) {
                    const getHead = await Employee.findOne({ where: { id: depts[j].headByEmployeeId } });
                    deptList.push(`${depts[j].deptName} -> ${getHead.title} ${getHead.lName} ${getHead.fName}`);
                } else {
                    await deptList.push(`${depts[j].deptName} -> Vacant`);
                }
            }
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
        await dashBoardUser.push(state[0],state[1])
        await dashBoardUser.push(compDetails); // 20
        
        // const holi = await HolidayEvents.findOne({ where: { date: today, deleted: 0 } });
        // console.log('bithAndEvents => ', holi);

        await genFunct.log(req, ['View dashboard', (await this.pathname(req)).toString()])
        // console.log('UserDetails => ', [req.user]);
        return res.render('ment/index', {
            pageTitle: 'Admin-Dashboard',
            globalhex: `/${process.env.MENT}`,
            path: `/${process.env.MENT}/index`,
            editing: false,
            user: req.user,
            userDetails: await [req.user.id, req.user.name, req.user.email, req.user.image, req.user.role, req.user.uuid, req.user.timeoutsec, req.user.deptID],
            dashBoardUser: dashBoardUser,
            dashBoardEmployee: [genderNAgeAnalysis[0], genderNAgeAnalysis[1], genderNAgeAnalysis[2], genderNAgeAnalysis[3], month, pre, abs, punched, percentPunched, daysInMonth, lastDate, newStaff, emply_on_leave, emply_pend_leave, deptList, totalDept, daysWorked] //15
        });
    } catch (err) {
        console.log('Error from admin dashboard ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: 'Sorry something went wrong, please try again' });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.validateData = async(req, res, next) => {
    const imageFiles = ['image', 'ssnitimage', 'spImage', 'noKImage', 'emergImage', 'depdImage', 'benfImage'];
    const images = req.files;
    // console.log('Images => ', images[`emergImage`][0]);
    let path = [];
    const errors = validationResult(req);
    try {
        if (images) {
            // console.log('field names ===> ', image);
            for (let i = 0; i < imageFiles.length; i++) {
                if (images[`${imageFiles[i]}`]) {
                    await images[`${imageFiles[i]}`].map(p => path.push({ path: p.path }));
                }
            }
        }
        // const imageUrl = image.path;

        if (!errors.isEmpty()) {
            console.log('Files ====>', path, 'Length ', path.length);

            for (let i = 0; i < path.length; i++) {
                let imageUrl = path[i].path;
                await fileHandler.deleteFile(imageUrl); // remove the image uploaded
                console.log('File path ====>', path[i].path);
            }

            // if (req.xhr) {
            await genFunct.log(req, [(await this.getValidationErrors('Validation error in adding employee.\n', errors)), (await this.pathname(req)).toString()]);

            return res.status(422).json({
                path: `/${process.env.MENT}/validate-basic`,
                pageTitle: 'Employee Basic Information',
                // image: imageUrl,
                errorMessage: errors.array()[0].msg,
                // oldInput: {
                date: path,
                // },
                validationErrors: errors.array(),
            });
        } else {
            // console.log('Files ====>', path, 'Length ', path.length);
            for (let i = 0; i < path.length; i++) {
                let imageUrl = path[i].path;
                await fileHandler.deleteFile(imageUrl); // remove the image uploaded
                // console.log('File path ====>', path[i].path);
            }

            await genFunct.log(req, ['Validated employee basic information', (await this.pathname(req)).toString()]);
            return res.status(200).json({
                respon: 'Validated success',
                path: `/${process.env.MENT}/validate-basic`,
                pageTitle: 'Employee Basic Information',
                data: req.body,
                file: req.files
            });
        }
    } catch (err) {
        console.log('Error from validateData ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';
        await genFunct.log(req, ['Sorry something went wrong in validating employee basic information', (await this.pathname(req)).toString()]);

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.validateSubmit = async(req, res, next) => {
    const imageFiles = ['image', 'ssnitimage', 'spImage', 'noKImage', 'emergImage', 'depdImage', 'benfImage'];
    // console.log('Body ===> ', req.body);
    const images = req.files;
    // console.log('Files in => ', images);
    let path = [];
    const errors = validationResult(req);

    try {
        if (images) {
            for (let i = 0; i < imageFiles.length; i++) {
                if (images[`${imageFiles[i]}`]) {
                    await images[`${imageFiles[i]}`].map(p => path.push({ path: p.path }));
                }
            }
        }

        if (!errors.isEmpty()) {
            // console.log('Files ====>', path, 'Length ', path.length);
            for (let i = 0; i < path.length; i++) {
                let imageUrl = path[i].path;
                await fileHandler.deleteFile(imageUrl); // remove the image uploaded
                // console.log('File path ====>', path[i].path);
            }
            // if (req.xhr) {
            await genFunct.log(req, [(await this.getValidationErrors('Validation error in adding employee.\n', errors)), (await this.pathname(req)).toString()]);

            return res.status(422).json({
                path: `/${process.env.MENT}/validate-basic`,
                pageTitle: 'Employee Basic Information',
                // image: imageUrl,
                errorMessage: errors.array()[0].msg,
                // oldInput: {
                date: path,
                // },
                validationErrors: errors.array(),
            });
        } else {
            // function photo(path) {
            // if (path.length) { return path[0].path; } else if (path.length === 1) { return path[1].path; } else { return null; }
            // }            
            const deptCode = Math.floor(new Date() / 1000) + 2;
            const jobCode = Math.floor(new Date() / 1000) + 4;
            const salaryCode = Math.floor(new Date() / 1000) + 6;
            const superCode = Math.floor(new Date() / 1000) + 8;

            if (req.body.mode === 'add') {
                const employee = await new Employee({
                    staffID: req.body.staffID,
                    title: req.body.title,
                    fName: req.body.fName,
                    mName: req.body.mName,
                    lName: req.body.lName,
                    gender: req.body.gender,
                    dob: req.body.bdate,
                    phone: req.body.phone,
                    email: req.body.email,
                    photo: await genFunct.getPath(req,'image'),
                    maritalStatus: req.body.mStatus,
                    cardType: req.body.cardType,
                    cardNo: req.body.idCard,
                    tin: req.body.tin,
                    ssnitNo: req.body.ssnitNo,
                    ssnitCardImage: await genFunct.getPath(req,'ssnitimage'),
                    dateEmplyed: req.body.dateEmplyed,
                    userId: req.user.id,
                    departmentId: req.body.dept || null,
                    jobdescId: req.body.jobTitle || null,
                    salarystructureId: req.body.salaryStruct || null,
                    leaveTypeId: req.body.leavtype || null,
                    deptCode: deptCode,
                    jobCode: jobCode,
                    salaryCode: salaryCode,
                });

                const saveEmp = await employee.save();
                //Save history now
                await new EmpDeptHistory({ from: req.body.dateEmplyed, dept_code: deptCode, departmentId: req.body.dept, employeeId: saveEmp.id, userId: req.user.id }).save();

                await new EmpJobHistory({ from: req.body.dateEmplyed, job_code: jobCode, jobdescId: req.body.jobTitle, employeeId: saveEmp.id, userId: req.user.id }).save();

                await new EmpSalaryHistory({ from: req.body.dateEmplyed, salary_code: salaryCode, salarystructureId: req.body.salaryStruct, employeeId: saveEmp.id, userId: req.user.id }).save();

                // if (saveEmp) {
                const address = await new Address({
                    gpGPSCode: req.body.gpCode,
                    residAddress: req.body.residAddress,
                    postAddress: req.body.postAddress,
                    nearestLandmark: req.body.nearmark,
                    town: req.body.town,
                    region: req.body.region,
                    employeeId: saveEmp.id,
                    userId: req.user.id,
                });
                const saveAddres = await address.save();

                const reportto = await new ReportTo({
                    reportToEmplyId: req.body.dept || null,
                    immediateSupEmplyId: req.body.immediatesuper || null,
                    employeeId: saveEmp.id
                });
                const saveReport = await reportto.save();

                const hash = await bcrypt.hashSync(`${req.body.staffID}${saveEmp.id}`, 12);
                const updateEmp = await Employee.update({
                    ReportToId: saveReport.id,
                    emplID: hash,
                    superCode: superCode
                }, { where: { id: saveEmp.id } });

                await new EmpSuperHistory({ from: req.body.dateEmplyed, super_code: superCode, ReportToId: saveReport.id, employeeId: saveEmp.id, userId: req.user.id }).save();

                let bankDetails;
                let saveBankDetails;
                if (req.body.bankName) {
                    bankDetails = await new BankDetail({
                        bankName: req.body.bankName,
                        branch: req.body.branch,
                        accNo: req.body.accNum,
                        userId: req.user.id,
                        employeeId: saveEmp.id,
                    });
                    saveBankDetails = await bankDetails.save();
                }

                let spouse;
                let saveSpouse;
                if (req.body.mStatus === 'Married') {
                    spouse = await new Spouse({
                        spouseName: req.body.spName,
                        spouseDOB: req.body.spDOB || null,
                        spousePhone: req.body.spphone,
                        spousePhoto: await genFunct.getPath(req,'spImage'),
                        spouseIDType: req.body.spcardType,
                        spouseIDNo: req.body.spIDCard,
                        userId: req.user.id,
                        employeeId: saveEmp.id
                    });
                    saveSpouse = await spouse.save();
                }
                let depnd;
                let saveDepnd;
                for (let i = 0; i < req.body.depdName.length; i++) {
                    if (req.body.depdName[i]) {
                        depnd = await new Dependant({
                            dependName: req.body.depdName[i] || null,
                            dependDOB: req.body.depdDOB[i] || null,
                            dependGender: req.body.depdGender[i] || null,
                            relation: req.body.depdRelation[i] || null,
                            dependPhone: req.body.depdPhone[i] || null,
                            dependIDType: req.body.depdCardType[i] || null,
                            dependIDNo: req.body.depdIDCard[i] || null,
                            dependAddress: req.body.depdAddress[i] || null,
                            dependimage: await genFunct.getArrayPath(req,'depdImage', i),
                            userId: req.user.id,
                            employeeId: saveEmp.id
                        });
                        saveDepnd = await depnd.save();
                    }
                }
                let ssnitBenf;
                let saveSsnitBenf;
                for (let i = 0; i < req.body.benfName.length; i++) {
                    if (req.body.benfName[i]) {
                        ssnitBenf = await new SSNITBenfit({
                            benName: req.body.benfName[i] || null,
                            percentage: req.body.percent[i] || null,
                            benPhone: req.body.benfPhone[i] || null,
                            benIDType: req.body.benfCardType[i] || null,
                            benIDNo: req.body.benfIDCard[i] || null,
                            benRelation: req.body.benfRelation[i] || null,
                            benAddress: req.body.benfAddress[i] || null,
                            benfGender: req.body.benfGender[i] || null,
                            benfDOB: req.body.benfDOB[i] || null,
                            benfImage: await genFunct.getArrayPath(req,'benfImage', i),
                            userId: req.user.id,
                            employeeId: saveEmp.id
                        });
                        saveSsnitBenf = await ssnitBenf.save();
                    }
                }

                let educationBacground;
                let saveEducationBacground;
                for (let i = 0; i < req.body.institution.length; i++) {
                    if (req.body.institution[i]) {
                        educationBacground = await new EducationBacground({
                            institution: req.body.institution[i] || null,
                            country: req.body.instCountry[i] || null,
                            fromMonthYear: req.body.fromDate[i] || null,
                            toMonthYear: req.body.toDate[i] || null,
                            qualification: req.body.qualification[i] || null,
                            programMajor: req.body.programMajor[i] || null,
                            userId: req.user.id,
                            employeeId: saveEmp.id
                        });
                        saveEducationBacground = await educationBacground.save();
                    }
                }

                let workExperience;
                let saveWorkExperience;
                for (let i = 0; i < req.body.orgName.length; i++) {
                    if (req.body.orgName[i]) {
                        workExperience = await new WorkExperience({
                            organization: req.body.orgName[i] || null,
                            position: req.body.position[i] || null,
                            fromMonthYear: req.body.orgFromDate[i] || null,
                            toMonthYear: req.body.orgToDate[i] || null,
                            userId: req.user.id,
                            employeeId: saveEmp.id
                        });
                        saveWorkExperience = await workExperience.save();
                    }
                }

                let emergencyContact;
                let saveEmergencyContact;
                for (let i = 0; i < req.body.emergenName.length; i++) {
                    if (req.body.emergenName[i]) {
                        emergencyContact = await new EmergencyContact({
                            emergName: req.body.emergenName[i] || null,
                            emergRelation: req.body.emergenRelation[i] || null,
                            emergPhone: req.body.emergenPhone[i] || null,
                            emergGender: req.body.emergGender[i] || null,
                            emergAddress: req.body.emergenAddress[i] || null,
                            emergIDType: req.body.emergenCardType[i] || null,
                            emergIDNo: req.body.emergenIDCard[i] || null,
                            emergimage: await genFunct.getArrayPath(req,'emergImage', i),
                            userId: req.user.id,
                            employeeId: saveEmp.id
                        });
                        saveEmergencyContact = await emergencyContact.save();
                    }
                }

                let nextOfKin;
                let saveNextOfKin;
                if (req.body.nOKName) {
                    nextOfKin = await new NextOfKin({
                        nokName: req.body.nOKName,
                        nokPhone: req.body.nOkPhone,
                        nokIDType: req.body.noKCardType,
                        nokIDNo: req.body.noKIDCard,
                        nokRelation: req.body.nOKRelation,
                        nokAddress: req.body.nOKAddress,
                        nokGender: req.body.noKGender,
                        nokImage: await genFunct.getPath(req,'noKImage'),
                        userId: req.user.id,
                        employeeId: saveEmp.id,
                    });
                    saveNextOfKin = await nextOfKin.save();
                }

                await genFunct.log(req, ['Added new Employee.', (await this.pathname(req)).toString()]);

                return res.status(200).json({
                    respon: 'Validated success',
                    path: `/${process.env.MENT}/validate-basic`,
                    pageTitle: 'Employee Basic Information',
                    data: req.body,
                    emp: saveEmp,
                    address: saveAddres,
                    reporto: saveReport,
                    bankDetails: saveBankDetails,
                    spouse: saveSpouse,
                    depend: saveDepnd,
                    ssnitBenf: saveSsnitBenf
                });
            }
            if (req.body.mode === 'edit') {
                let saveEmp;
                const thisDate = new Date();
                const getHash = await Employee.findOne({ where: { emplID: req.body.emph, deleted: 0 } });
                // console.log('getHash ==', getHash);
                if (getHash) {
                    const comp = await bcrypt.compare(`${getHash.staffID}${getHash.id}`, req.body.emph);
                    // console.log('comp ==', comp);
                    if (comp) {
                        let getEmp = await Employee.findByPk(getHash.id);
                        // (req.body.jobTitle !== getEmp.jobdescId) ? console.log('EmpJobHistory =>', +req.body.jobTitle, getEmp.jobdescId): console.log('EmpJobHistory3 =>', req.body.jobTitle, getEmp.jobdescId);

                        getEmp.deptCode = (getEmp.departmentId !== +req.body.dept) ? deptCode : getEmp.deptCode;
                        getEmp.jobCode = (+req.body.jobTitle !== getEmp.jobdescId) ? jobCode : getEmp.jobCode;
                        getEmp.salaryCode = (+req.body.salaryStruct !== getEmp.salarystructureId) ? salaryCode : getEmp.salaryCode;
                        // getEmp.superCode = (+req.body.immediatesuper !== getEmp.ReportTo) ? superCode : getEmp.ReportTo;
                        getEmp.staffID = req.body.staffID;
                        getEmp.title = req.body.title;
                        getEmp.fName = req.body.fName;
                        getEmp.mName = req.body.mName;
                        getEmp.lName = req.body.lName;
                        getEmp.gender = req.body.gender;
                        getEmp.dob = req.body.bdate;
                        getEmp.phone = req.body.phone;
                        getEmp.email = req.body.email;
                        getEmp.photo = await genFunct.getPath(req,'image');
                        getEmp.maritalStatus = req.body.mStatus;
                        getEmp.cardType = req.body.cardType;
                        getEmp.cardNo = req.body.idCard;
                        getEmp.tin = req.body.tin;
                        getEmp.ssnitNo = req.body.ssnitNo;
                        getEmp.ssnitCardImage = await genFunct.getPath(req,'ssnitimage');
                        getEmp.dateEmplyed = req.body.dateEmplyed;
                        getEmp.userId = req.user.id;
                        getEmp.departmentId = req.body.dept || null;
                        getEmp.jobdescId = req.body.jobTitle || null;
                        getEmp.salarystructureId = req.body.salaryStruct || null;
                        getEmp.leaveTypeId = req.body.leavtype || null;

                        saveEmp = await getEmp.save();
                        // console.log('SaveEmp => ', saveEmp);

                        (req.body.jobTitle !== getEmp.jobdescId) ? console.log('EmpJobHistory =>', jobCode, getEmp.jobCode): console.log('EmpJobHistory3 =>', jobCode, getEmp.jobCode, saveEmp.jobCode, req.body.jobTitle, getEmp.jobdescId);

                        if (getHash.departmentId !== +req.body.dept) {
                            await EmpDeptHistory.update({ to: thisDate }, { where: { dept_code: getHash.deptCode } });

                            await new EmpDeptHistory({ from: thisDate, dept_code: deptCode, departmentId: req.body.dept, employeeId: getEmp.id, userId: req.user.id }).save();
                        }
                        if (getHash.jobdescId !== +req.body.jobTitle) {
                            // console.log('EmpJobHistory => ', thisDate, getHash.jobCode);
                            await EmpJobHistory.update({ to: thisDate }, { where: { job_code: getHash.jobCode } });
                            await new EmpJobHistory({ from: thisDate, job_code: jobCode, jobdescId: req.body.jobTitle, employeeId: getEmp.id, userId: req.user.id }).save();
                        }
                        if (getHash.salarystructureId !== +req.body.salaryStruct) {
                            await EmpSalaryHistory.update({ to: thisDate }, { where: { salary_code: getHash.salaryCode } });
                            await new EmpSalaryHistory({ from: thisDate, salary_code: salaryCode, salarystructureId: req.body.salaryStruct, employeeId: getEmp.id, userId: req.user.id }).save();
                        }
                    } else {
                        await genFunct.log(req, ['Connot verify the employee you are trying to update, contact system administrator.', (await this.pathname(req)).toString()]);

                        return res.status(200).json({
                            respon: 'Validation failure',
                            path: `/${process.env.MENT}/validate-basic`,
                            pageTitle: 'Employee Basic Information',
                            data: req.body,
                            errorMessage: 'Connot verify the employee you are trying to update, contact system administrator.',
                            validationErrors: [{}],
                        });
                    }
                    // console.log('saveEmp2 ==', saveEmp);
                    let reportto = await ReportTo.findByPk(saveEmp.ReportToId);
                    console.log('Immediate => ', reportto.immediateSupEmplyId, +req.body.immediatesuper);
                    const imm = (!reportto.immediateSupEmplyId) ? 0 : reportto.immediateSupEmplyId;
                    if (imm !== +req.body.immediatesuper) {
                        if (getHash.superCode) {
                            await EmpSuperHistory.update({ to: thisDate }, { where: { super_code: getHash.superCode } });
                            await new EmpSuperHistory({ from: thisDate, super_code: superCode, reporttoId: reportto.id, employeeId: saveEmp.id, userId: req.user.id }).save();

                            await Employee.update({ superCode: superCode }, { where: { id: saveEmp.id } });

                        } else {
                            await new EmpSuperHistory({ from: thisDate, super_code: superCode, reporttoId: reportto.id, employeeId: saveEmp.id, userId: req.user.id }).save();

                            await Employee.update({ superCode: superCode }, { where: { id: saveEmp.id } });


                        }
                    }
                    reportto.reportToEmplyId = req.body.dept || null;
                    reportto.immediateSupEmplyId = req.body.immediatesuper || null;
                    reportto.employeeId = saveEmp.id;
                    const saveReport = await reportto.save();

                    const hash = await bcrypt.hashSync(`${req.body.staffID}${saveEmp.id}`, 12);
                    const updateEmp = await Employee.update({ ReportToId: saveReport.id, emplID: hash }, { where: { id: saveEmp.id } });

                    const address = await Address.update({
                        gpGPSCode: req.body.gpCode,
                        residAddress: req.body.residAddress,
                        postAddress: req.body.postAddress,
                        nearestLandmark: req.body.nearmark,
                        town: req.body.town,
                        region: req.body.region,
                        userId: req.user.id,
                    }, { where: { employeeId: saveEmp.id } });

                    let bankDetails = await BankDetail.findOne({ where: { employeeId: saveEmp.id, deleted: 0 } });
                    if (bankDetails) {
                        bankDetails.bankName = req.body.bankName;
                        bankDetails.branch = req.body.branch;
                        bankDetails.accNo = req.body.accNum;
                        bankDetails.userId = req.user.id;
                        await bankDetails.save();
                    } else {
                        let bankDetails;
                        let saveBankDetails;
                        if (req.body.bankName) {
                            bankDetails = await new BankDetail({
                                bankName: req.body.bankName,
                                branch: req.body.branch,
                                accNo: req.body.accNum,
                                userId: req.user.id,
                                employeeId: saveEmp.id,
                            });
                            saveBankDetails = await bankDetails.save();
                        }
                    }

                    let spouse = await Spouse.findOne({ where: { employeeId: saveEmp.id, deleted: 0 } });
                    if (spouse) {
                        if (req.body.mStatus === 'Married') {
                            spouse.spouseName = req.body.spName;
                            spouse.spouseDOB = req.body.spDOB || null;
                            spouse.spousePhone = req.body.spphone;
                            spouse.spousePhoto = await genFunct.getPath(req,'spImage');
                            spouse.spouseIDType = req.body.spcardType;
                            spouse.spouseIDNo = req.body.spIDCard;
                            spouse.userId = req.user.id;
                            await spouse.save();
                        }
                    } else {
                        let saveSpouse;
                        if (req.body.mStatus === 'Married') {
                            spouse = await new Spouse({
                                spouseName: req.body.spName,
                                spouseDOB: req.body.spDOB || null,
                                spousePhone: req.body.spphone,
                                spousePhoto: await genFunct.getPath(req,'spImage'),
                                spouseIDType: req.body.spcardType,
                                spouseIDNo: req.body.spIDCard,
                                userId: req.user.id,
                                employeeId: saveEmp.id
                            });
                            saveSpouse = await spouse.save();
                        }
                    }

                    let nextOfKin = await NextOfKin.findOne({ where: { employeeId: saveEmp.id, deleted: 0 } });
                    if (nextOfKin) {
                        nextOfKin.nokName = req.body.nOKName;
                        nextOfKin.nokPhone = req.body.nOkPhone;
                        nextOfKin.nokIDType = req.body.noKCardType;
                        nextOfKin.nokIDNo = req.body.noKIDCard;
                        nextOfKin.nokRelation = req.body.nOKRelation;
                        nextOfKin.nokAddress = req.body.nOKAddress;
                        nextOfKin.nokGender = req.body.noKGender;
                        nextOfKin.nokImage = await genFunct.getPath(req,'noKImage');
                        nextOfKin.userId = req.user.id;
                        await nextOfKin.save();
                    } else {
                        // console.log('Next ==> ', req.body.nOKName);
                        if (req.body.nOKName) {
                            let nextOfK = await new NextOfKin({
                                nokName: req.body.nOKName,
                                nokPhone: req.body.nOkPhone,
                                nokIDType: req.body.noKCardType,
                                nokIDNo: req.body.noKIDCard,
                                nokRelation: req.body.nOKRelation,
                                nokAddress: req.body.nOKAddress,
                                nokGender: req.body.noKGender,
                                nokImage: await genFunct.getPath(req,'noKImage'),
                                userId: req.user.id,
                                employeeId: saveEmp.id,
                            });
                            await nextOfK.save();
                        }
                    }

                    // Start here.
                    let educationBacground = await EducationBacground.findAll({ where: { deleted: 0, employeeId: saveEmp.id } });
                    if (educationBacground.length) {
                        if (educationBacground.length === req.body.educateID.length) {
                            for (let i = 0; i < req.body.educateID.length; i++) {
                                let getEdu = await EducationBacground.findByPk(req.body.educateID[i]);
                                if (getEdu) {
                                    if (req.body.institution[i]) {
                                        getEdu.institution = req.body.institution[i] || null;
                                        getEdu.country = req.body.instCountry[i] || null;
                                        getEdu.fromMonthYear = req.body.fromDate[i] || null;
                                        getEdu.toMonthYear = req.body.toDate[i] || null;
                                        getEdu.qualification = req.body.qualification[i] || null;
                                        getEdu.programMajor = req.body.programMajor[i] || null;
                                        getEdu.userId = req.user.id;
                                        getEdu.save();
                                    }
                                }
                            }

                            for (let i = 0; i < req.body.institution.length; i++) {
                                if (i > (req.body.educateID.length - 1)) {
                                    if (req.body.institution[i]) {
                                        let educateBackg = await new EducationBacground({
                                            institution: req.body.institution[i] || null,
                                            country: req.body.instCountry[i] || null,
                                            fromMonthYear: req.body.fromDate[i] || null,
                                            toMonthYear: req.body.toDate[i] || null,
                                            qualification: req.body.qualification[i] || null,
                                            programMajor: req.body.programMajor[i] || null,
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await educateBackg.save();
                                    }
                                }
                            }
                        }
                        if (educationBacground.length > req.body.educateID.length) {
                            for (let i = 0; i < educationBacground.length; i++) {
                                let getEdu = await EducationBacground.findByPk(educationBacground[i].id);
                                if (getEdu) {
                                    if (i < req.body.educateID.length) {
                                        getEdu.institution = req.body.institution[i] || null;
                                        getEdu.country = req.body.instCountry[i] || null;
                                        getEdu.fromMonthYear = req.body.fromDate[i] || null;
                                        getEdu.toMonthYear = req.body.toDate[i] || null;
                                        getEdu.qualification = req.body.qualification[i] || null;
                                        getEdu.programMajor = req.body.programMajor[i] || null;
                                        getEdu.userId = req.user.id;
                                        getEdu.save();
                                    } else {
                                        await EducationBacground.update({ deleted: 1 }, { where: { id: getEdu.id } });
                                    }
                                }
                            }
                            for (let i = 0; i < req.body.institution.length; i++) {
                                if (i > (req.body.educateID.length - 1)) {
                                    if (req.body.institution[i]) {
                                        let educateBackg = await new EducationBacground({
                                            institution: req.body.institution[i] || null,
                                            country: req.body.instCountry[i] || null,
                                            fromMonthYear: req.body.fromDate[i] || null,
                                            toMonthYear: req.body.toDate[i] || null,
                                            qualification: req.body.qualification[i] || null,
                                            programMajor: req.body.programMajor[i] || null,
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await educateBackg.save();
                                    }
                                }
                            }
                        }
                    } else {
                        let educationBacground;
                        for (let i = 0; i < req.body.institution.length; i++) {
                            if (req.body.institution[i]) {
                                educationBacground = await new EducationBacground({
                                    institution: req.body.institution[i] || null,
                                    country: req.body.instCountry[i] || null,
                                    fromMonthYear: req.body.fromDate[i] || null,
                                    toMonthYear: req.body.toDate[i] || null,
                                    qualification: req.body.qualification[i] || null,
                                    programMajor: req.body.programMajor[i] || null,
                                    userId: req.user.id,
                                    employeeId: saveEmp.id
                                });
                                await educationBacground.save();
                            }
                        }
                    } // End here.

                    // Start here.
                    let workExperience = await WorkExperience.findAll({ where: { deleted: 0, employeeId: saveEmp.id } });
                    if (workExperience.length) {
                        if (workExperience.length === req.body.workID.length) {
                            for (let i = 0; i < req.body.workID.length; i++) {
                                let getWork = await WorkExperience.findByPk(req.body.workID[i]);
                                if (getWork) {
                                    if (req.body.orgName[i]) {
                                        getWork.organization = req.body.orgName[i] || null;
                                        getWork.position = req.body.position[i] || null;
                                        getWork.fromMonthYear = req.body.orgFromDate[i] || null;
                                        getWork.toMonthYear = req.body.orgToDate[i] || null;
                                        getWork.userId = req.user.id;
                                        getWork.save();
                                    }
                                }
                            }

                            for (let i = 0; i < req.body.orgName.length; i++) {
                                if (i > (req.body.workID.length - 1)) {
                                    if (req.body.orgName[i]) {
                                        let workExp = await new WorkExperience({
                                            organization: req.body.orgName[i] || null,
                                            position: req.body.position[i] || null,
                                            fromMonthYear: req.body.orgFromDate[i] || null,
                                            toMonthYear: req.body.orgToDate[i] || null,
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await workExp.save();
                                    }
                                }
                            }
                        }
                        if (workExperience.length > req.body.workID.length) {
                            for (let i = 0; i < workExperience.length; i++) {
                                let getExp = await WorkExperience.findByPk(workExperience[i].id);
                                if (getExp) {
                                    if (i < req.body.workID.length) {
                                        getExp.organization = req.body.orgName[i] || null;
                                        getExp.position = req.body.position[i] || null;
                                        getExp.fromMonthYear = req.body.orgFromDate[i] || null;
                                        getExp.toMonthYear = req.body.orgToDate[i] || null;
                                        getExp.userId = req.user.id;
                                        getExp.save();
                                    } else {
                                        await WorkExperience.update({ deleted: 1 }, { where: { id: getExp.id } });
                                    }
                                }
                            }
                            for (let i = 0; i < req.body.orgName.length; i++) {
                                if (i > (req.body.workID.length - 1)) {
                                    if (req.body.orgName[i]) {
                                        let workExp = await new WorkExperience({
                                            organization: req.body.orgName[i] || null,
                                            position: req.body.position[i] || null,
                                            fromMonthYear: req.body.orgFromDate[i] || null,
                                            toMonthYear: req.body.orgToDate[i] || null,
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await workExp.save();
                                    }
                                }
                            }
                        }
                    } else {
                        let workExperience;
                        for (let i = 0; i < req.body.orgName.length; i++) {
                            if (req.body.orgName[i]) {
                                workExperience = await new WorkExperience({
                                    organization: req.body.orgName[i] || null,
                                    position: req.body.position[i] || null,
                                    fromMonthYear: req.body.orgFromDate[i] || null,
                                    toMonthYear: req.body.orgToDate[i] || null,
                                    userId: req.user.id,
                                    employeeId: saveEmp.id
                                });
                                await workExperience.save();
                            }
                        }
                    } // End here.

                    // Start here.
                    let depend = await Dependant.findAll({ where: { deleted: 0, employeeId: saveEmp.id } });
                    if (depend.length) {
                        // console.log('Depen ===>', depend.length);
                        if (depend.length === (req.body.depndID.length || depend.length)) {
                            for (let i = 0; i < req.body.depndID.length; i++) {
                                let getDepd = await Dependant.findByPk(req.body.depndID[i]);
                                if (getDepd) {
                                    if (req.body.depdName[i]) {
                                        getDepd.dependName = req.body.depdName[i] || null;
                                        getDepd.dependDOB = req.body.depdDOB[i] || null;
                                        getDepd.dependGender = req.body.depdGender[i] || null;
                                        getDepd.relation = req.body.depdRelation[i] || null;
                                        getDepd.dependPhone = req.body.depdPhone[i] || null;
                                        getDepd.dependIDType = req.body.depdCardType[i] || null;
                                        getDepd.dependIDNo = req.body.depdIDCard[i] || null;
                                        getDepd.dependAddress = req.body.depdAddress[i] || null;
                                        getDepd.dependimage = await genFunct.getArrayPath(req,'depdImage', i);
                                        getDepd.userId = req.user.id;
                                        getDepd.save();
                                    }
                                }
                            }
                            for (let i = 0; i < req.body.depdName.length; i++) {
                                if (i > (req.body.depndID.length - 1)) {
                                    if (req.body.depdName[i]) {
                                        let depnd = await new Dependant({
                                            dependName: req.body.depdName[i] || null,
                                            dependDOB: req.body.depdDOB[i] || null,
                                            dependGender: req.body.depdGender[i] || null,
                                            relation: req.body.depdRelation[i] || null,
                                            dependPhone: req.body.depdPhone[i] || null,
                                            dependIDType: req.body.depdCardType[i] || null,
                                            dependIDNo: req.body.depdIDCard[i] || null,
                                            dependAddress: req.body.depdAddress[i] || null,
                                            dependimage: await genFunct.getArrayPath(req,'depdImage', i),
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });

                                        await depnd.save();
                                    }
                                }
                            }
                        }
                        if (depend.length > req.body.depndID.length) {
                            for (let i = 0; i < depend.length; i++) {
                                let getDepd = await Dependant.findByPk(depend[i].id);
                                if (getDepd) {
                                    if (i < req.body.depndID.length) {
                                        getDepd.dependName = req.body.depdName[i] || null;
                                        getDepd.dependDOB = req.body.depdDOB[i] || null;
                                        getDepd.dependGender = req.body.depdGender[i] || null;
                                        getDepd.relation = req.body.depdRelation[i] || null;
                                        getDepd.dependPhone = req.body.depdPhone[i] || null;
                                        getDepd.dependIDType = req.body.depdCardType[i] || null;
                                        getDepd.dependIDNo = req.body.depdIDCard[i] || null;
                                        getDepd.dependAddress = req.body.depdAddress[i] || null;
                                        getDepd.dependimage = await genFunct.getArrayPath(req,'depdImage', i);
                                        getDepd.userId = req.user.id;
                                        getDepd.save();
                                    } else {
                                        const deleDepd = await Dependant.update({ deleted: 1 }, { where: { id: getDepd.id } });
                                    }
                                }
                            }

                            for (let i = 0; i < req.body.depdName.length; i++) {
                                if (i > (req.body.depndID.length - 1)) {
                                    if (req.body.depdName[i]) {
                                        let depnd = await new Dependant({
                                            dependName: req.body.depdName[i] || null,
                                            dependDOB: req.body.depdDOB[i] || null,
                                            dependGender: req.body.depdGender[i] || null,
                                            relation: req.body.depdRelation[i] || null,
                                            dependPhone: req.body.depdPhone[i] || null,
                                            dependIDType: req.body.depdCardType[i] || null,
                                            dependIDNo: req.body.depdIDCard[i] || null,
                                            dependAddress: req.body.depdAddress[i] || null,
                                            dependimage: await genFunct.getArrayPath(req,'depdImage', i),
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await depnd.save();
                                    }
                                }
                            }
                        }
                    } else {
                        let depnd;
                        for (let i = 0; i < req.body.depdName.length; i++) {
                            if (req.body.depdName[i]) {
                                depnd = await new Dependant({
                                    dependName: req.body.depdName[i] || null,
                                    dependDOB: req.body.depdDOB[i] || null,
                                    dependGender: req.body.depdGender[i] || null,
                                    relation: req.body.depdRelation[i] || null,
                                    dependPhone: req.body.depdPhone[i] || null,
                                    dependIDType: req.body.depdCardType[i] || null,
                                    dependIDNo: req.body.depdIDCard[i] || null,
                                    dependAddress: req.body.depdAddress[i] || null,
                                    dependimage: await genFunct.getArrayPath(req,'depdImage', i),
                                    userId: req.user.id,
                                    employeeId: saveEmp.id
                                });
                                await depnd.save();
                            }
                        }
                    } // End here.

                    // Start here.
                    let ssnitBenf = await SSNITBenfit.findAll({ where: { deleted: 0, employeeId: saveEmp.id } });
                    if (ssnitBenf.length) {
                        if (ssnitBenf.length === req.body.benfID.length) {
                            for (let i = 0; i < req.body.benfID.length; i++) {
                                let getSsnitBenf = await SSNITBenfit.findByPk(req.body.benfID[i]);
                                if (getSsnitBenf) {
                                    if (req.body.benfName[i]) {
                                        getSsnitBenf.benName = req.body.benfName[i] || null;
                                        getSsnitBenf.percentage = req.body.percent[i] || null;
                                        getSsnitBenf.benPhone = req.body.benfPhone[i] || null;
                                        getSsnitBenf.benIDType = req.body.benfCardType[i] || null;
                                        getSsnitBenf.benIDNo = req.body.benfIDCard[i] || null;
                                        getSsnitBenf.benRelation = req.body.benfRelation[i] || null;
                                        getSsnitBenf.benAddress = req.body.benfAddress[i] || null;
                                        getSsnitBenf.benfGender = req.body.benfGender[i] || null;
                                        getSsnitBenf.benfDOB = req.body.benfDOB[i] || null;
                                        getSsnitBenf.benfImage = await genFunct.getArrayPath(req,'benfImage', i);
                                        getSsnitBenf.userId = req.user.id;
                                        getSsnitBenf.save();
                                    }
                                }
                            }

                            for (let i = 0; i < req.body.benfName.length; i++) {
                                if (i > (req.body.benfID.length - 1)) {
                                    if (req.body.benfName[i]) {
                                        let ssnitBen = await new SSNITBenfit({
                                            benName: req.body.benfName[i] || null,
                                            percentage: req.body.percent[i] || null,
                                            benPhone: req.body.benfPhone[i] || null,
                                            benIDType: req.body.benfCardType[i] || null,
                                            benIDNo: req.body.benfIDCard[i] || null,
                                            benRelation: req.body.benfRelation[i] || null,
                                            benAddress: req.body.benfAddress[i] || null,
                                            benfGender: req.body.benfGender[i] || null,
                                            benfDOB: req.body.benfDOB[i] || null,
                                            benfImage: await genFunct.getArrayPath(req,'benfImage', i),
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await ssnitBen.save();
                                    }
                                }
                            }
                        }
                        if (ssnitBenf.length > req.body.benfID.length) {
                            for (let i = 0; i < ssnitBenf.length; i++) {
                                let getSsnitBenf = await SSNITBenfit.findByPk(ssnitBenf[i].id);
                                if (getSsnitBenf) {
                                    if (i < req.body.benfID.length) {
                                        getSsnitBenf.benName = req.body.benfName[i] || null;
                                        getSsnitBenf.percentage = req.body.percent[i] || null;
                                        getSsnitBenf.benPhone = req.body.benfPhone[i] || null;
                                        getSsnitBenf.benIDType = req.body.benfCardType[i] || null;
                                        getSsnitBenf.benIDNo = req.body.benfIDCard[i] || null;
                                        getSsnitBenf.benRelation = req.body.benfRelation[i] || null;
                                        getSsnitBenf.benAddress = req.body.benfAddress[i] || null;
                                        getSsnitBenf.benfGender = req.body.benfGender[i] || null;
                                        getSsnitBenf.benfDOB = req.body.benfDOB[i] || null;
                                        getSsnitBenf.benfImage = await genFunct.getArrayPath(req,'benfImage', i);
                                        getSsnitBenf.userId = req.user.id;
                                        getSsnitBenf.save();
                                    } else {
                                        await SSNITBenfit.update({ deleted: 1 }, { where: { id: getSsnitBenf.id } });
                                    }
                                }
                            }
                            for (let i = 0; i < req.body.benfName.length; i++) {
                                if (i > (req.body.benfID.length - 1)) {
                                    if (req.body.benfName[i]) {
                                        let ssnitBen = await new SSNITBenfit({
                                            benName: req.body.benfName[i] || null,
                                            percentage: req.body.percent[i] || null,
                                            benPhone: req.body.benfPhone[i] || null,
                                            benIDType: req.body.benfCardType[i] || null,
                                            benIDNo: req.body.benfIDCard[i] || null,
                                            benRelation: req.body.benfRelation[i] || null,
                                            benAddress: req.body.benfAddress[i] || null,
                                            benfGender: req.body.benfGender[i] || null,
                                            benfDOB: req.body.benfDOB[i] || null,
                                            benfImage: await genFunct.getArrayPath(req,'benfImage', i),
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await ssnitBen.save();
                                    }
                                }
                            }
                        }
                    } else {
                        let ssnitBenf;
                        for (let i = 0; i < req.body.benfName.length; i++) {
                            if (req.body.benfName[i]) {
                                ssnitBenf = await new SSNITBenfit({
                                    benName: req.body.benfName[i] || null,
                                    percentage: req.body.percent[i] || null,
                                    benPhone: req.body.benfPhone[i] || null,
                                    benIDType: req.body.benfCardType[i] || null,
                                    benIDNo: req.body.benfIDCard[i] || null,
                                    benRelation: req.body.benfRelation[i] || null,
                                    benAddress: req.body.benfAddress[i] || null,
                                    benfGender: req.body.benfGender[i] || null,
                                    benfDOB: req.body.benfDOB[i] || null,
                                    benfImage: await genFunct.getArrayPath(req,'benfImage', i),
                                    userId: req.user.id,
                                    employeeId: saveEmp.id
                                });
                                await ssnitBenf.save();
                            }
                        }
                    } // End here.

                    // Start here.
                    let emergencyContact = await EmergencyContact.findAll({ where: { deleted: 0, employeeId: saveEmp.id } });
                    if (emergencyContact.length) {
                        // console.log('log 1 =======>', req.body.emergGender);
                        if (emergencyContact.length === req.body.emergID.length) {
                            // console.log('log 2 =======>', req.body.emergGender);
                            for (let i = 0; i < req.body.emergID.length; i++) {
                                let getEmerg = await EmergencyContact.findByPk(req.body.emergID[i]);
                                if (getEmerg) {
                                    if (req.body.emergenName[i]) {
                                        getEmerg.emergName = req.body.emergenName[i] || null;
                                        getEmerg.emergRelation = req.body.emergenRelation[i] || null;
                                        getEmerg.emergPhone = req.body.emergenPhone[i] || null;
                                        getEmerg.emergGender = req.body.emergGender[i] || null;
                                        getEmerg.emergAddress = req.body.emergenAddress[i] || null;
                                        getEmerg.emergIDType = req.body.emergenCardType[i] || null;
                                        getEmerg.emergIDNo = req.body.emergenIDCard[i] || null;
                                        getEmerg.emergimage = await genFunct.getArrayPath(req,'emergImage', i);
                                        getEmerg.userId = req.user.id;
                                        await getEmerg.save();
                                    }
                                }
                            }

                            for (let i = 0; i < req.body.emergenName.length; i++) {
                                if (i > (req.body.emergID.length - 1)) {
                                    if (req.body.emergenName[i]) {
                                        let emerg = await new EmergencyContact({
                                            emergName: req.body.emergenName[i] || null,
                                            emergRelation: req.body.emergenRelation[i] || null,
                                            emergPhone: req.body.emergenPhone[i] || null,
                                            emergGender: req.body.emergGender[i] || null,
                                            emergAddress: req.body.emergenAddress[i] || null,
                                            emergIDType: req.body.emergenCardType[i] || null,
                                            emergIDNo: req.body.emergenIDCard[i] || null,
                                            emergimage: await genFunct.getArrayPath(req,'emergImage', i),
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await emerg.save();
                                    }
                                }
                            }
                        }
                        if (emergencyContact.length > req.body.emergID.length) {
                            for (let i = 0; i < emergencyContact.length; i++) {
                                let getEmerg = await EmergencyContact.findByPk(emergencyContact[i].id);
                                if (getEmerg) {
                                    if (i < req.body.emergID.length) {
                                        getEmerg.emergName = req.body.emergenName[i] || null;
                                        getEmerg.emergRelation = req.body.emergenRelation[i] || null;
                                        getEmerg.emergPhone = req.body.emergenPhone[i] || null;
                                        getEmerg.emergGender = req.body.emergGender[i] || null;
                                        getEmerg.emergAddress = req.body.emergenAddress[i] || null;
                                        getEmerg.emergIDType = req.body.emergenCardType[i] || null;
                                        getEmerg.emergIDNo = req.body.emergenIDCard[i] || null;
                                        getEmerg.emergimage = await genFunct.getArrayPath(req,'emergImage', i);
                                        getEmerg.userId = req.user.id;
                                        getEmerg.save();
                                    } else {
                                        await EmergencyContact.update({ deleted: 1 }, { where: { id: getEmerg.id } });
                                    }
                                }
                            }
                            for (let i = 0; i < req.body.emergenName.length; i++) {
                                if (i > (req.body.emergID.length - 1)) {
                                    if (req.body.emergenName[i]) {
                                        let emerg = await new EmergencyContact({
                                            emergName: req.body.emergenName[i] || null,
                                            emergRelation: req.body.emergenRelation[i] || null,
                                            emergPhone: req.body.emergenPhone[i] || null,
                                            emergGender: req.body.emergGender[i] || null,
                                            emergAddress: req.body.emergenAddress[i] || null,
                                            emergIDType: req.body.emergenCardType[i] || null,
                                            emergIDNo: req.body.emergenIDCard[i] || null,
                                            emergimage: await genFunct.getArrayPath(req,'emergImage', i),
                                            userId: req.user.id,
                                            employeeId: saveEmp.id
                                        });
                                        await emerg.save();
                                    }
                                }
                            }
                        }
                    } else {
                        let emergencyContact;
                        for (let i = 0; i < req.body.emergenName.length; i++) {
                            if (req.body.emergenName[i]) {
                                emergencyContact = await new EmergencyContact({
                                    emergName: req.body.emergenName[i] || null,
                                    emergRelation: req.body.emergenRelation[i] || null,
                                    emergPhone: req.body.emergenPhone[i] || null,
                                    emergGender: req.body.emergGender[i] || null,
                                    emergAddress: req.body.emergenAddress[i] || null,
                                    emergIDType: req.body.emergenCardType[i] || null,
                                    emergIDNo: req.body.emergenIDCard[i] || null,
                                    emergimage: await genFunct.getArrayPath(req,'emergImage', i),
                                    userId: req.user.id,
                                    employeeId: saveEmp.id
                                });
                                await emergencyContact.save();
                            }
                        }
                    } // End here. GR 1297 15 Nisssan 4X4
                }
                await genFunct.log(req, ['Updated employee informaton', (await this.pathname(req)).toString()]);

                return res.status(200).json({
                    respon: 'Validated success',
                    path: `/${process.env.MENT}/validate-basic`,
                    pageTitle: 'Employee Basic Information',
                    data: req.body,
                    emp: saveEmp,
                    // address: saveAddres,
                    // reporto: saveReport,
                    // bankDetails: saveBankDetails,
                    // spouse: saveSpouse,
                    // depend: saveDepnd,
                    // ssnitBenf: saveSsnitBenf
                });
            }
        } // else here
    } catch (err) {
        console.log('Error from validatesubmit ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';
        await genFunct.log(req, ['Sorry something went wrong in saving new employee data', (await this.pathname(req)).toString()]);

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }

    }
}

exports.getEmployee = async(req, res, next) => {
    const emplyId = req.params.emplyId;
    // console.log('IDs ===> ', emplyId);
    const emplData = [];
    let status = false;
    try {
        const getLeaveStatus = await Leaves.findAll({
            where: { deleted: 0, employeeId: emplyId, status: 'Approved' }
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
                id: emplyId,
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
        // console.log('Employee ===> ', 'employee');
        if (employee) {
            const jobDesc = await JobDesc.findOne({ where: { deleted: 0, id: employee.jobdescId } });
            const dept = await Department.findOne({ where: { deleted: 0, id: employee.departmentId } });
            const salary = await SalaryStructure.findOne({ where: { deleted: 0, id: employee.salarystructureId } });

            const annualLeave = await LeaveType.findOne({ where: { deleted: 0, id: employee.leaveTypeId } });

            let reportoNam;
            // console.log('Report: ', employee.reporttos[0].immediateSupEmplyId);
            if (employee.reporttos[0].immediateSupEmplyId) {
                const reportoName = await Employee.findOne({ where: { id: employee.reporttos[0].immediateSupEmplyId } });
                reportoNam = await {
                    name: `${reportoName.title || ''} ${reportoName.fName} ${genFunct.getFulName(reportoName.mName, reportoName.lName)}`
                };
            } else {
                reportoNam = { name: 'N/A' };
            }

            let deptHeadNam;
            if (dept) {
                const deptHeadName = await Employee.findOne({ where: { id: dept.headByEmployeeId } });
                if (deptHeadName) {
                    deptHeadNam = { name: `${(deptHeadName)? deptHeadName.title : ''} ${(deptHeadName)? deptHeadName.fName : ''} ${genFunct.getFulName((deptHeadName)?deptHeadName.mName : '', (deptHeadName)? deptHeadName.lName : '')}` };
                } else {
                    deptHeadNam = { name: 'N/A' };
                }
            } else {
                deptHeadNam = { name: 'N/A' };
            }

            await emplData.push(employee, jobDesc, dept, salary, reportoNam, deptHeadNam, annualLeave);

            await genFunct.log(req, ['Accessed employee data', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                employee: emplData,
                status: status,
                pageTitle: 'Employee Details for update and views',
                path: `/${process.env.MENT}/employee/emplyId`,
                length: emplData.length
            });
        } else {
            await genFunct.log(req, ['Accessed employee data', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                employee: emplData,
                pageTitle: 'Employee Details for update and view',
                path: `/${process.env.MENT}/employee/emplyId`,
            });
        }
    } catch (err) {
        console.log('Error from getEmloyee ===>', err);
        msg = 'Sorry something went wrong, please try again';
        await genFunct.log(req, ['Something went wrong in accessing employee data', (await this.pathname(req)).toString()]);

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.getEmployees = async(req, res, next, data = []) => {
    const emplData = [];
    const newStaff = [];
    const alert = [];
    let employees;
    let status = false;
    let leavTyp = 'N/A';
    let leavTypId = null;
    let hasHistory = false;
    try {
        if (req.user.role === 'Admin') {
            if (data.length !== 0 && data[1]) {
                // console.log('Data => ', data);
                employees = await Employee.findAll({
                    where: {
                        dateEmplyed: {
                            [Op.between]: [data[1], data[2]]
                        }
                    },
                    order: [
                        ['id', 'DESC']
                    ]
                });
            } else {
                // console.log('Data => none', data);
                employees = await Employee.findAll({
                    where: {
                        deleted: 0,
                    },
                    order: [
                        ['id', 'DESC']
                    ]
                });
            }
        }

        if (req.user.role === 'STDU') {
            employees = await Employee.findAll({
                where: {
                    id: req.user.currentUserEmployeeId,
                    deleted: 0,
                },
                order: [
                    ['id', 'DESC']
                ]
            });
        }

        if (req.user.role === 'HOD') {
            const dept = await Department.findOne({
                where: {
                    headByEmployeeId: req.user.currentUserEmployeeId,
                    deleted: 0,
                }
            });

            employees = await Employee.findAll({
                where: { departmentId: dept.id, deleted: 0 },
                order: [
                    ['id', 'DESC']
                ]
            });
        }
        // console.log('Data => []', employees);


        for (let i = 0; i < employees.length; i++) {

            const dept = await Department.findOne({ where: { deleted: 0, id: employees[i].departmentId } });

            const job = await JobDesc.findOne({ where: { deleted: 0, id: employees[i].jobdescId } });

            const onlev = await genFunct.onLeave(new Date(), employees[i].id);
            (onlev) ? alert.push(onlev) : null;
            if(employees[i].shiftId){
                const duty = await genFunct.offDuty(new Date(), employees[i].id, employees[i].shiftId);
            (duty) ? alert.push(duty) : '';
            }
            (!employees[i].shiftId) ? alert.push(await genFunct.getFullName(employees[i].id)+ 'has no shift') : '';
            const isOnDevice = await TerminalUser.findOne({ where: { employeeId: employees[i].id } });
            (!isOnDevice)? alert.push(await genFunct.getFullName(employees[i].id) + ' is not on the terminal') : ''

            const getLeaveStatus = await Leaves.findAll({
                where: { deleted: 0, employeeId: employees[i].id, status: 'Approved' }
            });
            for (let i = 0; i < getLeaveStatus.length; i++) {
                let date = Math.floor(new Date());
                let from = Math.floor(new Date(getLeaveStatus[i].from));
                let to = Math.floor(new Date(getLeaveStatus[i].to));
                if ((date >= from) && (date <= to)) {
                    status = true;
                    const getLe = await LeaveType.findOne({ where: { id: getLeaveStatus[i].leaveTypeId, deleted: 0 } });
                    leavTyp = getLe.leaveType;
                    leavTypId = getLeaveStatus[i].id;
                }
            }

            hasHistory = await genFunct.hasHistory(employees[i].id);

            async function isHOD() {
                if (employees[i].id == dept.headByEmployeeId) {
                    return await `${dept.deptName} (As Head)`;
                } else {
                    return await `${dept.deptName}`;
                }
            }

            let hod = '<label style="color:red">Vacant</label>';
            let superVise = '<label style="color:red">N/A</label>';

            async function getHOD() {

                const head = await Employee.findOne({ where: { id: dept.headByEmployeeId, deleted: 0 } });

                if (head) {
                    hod = `${head.title} ${head.fName} ${genFunct.getFulName(head.mName, head.lName)}`
                }

                const immediate = await ReportTo.findOne({ where: { employeeId: employees[i].id, deleted: 0 } });
                // console.log('immediate.immediateSupEmplyId =>', immediate);

                if (immediate) {
                    console.log('immediate.immediateSupEmplyId =>', immediate.immediateSupEmplyId);
                    const immediateSup = await Employee.findOne({ where: { id: immediate.immediateSupEmplyId, deleted: 0 } });

                    if (immediateSup) {
                        superVise = `${immediateSup.title} ${immediateSup.fName} ${genFunct.getFulName(immediateSup.mName, immediateSup.lName)}`;
                    }

                }

            }
            await getHOD();

            let data = await {
                id: employees[i].id,
                emplID: employees[i].emplID,
                staffID: employees[i].staffID,
                dateEmplyed: moment(employees[i].dateEmplyed).format('DD-MM-YYYY'),
                fullname: `${employees[i].title} ${employees[i].fName} ${genFunct.getFulName(employees[i].mName, employees[i].lName)}`,
                phone: employees[i].phone,
                email: employees[i].email,
                dept: (dept) ? dept.deptName : 'N/A',
                deptHOD: await isHOD(),
                hod: hod,
                superVise: superVise,
                photo: employees[i].photo,
                job: (job) ? job.jobTitle : 'N/A',
                status: status,
                leavTyp: leavTyp,
                leavTypId: leavTypId,
                hasHistory: hasHistory,

                image: `<img style="width: 75px; height: 55px; padding: 0px; margin: 0px;" src="/${employees[i].photo || 'img/avatar.svg'}">`
            }
            await emplData.push(data);
            status = false;
            leavTyp = 'N/A';
            leavTypId = null;
            hasHistory = false;
            hod = 'Vacant';
            superVise = 'N/A';

            let nowToday = moment(new Date()).format('YYYY-MM-DD 00:00:00');
            nowToday = Math.floor(new Date(nowToday) / 1000);

            const dateEmply = Math.floor(employees[i].dateEmplyed / 1000);
            const dateDff = nowToday - dateEmply;

            // console.log('nowToday, dateEmply, dateDff', nowToday, dateEmply, dateDff);

            if (dateDff <= 7948800) {
                const jobTitle = await JobDesc.findOne({ where: { id: employees[i].jobdescId } });

                newStaff.push(`${employees[i].title} ${employees[i].fName} ${genFunct.getFulName(employees[i].mName, employees[i].lName)} - ${jobTitle.jobTitle} - ${moment(employees[i].dateEmplyed).format('DD-MM-YYYY')}`);
            }

        }

        if (data[0]) {
            await genFunct.log(req, ['Accessed employee list for report', (await this.pathname(req)).toString()]);
            return emplData;
        }

        await genFunct.log(req, ['Accessed employee list', (await this.pathname(req)).toString()]);
        // console.log('Is day =>', alert);
        // console.log('Is day => ', await genFunct.onLeave(new Date(2021,5,24), 4), await genFunct.offDuty(new Date(2021,5,24), 4, 1), ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes('Monday'));
        return res.status(200).json({
            employees: emplData,
            newStaff: newStaff,
            alert: alert,
            pageTitle: 'Employee List',
            path: `/${process.env.MENT}/employees`,
        });
    } catch (err) {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            console.log('You => ', err);
            return errorsfile.get500(req, res, next, msg);
        }
    }
};


exports.getDepartments = async(req, res, next, data = []) => {
    try {
        let deptData;
        if (data.length !== 0 && data[1]) {
            deptData = await Department.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [data[1], data[2]]
                    },
                },
                order: [
                    ['id', 'DESC']
                ],
                include: [{
                    model: Employee,
                    // where: {
                    //     deleted: 0,
                    // },
                    // require: true,
                }]
            });
        } else {
            deptData = await Department.findAll({
                where: {
                    deleted: 0,
                },
                order: [
                    ['id', 'DESC']
                ],
                include: [{
                    model: Employee,
                    // where: {
                    //     deleted: 0,
                    // },
                    // require: true,
                }]
            });
        }
        // console.log('Dept ==> ', deptData[2].employees.length);

        // if (deptData) {
        const deptDataCompiled = [];
        let deptHead = 'Vacant';
        let emplID = null;
        let nofEmply = 0;

        for (let i = 0; i < deptData.length; i++) {
            const count = await Employee.findAndCountAll({ where: { departmentId: deptData[i].id, deleted: 0 } });
            // console.log('Count ==> ', count.count);

            if (deptData[i].headByEmployeeId) {
                // console.log('head ==> ', deptData[i].headByEmployeeId);
                const employ = await Employee.findOne({ where: { id: deptData[i].headByEmployeeId }, include: [{ model: JobDesc }] });
                if (employ) {
                    deptHead = `${employ.title || ''} ${employ.fName} ${genFunct.getFulName(employ.mName, employ.lName)} => ${employ.jobdesc.jobTitle}`;
                    emplID = employ.id;
                }
            }
            nofEmply = count.count;
            let data = await { id: deptData[i].id, date: moment(deptData[i].createdAt).format('DD-MM-YYYY'), deptName: deptData[i].deptName, description: deptData[i].description, deptHead: deptHead, nofEmply: nofEmply, emplID: emplID }

            deptDataCompiled.push(data);
            deptHead = 'Vacant';
            emplID = null;
            nofEmply = 0;

        }

        if (data.length == 0) {
            await genFunct.log(req, ['Accessed department data', (await this.pathname(req)).toString()]);
            return res.status(200).json({
                deptData: deptDataCompiled,
                pageTitle: 'Add Employee',
                path: `/${process.env.MENT}/add-employee`,
            });
        } else {
            return deptDataCompiled;
        }
        // }
    } catch (err) {
        console.log('Error from validateData ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

// for adding and editing department
exports.postAddEditDepartment = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // if (req.xhr) {
        await genFunct.log(req, [(await this.getValidationErrors('Validation error in adding department.\n', errors)), (await this.pathname(req)).toString()]);

        return res.status(422).json({
            path: `/${process.env.MENT}/add-department`,
            pageTitle: 'Add Department',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        });
        // }
    }

    try {
        // let deptHead;
        // if (!(
        //         req.body.deptHead === undefined ||
        //         req.body.deptHead === null ||
        //         req.body.deptHead === ''
        //     )) {
        //     deptHead = req.body.deptHead;
        // } else {
        //     deptHead;
        // }

        Department.findByPk(req.body.deptId)
            .then((dept) => {
                if (dept) {
                    dept.deptName = req.body.deptName;
                    dept.description = req.body.deptDesc;
                    // dept.headByEmployeeId = deptHead;
                    dept.userId = req.user.id;
                    return dept.save();
                } else {
                    let createDept = new Department({
                        deptName: req.body.deptName,
                        description: req.body.deptDesc,
                        deptHeadStatus: 'Vacant',
                        userId: req.user.id
                    });
                    createDept.save();
                }
            })
            .then(async(result) => {
                if (result) {
                    if (result.headByEmployeeId != undefined) {
                        await Department.update({ deptHeadStatus: 'Active' }, { where: { id: result.id } });
                    } else {
                        await Department.update({ deptHeadStatus: 'Vacant' }, { where: { id: result.id } });
                    }
                }
                Department.findAll().then(async(allDept) => {
                    await genFunct.log(req, ['Created department', (await this.pathname(req)).toString()]);

                    return res.status(201).json({
                        message: `Created department as ${req.body.deptName}`,
                        data: 'ok',
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ error: 'Something went wrong, please try again !!' });
            });
    } catch (err) {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.appointHOD = async(req, res, next) => {
    const imageFiles = ['supportDocument', 'supportDocumentIN'];
    // console.log('Body ===> ', req.body);
    const images = req.files;
    let path = [];
    console.log('Files ====>', images, 'Length ', path.length);

    const errors = validationResult(req);

    try {
        if (images) {
            for (let i = 0; i < imageFiles.length; i++) {
                if (images[`${imageFiles[i]}`]) {
                    await images[`${imageFiles[i]}`].map(p => path.push({ path: p.path }));
                }
            }
        }

        if (!errors.isEmpty()) {
            // console.log('Files ====>', path, 'Length ', path.length);
            for (let i = 0; i < path.length; i++) {
                let imageUrl = path[i].path;
                if (imageUrl) {
                    await fileHandler.deleteFile(imageUrl); // remove the image uploaded

                }
                // console.log('File path ====>', path[i].path);
            }
            // if (req.xhr) {
            await genFunct.log(req, [(await this.getValidationErrors('Validation error in appointing HOD.\n', errors)), (await this.pathname(req)).toString()]);

            return res.status(422).json({
                validationErrors: errors.array(),
            });
        }
        const deptId = req.body.deptID;
        const dept = await Department.findOne({ where: { id: deptId, deleted: 0 } });
        const curOutHeadEmply = await Employee.findOne({ where: { id: req.body.employID, deleted: 0 }, include: [{ model: JobDesc }] });
        if (!dept.headByEmployeeId) {
            const trackCode = Math.floor(new Date() / 1000);
            const saveHOD = await new HODsChanged({
                remarks: req.body.remarks,
                date: req.body.appointTerDate,
                statusAs: req.body.headStatus,
                position: curOutHeadEmply.jobdesc.jobTitle,
                file: await await genFunct.getPath(req,'supportDocument'),
                trackCode: trackCode,
                userId: req.user.id,
                employeeId: curOutHeadEmply.id,
                departmentId: dept.id,
            });
            await saveHOD.save();
            await Department.update({ deptHeadStatus: 'Active', headByEmployeeId: curOutHeadEmply.id, trackCode: trackCode }, { where: { id: dept.id } });
            // console.log('headByEmployeeId =>', dept.headByEmployeeId);

            await genFunct.log(req, ['Changed head of department.', (await this.pathname(req)).toString()]);

            return res.status(201).json({ data: 'ok' });
        } else if (dept.headByEmployeeId) {
            const newHeadEmply = await Employee.findOne({ where: { id: req.body.employIDIN, deleted: 0 }, include: [{ model: JobDesc }] });

            const trackCode = Math.floor(new Date() / 1000);
            const saveHOD = await new HODsChanged({
                remarks: req.body.remarks,
                date: req.body.appointTerDate,
                statusAs: req.body.headStatus,
                position: curOutHeadEmply.jobdesc.jobTitle,
                file: await await genFunct.getPath(req,'supportDocument'),
                trackCode: dept.trackCode,
                userId: req.user.id,
                employeeId: curOutHeadEmply.id,
                departmentId: dept.id,
            });
            await saveHOD.save();
            // for the incoming HOD
            const saveNewHOD = await new HODsChanged({
                remarks: req.body.remarksIN,
                date: req.body.appointTerDateIN,
                statusAs: req.body.headStatusIN,
                position: newHeadEmply.jobdesc.jobTitle,
                file: await await genFunct.getPath(req,'supportDocumentIN'),
                trackCode: trackCode,
                userId: req.user.id,
                employeeId: newHeadEmply.id,
                departmentId: dept.id,
            });
            await saveNewHOD.save();

            await Department.update({ deptHeadStatus: 'Active', headByEmployeeId: newHeadEmply.id, trackCode: trackCode }, { where: { id: dept.id } });

            await genFunct.log(req, ['Changed head of department.', (await this.pathname(req)).toString()]);

            return res.status(201).json({ data: 'ok' });
        }

    } catch (err) {
        console.log('Error from appointed HOD', err);
        return res.status(500).json({ error: 'Something went wrong' })
    }

}

exports.getHODHistory = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errorMessage: errors.array()[0].msg });
    }

    try {
        const deptId = req.params.deptId;
        const dataHistory = [];
        let istrackCode = [];

        const dept = await HODsChanged.findAll({ where: { departmentId: deptId, deleted: 0 } });

        for (let i = 0; i < dept.length; i++) {
            const trackCode = dept[i].trackCode;
            // istrackCode = trackCode;
            if (trackCode && (!istrackCode.includes(trackCode))) {
                istrackCode.push(trackCode);
                const countTimes = await HODsChanged.findAndCountAll({ where: { trackCode: trackCode }, include: [{ model: Employee }] });
                if (countTimes.count > 1) {
                    let data = { name: `${countTimes.rows[0].employee.title} ${countTimes.rows[0].employee.fName} ${genFunct.getFulName(countTimes.rows[0].employee.mName, countTimes.rows[0].employee.lName)}`, position: countTimes.rows[1].position, remarks: `Initial remarks: ${countTimes.rows[0].remarks} <br> Exit remarks: ${countTimes.rows[1].remarks}`, status: countTimes.rows[1].statusAs, from: moment(countTimes.rows[0].date).format('DD-MM-YYYY'), to: moment(countTimes.rows[1].date).format('DD-MM-YYYY'), files: `${countTimes.rows[0].file}=>${countTimes.rows[1].file}`, qty: 2, trackCode: trackCode }

                    dataHistory.push(data);
                }

                if (countTimes.count == 1) {
                    let data = { name: `${countTimes.rows[0].employee.title} ${countTimes.rows[0].employee.fName} ${genFunct.getFulName(countTimes.rows[0].employee.mName, countTimes.rows[0].employee.lName)}`, position: countTimes.rows[0].position, remarks: countTimes.rows[0].remarks, status: countTimes.rows[0].statusAs, from: moment(countTimes.rows[0].date).format('DD-MM-YYYY'), to: 'Date', files: `${countTimes.rows[0].file}`, qty: 1, trackCode: trackCode }

                    dataHistory.push(data);

                }
            }
        }

        await genFunct.log(req, ['View department head change history.', (await this.pathname(req)).toString()]);
        return res.status(200).json({ data: dataHistory })
    } catch (err) {
        console.log('Error from appointed HOD', err);

        return res.status(500).json({ error: 'Something went wrong' })

    }
}

exports.getDept = (req, res, next) => {
    const deptId = req.params.deptId;
    let dept;
    Department.findOne({
            where: {
                id: deptId,
                deleted: 0
            },
            include: [{
                model: User,
                // where: {
                //     deleted: 0,
                // },
                // require: true,
            }]
        })
        .then((department) => {
            if (!department) {
                return res.status(404).json({
                    none: 'Nothing found'
                });
            } else {
                Employee.findAndCountAll({
                    where: {
                        departmentId: deptId,
                        deleted: 0
                    }
                }).then(async countEmpl => {
                    if (countEmpl.count) {
                        if (department.headByEmployeeId) {
                            Employee.findByPk(+department.headByEmployeeId).then(async deptHead => {

                                await genFunct.log(req, ['View a department data with dept head and employee', (await this.pathname(req)).toString()]);

                                return res.status(200).json({
                                    basic: 'With dept head and employees',
                                    deptInfo: department,
                                    emplyInfo: deptHead,
                                    totalEmp: countEmpl.count
                                });
                            }).catch(err => {
                                console.log('Error from getEmployees ===>', err);
                                msg = 'Sorry something went wrong, please check your input and try again';

                                if (req.xhr) {
                                    return res.status(500).json({ error: msg });
                                } else {
                                    return errorsfile.get500(req, res, next, msg);
                                }
                            });
                        } else {

                            await genFunct.log(req, ['View department data without dept head but with employee', (await this.pathname(req)).toString()]);

                            return res.status(200).json({
                                basic: 'Without dept head but with employees',
                                deptInfo: department,
                                emplyInfo: [],
                                totalEmp: countEmpl.count
                            });
                        }

                    } else {
                        if (department.headByEmployeeId) {
                            Employee.findByPk(+department.headByEmployeeId).then(async deptHead => {
                                await genFunct.log(req, ['View department data wthout any employee but with dept head', (await this.pathname(req)).toString()]);

                                return res.status(200).json({
                                    basic: 'Without any employee but with dept head',
                                    deptInfo: department,
                                    emplyInfo: deptHead,
                                    totalEmp: 0
                                });
                            }).catch(err => {
                                console.log('Error from getEmployees ===>', err);
                                msg = 'Sorry something went wrong, please check your input and try again';

                                if (req.xhr) {
                                    return res.status(500).json({ error: msg });
                                } else {
                                    return errorsfile.get500(req, res, next, msg);
                                }
                            });
                        } else {
                            await genFunct.log(req, ['View department without any employee and dept head', (await this.pathname(req)).toString()]);

                            return res.status(200).json({
                                basic: 'Without any employee and dept head',
                                deptInfo: department,
                                emplyInfo: [],
                                totalEmp: 0
                            });
                        }
                    }

                }).catch(err => {
                    console.log('Error from getEmployees ===>', err);
                    msg = 'Sorry something went wrong, please check your input and try again';

                    if (req.xhr) {
                        return res.status(500).json({ error: msg });
                    } else {
                        return errorsfile.get500(req, res, next, msg);
                    }
                });
            }
        }).catch(err => {
            console.log('Error from getEmployees ===>', err);
            msg = 'Sorry something went wrong, please check your input and try again';

            if (req.xhr) {
                return res.status(500).json({ error: msg });
            } else {
                return errorsfile.get500(req, res, next, msg);
            }
        });
};

exports.getJobTitle = (req, res, next) => {
    const jobId = req.params.jobId;

    JobDesc.findOne({
        where: {
            id: jobId,
            deleted: 0
        }
    }).then((job) => {
        if (!job) {
            return res.status(404).json({
                none: 'Nothing found'
            });
        } else {
            Employee.findAndCountAll({
                where: {
                    jobdescId: jobId,
                    deleted: 0
                }

            }).then(async countJob => {
                if (countJob.count) {
                    await genFunct.log(req, ['Accessed job description', (await this.pathname(req)).toString()]);

                    return res.status(200).json({
                        jobDesc: job,
                        totalEmp: countJob.count
                    });
                } else {
                    await genFunct.log(req, ['Accessed job decription', (await this.pathname(req)).toString()]);

                    return res.status(200).json({
                        jobDesc: job,
                        totalEmp: 0
                    });
                }
            }).catch(err => {
                console.log('Error from getEmployees ===>', err);
                msg = 'Sorry something went wrong, please try again';

                if (req.xhr) {
                    return res.status(500).json({ error: msg });
                } else {
                    return errorsfile.get500(req, res, next, msg);
                }
            });
        }
    }).catch(err => {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    })
}


exports.getJobTitleDesc = (req, res, next, data = []) => {
    let jobdesc
    if (data.length !== 0 && data[1]) {
        jobdesc = JobDesc.findAll({
            where: {
                createdAt: {
                    [Op.between]: [data[1], data[2]]
                },
            },
            order: [
                ['id', 'DESC']
            ]
        });
    } else {
        jobdesc = JobDesc.findAll({
            where: { deleted: 0 },
            order: [
                ['id', 'DESC']
            ]
        })
    }
    return jobdesc.then(async desc => {
        // console.log('DESC => ', desc);
        if (desc) {
            const decs = [];
            for (let i = 0; i < desc.length; i++) {
                const totalEmp = await Employee.findAndCountAll({ where: { jobdescId: desc[i].id, deleted: 0 } });

                let data = await { id: desc[i].id, date: moment(desc[i].createdAt).format('DD-MM-YYYY'), jobTitle: desc[i].jobTitle, jobDescription: desc[i].jobDescription, jobSummary: desc[i].jobSummary, keyDutiesRespon: desc[i].keyDutiesRespon, total: totalEmp.count };
                await decs.push(data);
            }

            if (!data.length) {
                await genFunct.log(req, ['Accessed job description', (await this.pathname(req)).toString()]);
                return res.status(200).json({
                    jobTitleDesc: decs
                });
            }
            return decs;
        } else {
            return res.status(500).json({
                error: "Something happened"
            })
        }
    }).catch(err => {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please try again.';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }

    })
};

exports.postEditJobTitle = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // if (req.xhr) {
        return res.status(422).json({
            path: `/${process.env.MENT}/add-jobTitle`,
            pageTitle: 'Add Title',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        });
        // }
    }

    JobDesc.findByPk(req.body.jobdescId).then(async result => {
            if (result) {
                result.jobTitle = req.body.jobPosition;
                result.jobDescription = req.body.jobDesc;
                result.jobSummary = req.body.jobSummary;
                result.keyDutiesRespon = req.body.keyRespn;
                result.userId = req.user.id;

                await genFunct.log(req, ['Updated job description', (await this.pathname(req)).toString()]);

                return result.save().then(update => {
                        JobDesc.findAll().then((allJob) => {
                            console.log('Updated Job title');
                            res.status(201).json({
                                message: `Updated Job title}`,
                                data: allJob,
                            });
                        });
                    })
                    .catch((err) => {
                        console.log('Error from getEmployees ===>', err);
                        msg = 'Sorry something went wrong, please check your input and try again';

                        if (req.xhr) {
                            return res.status(500).json({ error: msg });
                        } else {
                            return errorsfile.get500(req, res, next, msg);
                        }
                    });
            }
            const job = new JobDesc({
                jobTitle: req.body.jobPosition,
                jobDescription: req.body.jobDesc,
                jobSummary: req.body.jobSummary,
                keyDutiesRespon: req.body.keyRespn,
                userId: req.user.id
            });
            return job.save()
                .then(async(saveJob) => {
                    JobDesc.findAll().then(async(allJob) => {
                        console.log('Created Job title');
                        await genFunct.log(req, ['Created new job description', (await this.pathname(req)).toString()]);

                        return res.status(201).json({
                            message: `Created Job title}`,
                            data: allJob,
                        });
                    });
                })
        })
        .catch((err) => {
            console.log('Error from getEmployees ===>', err);
            msg = 'Sorry something went wrong, please check your input and try again';

            if (req.xhr) {
                return res.status(500).json({ error: msg });
            } else {
                return errorsfile.get500(req, res, next, msg);
            }
        });
}

// Save and update salary structure
exports.postSaveEditSalaryStructure = async(req, res, next) => {
    const errors = validationResult(req);
    const mode = req.body.mode;
    try {

        if (!errors.isEmpty()) {
            // if (req.xhr) {
            return res.status(422).json({
                path: `/${process.env.MENT}/add-salaryStructure`,
                pageTitle: 'Add Salary Structure',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
            // }
        }

        if (mode === 'add') {
            const salary = await new SalaryStructure({
                grade: req.body.grade,
                notch: req.body.notch,
                basic: req.body.basic,
                description: req.body.salaryDesc,
                userId: req.user.id,
                // jobdescId: req.body.job
            });
            const saveSalary = await salary.save();

            if (saveSalary) {
                let allowance;
                for (let i = 0; i < req.body.allwnce.length; i++) {
                    if (req.body.allwnce[i]) {
                        allowance = await new Allowance({
                            allwTitle: req.body.allwTitle[i],
                            allwAmount: req.body.allwnce[i],
                            salarystructureId: saveSalary.id,
                            userId: req.user.id
                        });

                        await allowance.save();
                    }
                }
                if (allowance) {
                    await genFunct.log(req, ['Created salary structure', (await this.pathname(req)).toString()]);

                    return res.status(201).json({
                        message: 'Salary structure created',
                    });
                }
            }
        } else if (mode === 'edit') {
            const salaryStruct = await SalaryStructure.findByPk(req.body.salaID);
            if (salaryStruct) {
                salaryStruct.grade = req.body.editgrade;
                salaryStruct.notch = (req.body.editnotch) ? req.body.editnotch : null;
                salaryStruct.basic = req.body.editbasic;
                salaryStruct.description = req.body.editsalaryDesc;
                salaryStruct.userId = req.user.id;
                // salaryStruct.jobdescId = req.body.editjob;
                const saveStruct = await salaryStruct.save();

                if (saveStruct) {
                    await genFunct.log(req, ['Updated salary structure', (await this.pathname(req)).toString()]);

                    return res.status(201).json({
                        message: 'Salary structure updated',
                    });
                } else {
                    return res.status(422).json({
                        message: 'Data not updated'
                    });
                }

            } else {
                return res.status(422).json({
                    path: `/${process.env.MENT}/add-salaryStructure`,
                    pageTitle: 'Add Salary Structure',
                    errorMessage: 'Error in else',
                    validationErrors: [],
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Sorry someting went wrong!!"
        });
    }

}

exports.postSaveAllowance = async(req, res, next) => {
    const errors = validationResult(req);
    try {

        if (!errors.isEmpty()) {
            // if (req.xhr) {
            return res.status(422).json({
                path: `/${process.env.MENT}/add-salaryStructure`,
                pageTitle: 'Add Salary Structure',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
            // }
        }
        const allowance = await Allowance.findByPk(req.body.allwID);

        if (allowance) {
            allowance.allwTitle = req.body.allwTitle;
            allowance.allwAmount = req.body.amount;
            allowance.salarystructureId = req.body.salStruct;
            allowance.userId = req.user.id;
            await allowance.save();
            // console.log('Body ======>', errors.params);
            await genFunct.log(req, ['Updated allowance', (await this.pathname(req)).toString()]);

            return res.status(201).json({
                message: `Allowance updated.`,
            });
        } else {
            await req.user.createAllowance({
                allwTitle: req.body.allwTitle,
                allwAmount: req.body.amount,
                salarystructureId: req.body.salStruct
            });
            await genFunct.log(req, ['Created allowance', (await this.pathname(req)).toString()]);

            return res.status(201).json({
                message: `Allowance created.`
            });
        }
    } catch (err) {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}


exports.deleteSalaryStruct = async(req, res, next) => {
    const salaryId = req.params.salaryId;
    try {
        const getSala = await SalaryStructure.findByPk(salaryId);

        if (getSala) {
            getSala.deleted = 1;
            const deleteSalay = await getSala.save();
            if (deleteSalay) {
                await genFunct.log(req, ['Deleted salary structure', (await this.pathname(req)).toString()]);

                return res.status(200).json({
                    message: `Data deleted.}`,
                    // data: update,
                });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Sorry someting went wrong!!"
        });
    }

}

exports.deleteAllowance = async(req, res, next) => {
    const allwId = req.params.allwId;
    try {
        const getAllw = await Allowance.findByPk(allwId);

        if (getAllw) {
            getAllw.deleted = 1;
            const deleteAllw = await getAllw.save();
            if (deleteAllw) {

                await genFunct.log(req, ['Deleted allowance', (await this.pathname(req)).toString()]);

                return res.status(200).json({
                    message: `Data deleted.}`,
                });

            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Sorry someting went wrong!!"
        });
    }
}

exports.postSaveTax = async(req, res, next) => {
    const errors = validationResult(req);
    try {

        if (!errors.isEmpty()) {
            // if (req.xhr) {
            return res.status(422).json({
                path: `/${process.env.MENT}/postSaveTax`,
                pageTitle: 'Add Tax Structure',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
            // }
        }
        // const first = `${req.body.nextOneAmt}_${req.body.nextOneRate}`;
        // console.log('first', first);
        const taxStructure = await TaxStruct.findByPk(req.body.taxID);
        if (taxStructure) {
            const saveTaxSt = await new TaxStruct({
                first: `${req.body.miniW}_0`,
                nextOne: `${req.body.nextOneAmt}_${req.body.nextOneRate}`,
                nextTwo: `${req.body.nextTwoAmt}_${req.body.nextTwoRate}`,
                nextThree: `${req.body.nextThreeAmt}_${req.body.nextThreeRate}`,
                nextFour: `${req.body.nextFourAmt}_${req.body.nextFourRate}`,
                exceeding: `${req.body.exceedAmt}_${req.body.exceedRate}`,
                userId: req.user.id
            });
            await saveTaxSt.save();
            await TaxStruct.update({ deleted: 1 }, { where: { id: req.body.taxID } });

            await genFunct.log(req, ['Tax data save', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                message: 'Tax data save successfully',
            });
        }

    } catch (err) {
        // console.log(err);
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.postSaveSSNIT = async(req, res, next) => {
    const errors = validationResult(req);
    try {

        if (!errors.isEmpty()) {
            // if (req.xhr) {
            return res.status(422).json({
                path: `/${process.env.MENT}/postSaveSSNIT`,
                pageTitle: 'Add SSNIT Structure',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
            // }
        }

        const ssnitStructure = await SSNITStruct.findByPk(req.body.sstID);
        if (ssnitStructure) {
            const saveSsnitSt = await new SSNITStruct({
                teirOne: req.body.t1,
                teirTwo: req.body.t2,
                userId: req.user.id
            });
            await saveSsnitSt.save();
            await SSNITStruct.update({ deleted: 1 }, { where: { id: req.body.sstID } });

            await genFunct.log(req, ['SSNIT data save', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                message: 'SSNIT data save succefully',
            });
        }

    } catch (err) {
        console.log('Error from ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

// Get all salary structures
exports.getSalaryStructure = async(req, res, next, data = []) => {
    const salaryData = [];
    let total;
    let totalNo;
    let totalAllw;
    let salaryStru;
    try {
        if (data.length !== 0 && data[1]) {
            // console.log('Data => ', data);
            salaryStru = await SalaryStructure.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [data[1], data[2]]
                    },
                },
                include: [{
                    model: User,
                }]
            });
        } else {
            salaryStru = await SalaryStructure.findAll({
                where: {
                    deleted: 0
                },
                include: [{
                    model: User,
                }]
            });
        }

        if (salaryStru) {
            const allowane = await Allowance.findAll({
                where: {
                    deleted: 0
                },
                include: [{
                    model: SalaryStructure,
                    where: {
                        deleted: 0,
                    },
                    require: false,
                }]
            });

            let ssnit = await SSNITStruct.findOne({ where: { deleted: 0 } });
            ssnitTeir = (ssnit) ? ssnit.teirOne : 0;
            // console.log('SSNIT => ', ssnit.teirOne);
            const tax = await TaxStruct.findOne({ where: { deleted: 0 } });
            // console.log('allowane ==>', allowane[0].salaryStructure.id);
            let getId = 1;
            // console.log('salaryStru.length => ', salaryStru.length);
            while (salaryStru.length >= getId) {
            console.log('salaryStru.length => ', getId, salaryStru.length);
                let index = +getId - 1;
                const emp = await Employee.findAndCountAll({
                    where: {
                        salarystructureId: salaryStru[index].id,
                        deleted: 0
                    }
                });

                const allw = await Allowance.findAndCountAll({
                    where: {
                        salarystructureId: salaryStru[index].id,
                        deleted: 0
                    }
                });

                total = emp.count;
                totalNo = allw.count;
                totalAllw = 0;

                for (let i = 0; i < totalNo; i++) {
                    totalAllw += allw.rows[i].allwAmount;
                // console.log('TotalAllw=> => ', totalAllw);
                }
                // console.log('TotalAllw => ', totalAllw);

                // console.log('Grade ==>', allw.rows[0].allwAmount);

                const data = await {
                    id: salaryStru[index].id,
                    // jobTitle: salaryStru[index].jobdesc.jobTitle,
                    // jobID: salaryStru[index].jobdesc.id,
                    grade: salaryStru[index].grade,
                    notch: (salaryStru[index].notch) ? salaryStru[index].notch : 'N/A',
                    basic: salaryStru[index].basic.toFixed(2),
                    date: moment(salaryStru[index].createdAt).format('DD-MM-YYYY'),
                    // ssnit: salaryStru[index].ssintDeduct,
                    totalAllw: totalAllw.toFixed(2),
                    totalNo: totalNo,
                    totalEmp: total,
                    totalBasic: (salaryStru[index].basic * total).toFixed(2),
                    // aftTax: ((salaryStru[index].basic * total) - ((salaryStru[index].basic * total) * salaryStru[index].taxDeduct / 100)),
                    aftT1BeforeTax: ((salaryStru[index].basic * total) + ((salaryStru[index].basic * total) * (ssnitTeir / 100)) + (totalAllw * total)).toFixed(2),
                    // aftAllwnce: ((salaryStru[index].basic * total) + (salaryStru[index].allowance * total)),
                    by: salaryStru[index].user.name,
                    description: salaryStru[index].description
                }
                await salaryData.push(data);
                getId += 1;
            }
            // console.log('Total => ', (totalAllw * total));

            if (!data.length) {
                await genFunct.log(req, ['View salary structure', (await this.pathname(req)).toString()]);
                return res.status(200).json({
                    compiledData: salaryData,
                    salaryStru: salaryStru,
                    allowane: allowane,
                    ssnit: ssnit,
                    tax: tax
                });
            }
            return salaryData;
        } else {
            console.log('In Else');
            res.status(404).json({
                none: "No data found"
            });
        }
    } catch (err) {
        console.log('In catch of getsalaryStructures ===> ', err);
        return res.status(500).json({
            error: "Sorry someting went wrong!!"
        });
    }
};

exports.getCountries = async(req, res, next) => {

    try {
        await genFunct.log(req, ['Accessed country data', (await this.pathname(req)).toString()]);

        return res.status(200).json({
            data: countries
        });
    } catch (err) {
        console.log('Error from getcountries ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.getLeaveTypes = async(req, res, next) => {
    try {

        let yearStart = await moment().startOf('year');
        let yearEnd = await moment().endOf('year');
        yearStart = yearStart.format('YYYY-MM-DD HH:m:s');
        yearEnd = yearEnd.format('YYYY-MM-DD HH:m:s');

        const leaveType = await LeaveType.findAll({ where: { deleted: 0 } });
        if (leaveType) {
            await genFunct.log(req, ['Accessed leave type', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                leaves: leaveType,
                yearStart: yearStart,
                yearEnd: yearEnd
            });
        } else {
            await genFunct.log(req, ['Accessed leave type', (await this.pathname(req)).toString()]);

            return res.status(200).json({
                leaves: []
            });
        }
    } catch (err) {
        console.log('Error from ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.postSaveLeaveType = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                path: `/${process.env.MENT}/postSaveLeaveType`,
                pageTitle: 'Create leave type',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }

        if (req.body.leaveMode === 'add') {
            const leaveType = await new LeaveType({
                leaveType: req.body.leaveType,
                description: req.body.leaveDesc,
                nofdays: req.body.nofdays,
                carryon: req.body.carryon,
                genderBased: req.body.genderbased,
                userId: req.user.id
            });

            await leaveType.save();
            if (leaveType) {

                await genFunct.log(req, ['Created leave type', (await this.pathname(req)).toString()]);

                return res.status(201).json({
                    data: 'leave type created sucess.'
                });
            }
        }
        if (req.body.leaveMode === 'edit') {
            let leaveType = await LeaveType.findByPk(req.body.leaveID);

            if (leaveType) {
                leaveType.leaveType = req.body.leaveType;
                leaveType.description = req.body.leaveDesc;
                leaveType.nofdays = req.body.nofdays;
                leaveType.carryon = req.body.carryon;
                leaveType.genderBased = req.body.genderbased;
                leaveType.userId = req.user.id;

                await leaveType.save();

                if (leaveType) {
                    await genFunct.log(req, ['Updated leave type', (await this.pathname(req)).toString()]);

                    return res.status(201).json({
                        data: 'leave type updated sucess.'
                    });
                }
            }
        }
    } catch (err) {
        console.log('Error from ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.removeLeaveType = async(req, res, next) => {
    const leaveID = req.params.leaveID;
    // console.log('UP0 =====> ', leaveID);

    try {
        const up = await LeaveType.update({ deleted: 1 }, { where: { id: leaveID } });
        if (up) {
            // console.log('UP1 =====> ', up);
            await genFunct.log(req, ['Deleted leave type', (await this.pathname(req)).toString()]);

            return res.status(200).json({ ok: 'Leave type deleted' });
        } else {
            // console.log('UP2 =====> ', up);

            return res.status(200).json({ ok: 'Leave type not deleted' });
        }
    } catch (err) {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.getLeaves = async(req, res, next) => {
    try {
        const leavesID = req.params.leavesID;
        const emply_id = req.params.emply_id;
        let total = 0;
        let casual_total = 0;

        let yearStart = moment().startOf('year');
        let yearEnd = moment().endOf('year');

        yearStart = yearStart.format('YYYY-MM-DD HH:m:s');
        yearEnd = yearEnd.format('YYYY-MM-DD HH:m:s');

        const leas = await Leaves.findAll({
            where: {
                createdAt: {
                    [Op.between]: [yearStart, yearEnd]
                },
                deleted: 0,
                leaveTypeId: leavesID,
                employeeId: emply_id,
                status: 'Approved'
            },
            include: [{
                model: Employee,
                where: {
                    deleted: 0,
                },
                require: false,
            }]

        });

        const leas_casual = await Leaves.findAll({
            where: {
                createdAt: {
                    [Op.between]: [yearStart, yearEnd]
                },
                deleted: 0,
                employeeId: emply_id,
                status: 'Approved'
            },
            include: [{
                model: LeaveType,
                where: {
                    deleted: 0,
                },
                require: false,
            }]
        });

        for (let i = 0; i < leas.length; i++) {
            total += +leas[i].days;
        }

        const getEmply = await Employee.findOne({
            where: { leaveTypeId: leavesID, deleted: 0 },
            include: [{
                model: LeaveType,
                where: {
                    deleted: 0,
                },
                require: false,
            }]
        });

        if (getEmply) {
            const casual = /CASUAL/;
            for (let i = 0; i < leas_casual.length; i++) {
                let leaty = leas_casual[i].leaveType.leaveType;
                if (casual.test(leaty.toUpperCase())) {
                    casual_total += +leas_casual[i].days;
                }
            }

            total = +(casual_total + total);
            console.log('leaveType.nofdays', total);
        }

        if (leas) {
            await genFunct.log(req, ['Accessed leave type with employee data', (await this.pathname(req)).toString()]);

            return res.status(200).json({ getAll: total, getAll1: getEmply });
        }


    } catch (err) {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.applyLeave = async(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            path: `/${process.env.MENT}/applyLeave`,
            pageTitle: 'Apply Leave',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        });
    }
    try {

        const id = req.body.leave_id.split('_');
        const getLeaType = await LeaveType.findOne({ where: { id: id[0], deleted: 0 } });
        let fr = new Date(req.body.fromDate);
        let to = new Date(req.body.toDate);

        const ttl = Math.floor(fr / 1000);
        const ttl2 = Math.floor(to / 1000);
        const days = (((ttl2 - ttl) / 1440) / 60);
        const leaves = await new Leaves({
            expecteddays: getLeaType.nofdays,
            from: req.body.fromDate,
            to: `${req.body.toDate} 23:59:59`,
            days: days,
            reason: req.body.reason,
            fileupload: await await genFunct.getPath(req,'attFile'),
            userId: req.user.id,
            leaveTypeId: id[0],
            employeeId: req.body.emply_id,
            employId: req.body.approvedBy
        });
        const lev = await leaves.save();
        const leaveProcess = await new LeavesProcess({
            remarks: 'Pending stage',
            userId: req.user.id,
            leaveId: lev.id
        });
        await leaveProcess.save();

        await genFunct.log(req, ['Applied for leave', (await this.pathname(req)).toString()]);

        return res.status(200).json({ data: leaves });

    } catch (err) {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.getAllLeaves = async(req, res, next, data = false) => {
    const pendLeave = [];
    let leaves;
    let where = ''
    try {
        if (req.user.role === 'Admin') {
            // console.log('Admin =====> ', 1);
            leaves = await Leaves.findAll({
                where: { deleted: 0 },
                order: [
                    ['id', 'DESC']
                ],
                include: [{
                        model: User,
                    },
                    {
                        model: Employee,
                    },

                    {
                        model: LeaveType,
                        where: {
                            deleted: 0,
                        },
                        require: false,
                    },
                ]
            });
            where = 'Admin'
        }
        if (req.user.role === 'STDU') {
            // console.log('STDU =====> ', 2);

            leaves = await Leaves.findAll({
                where: { employeeId: req.user.currentUserEmployeeId, deleted: 0 },
                order: [
                    ['id', 'DESC']
                ],
                include: [{
                        model: User,
                    },
                    {
                        model: Employee,

                    },

                    {
                        model: LeaveType,
                        where: {
                            deleted: 0,
                        },
                        require: false,
                    },

                ]
            });

            where = 'STDU'

        }

        if (req.user.role === 'HOD') {
            // console.log('STDU =====> ', 2);
            leaves = await Leaves.findAll({
                where: { deleted: 0 },
                order: [
                    ['id', 'DESC']
                ],
                include: [{
                        model: User,
                        // where: {
                        //     deleted: 0,
                        // },
                        // require: false,
                    },
                    {
                        model: Employee,

                    },

                    {
                        model: LeaveType,
                        where: {
                            deleted: 0,
                        },
                        require: false,
                    },

                ]
            });
            where = 'HOD'
            // console.log('Leaves HOD =>', leaves);
        }

        if (req.user.role === 'HOD') {
            const hodid = await Department.findOne({ where: { headByEmployeeId: req.user.currentUserEmployeeId, deleted: 0 } });
            for (let i = 0; i < leaves.length; i++) {
                const dept = await Department.findOne({ where: { id: leaves[i].employee.departmentId, headByEmployeeId: req.user.currentUserEmployeeId, deleted: 0 } });

                const approvEmpl = await Employee.findOne({ where: { id: leaves[i].employId } }); //, departmentId: hodid.id

                const jobDesc = await JobDesc.findOne({ where: { id: leaves[i].employee.jobdescId } });

                if (dept && approvEmpl) {
                    let data = { id: leaves[i].id, date: leaves[i].createdAt, name: `${leaves[i].employee.title || ''} ${leaves[i].employee.fName} ${genFunct.getFulName(leaves[i].employee.mName, leaves[i].employee.lName)}`, dept: `${(dept)? dept.deptName : 'N/A'}`, from: leaves[i].from, to: leaves[i].to, days: leaves[i].days, leaveType: leaves[i].leaveType.leaveType, status: leaves[i].status, reason: leaves[i].reason, exp: leaves[i].leaveType.nofdays, remark: leaves[i].remarks, employeeId: leaves[i].employeeId, approvEmpl: `${approvEmpl.title || ''} ${approvEmpl.fName} ${genFunct.getFulName(approvEmpl.mName, approvEmpl.lName)}`, employId: approvEmpl.id, job: (jobDesc) ? jobDesc.jobTitle : 'N/A' };

                    pendLeave.push(data);
                }

            }
        } else {
            for (let i = 0; i < leaves.length; i++) {
                const dept = await Department.findOne({ where: { id: leaves[i].employee.departmentId, deleted: 0 } });

                const approvEmpl = await Employee.findOne({ where: { id: leaves[i].employId } });

                const jobDesc = await JobDesc.findOne({ where: { id: leaves[i].employee.jobdescId } });

                let data = { id: leaves[i].id, date: leaves[i].createdAt, name: `${leaves[i].employee.title || ''} ${leaves[i].employee.fName} ${genFunct.getFulName(leaves[i].employee.mName, leaves[i].employee.lName)}`, dept: `${(dept)? dept.deptName : 'N/A'}`, from: leaves[i].from, to: leaves[i].to, days: leaves[i].days, leaveType: leaves[i].leaveType.leaveType, status: leaves[i].status, reason: leaves[i].reason, exp: leaves[i].leaveType.nofdays, remark: leaves[i].remarks, employeeId: leaves[i].employeeId, approvEmpl: `${approvEmpl.title || ''} ${approvEmpl.fName} ${genFunct.getFulName(approvEmpl.mName, approvEmpl.lName)}`, employId: approvEmpl.id, job: (jobDesc) ? jobDesc.jobTitle : 'N/A' };

                pendLeave.push(data);
            }
        }
            // console.log('Leaves HOD =>', where);

        if (!data) {
            await genFunct.log(req, ['View leaves', (await this.pathname(req)).toString()]);
            return res.status(200).json({ leaves: pendLeave });
        } else {
            return pendLeave;
        }
    } catch (err) {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.postApproveReLeave = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                path: `/${process.env.MENT}/approveReLeave`,
                pageTitle: 'Approve leave',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const updateLeave = await Leaves.update({ remarks: req.body.remark, status: req.body.statusLev }, { where: { id: req.body.leaveAppID } });
        const updateLeveProce = await new LeavesProcess({
            remarks: req.body.remark,
            status: req.body.statusLev,
            userId: req.user.id,
            leaveId: req.body.leaveAppID
        });
        await updateLeveProce.save();

        if (updateLeave) {
            await genFunct.log(req, ['Approved leave for ' + req.body.leaveAppID, (await this.pathname(req)).toString()]);

            return res.status(200).json({ data: updateLeave })
        }

    } catch (err) {
        console.log('Error from getEmployees ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}


// exports.postMarkAttend = async(req, res, next) => {
//     const errors = validationResult(req);
//     try {
//         if (!errors.isEmpty()) {
//             return res.status(422).json({
//                 path: `/${process.env.MENT}/markAttend`,
//                 pageTitle: 'Mark Attendance',
//                 errorMessage: errors.array()[0].msg,
//                 validationErrors: errors.array(),
//             });
//         }

//         function getValue(id, sid) {
//             if (id) {
//                 console.log('update ID ====>', id, sid);
//                 AttendMarked.update({ leaveId: id }, { where: { id: sid } });
//             }
//         }
//         // let varl = moment(req.body.selectDate);
//         // moment(req.body.selectDate).format('YYYY-MM-DD')
//         // console.log('markinput, mark ====>', mo);
//         if (req.body.change === 'add') {
//             let mo = await AttendMarked.findOne({ where: { date: [req.body.selectDate], deleted: 0 } });
//             // console.log('Logg 1 =======>', mo);
//             if (!mo) {
//                 let preAB = req.body.preAb_[0].split(',');
//                 // console.log('Logg 2 =======>', mo);
//                 for (let i = 0; i < req.body.emattdID.length; i++) {

//                     let saveAttend = await new AttendMarked({
//                         date: req.body.selectDate,
//                         startTime: req.body.startTime[i] || null,
//                         closeTime: req.body.closeTime[i] || null,
//                         attend_status: preAB[i],
//                         leaveIds: (+req.body.leavTypId[i]) ? +req.body.leavTypId[i] : null,
//                         userId: req.user.id,
//                         employeeId: req.body.emID[i],
//                     });
//                     const saveAtt = await saveAttend.save();
//                 }

//                 await genFunct.log(req, ['Save attendant data', (await this.pathname(req)).toString()]);

//             }
//         }
//         if (req.body.change === 'change') {
//             let mo = await AttendMarked.findOne({ where: { date: [req.body.selectDate], deleted: 0 } });
//             // console.log('Logg 1 =======>', mo);
//             if (mo) {
//                 // console.log('req.body.preAb_[0] ====>', req.body.preAb_[0])
//                 let preAB = req.body.preAb_[0].split(',');
//                 // console.log('Logg 2 =======>', mo);
//                 for (let i = 0; i < req.body.emattdID.length; i++) {

//                     await AttendMarked.update({ startTime: req.body.startTime[i] || null, closeTime: req.body.closeTime[i] || null, attend_status: preAB[i], leaveIds: (+req.body.leavTypId[i]) ? +req.body.leavTypId[i] : null, userId: req.user.id }, { where: { id: req.body.attendID[i] } });

//                 }

//                 await genFunct.log(req, ['Updated attendant data', (await this.pathname(req)).toString()]);

//             }
//         }

//         return res.status(200).json({ data: 'okay' });

//     } catch (err) {
//         console.log('Error from ===>', err);
//         msg = 'Sorry something went wrong, please check your input and try again';

//         if (req.xhr) {
//             return res.status(500).json({ error: msg });
//         } else {
//             return errorsfile.get500(req, res, next, msg);
//         }
//     }
//     // console.log('all well for now');
// }

// exports.getAttendMarked = async(req, res, next) => {
//     try {
//         status = false
//         markedAttnd = []
//         let leaType = {};

//         const date = req.params.date;
//         // console.log('Date passed =====> ', date);
//         let getMarkedAtt = await AttendMarked.findAll({
//             where: { date: [date], deleted: 0 },
//             include: [{
//                     model: User,
//                     // where: {
//                     //     deleted: 0,
//                     // },
//                     // require: false,
//                 },
//                 {
//                     model: Employee,
//                     where: {
//                         deleted: 0,
//                     },
//                     require: false,
//                 }
//             ]
//         });

//         for (let i = 0; i < getMarkedAtt.length; i++) {
//             const timepass = Math.floor(new Date(getMarkedAtt[i].createdAt) / 1000);
//             const timenow = Math.floor(Date.now() / 1000);

//             function edit() {
//                 if ((timenow - timepass) <= 3600) { return true } else {
//                     console.log('Dates diff =======> ', timenow - timepass);
//                     return false
//                 }

//             }
//             const dept = await Department.findOne({ where: { id: getMarkedAtt[i].employee.departmentId, deleted: 0 } });

//             if (getMarkedAtt[i].leaveIds) {
//                 const leaTyp = await Leaves.findOne({
//                     where: { id: getMarkedAtt[i].leaveIds, deleted: 0 },
//                     include: [{
//                         model: LeaveType,
//                         where: {
//                             deleted: 0,
//                         },
//                         require: false,
//                     }]
//                 });
//                 status = true;
//                 leaType = { id: leaTyp.id, leavetyp: leaTyp.leaveType.leaveType }
//             } else {
//                 console.log('');
//                 leaType = { id: null, leavetyp: '' }

//             }

//             let data = await {
//                 id: getMarkedAtt[i].id,
//                 emplID: getMarkedAtt[i].employee.emplID,
//                 staffID: getMarkedAtt[i].employee.staffID,
//                 fullname: `${getMarkedAtt[i].employee.title} ${getMarkedAtt[i].employee.fName} ${genFunct.getFulName(getMarkedAtt[i].employee.mName, getMarkedAtt[i].employee.lName)}`,
//                 startTime: moment(getMarkedAtt[i].startTime, 'HH:mm').format('HH:mm'),
//                 closeTime: moment(getMarkedAtt[i].closeTime, 'HH:mm').format('HH:mm'),
//                 attend_status: getMarkedAtt[i].attend_status,
//                 leaveIds: getMarkedAtt[i].leaveIds,
//                 userId: getMarkedAtt[i].userId,
//                 employeeId: getMarkedAtt[i].employeeId,
//                 dept: (dept) ? dept.deptName : 'N/A',
//                 photo: getMarkedAtt[i].employee.photo,
//                 status: status,
//                 leavTyp: leaType.leavetyp || '',
//                 leavTypId: leaType.id || null,
//                 editable: await edit()
//             }
//             await markedAttnd.push(data);
//             status = false;
//             leaType = {};
//         }

//         await genFunct.log(req, ['View attendant data', (await this.pathname(req)).toString()]);

//         return res.status(200).json({ markedAttnd: markedAttnd });


//     } catch (err) {
//         console.log('Error from ===>', err);
//         msg = 'Sorry something went wrong, please check your input and try again';

//         if (req.xhr) {
//             return res.status(500).json({ error: msg });
//         } else {
//             return errorsfile.get500(req, res, next, msg);
//         }
//     }
// }

exports.getDeleteEmploy = async(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errorMessage: errors.array()[0].msg });
    }

    // return res.status(200).json({ errorMessage: 'errors.array()[0].msg' });

    try {
        const id = req.params.id;

        const hasHistory = await genFunct.hasHistory(id);
        if (hasHistory) {
            const delEmply = await Employee.update({ deleted: 1 }, { where: { id: id } });
            if (delEmply) {
                await Address.update({ deleted: 1 }, { where: { employeeId: id } });
                await ReportTo.update({ deleted: 1 }, { where: { employeeId: id } });
                await BankDetail.update({ deleted: 1 }, { where: { employeeId: id } });
                await Spouse.update({ deleted: 1 }, { where: { employeeId: id } });
                await Dependant.update({ deleted: 1 }, { where: { employeeId: id } });
                await SSNITBenfit.update({ deleted: 1 }, { where: { employeeId: id } });
                await EducationBacground.update({ deleted: 1 }, { where: { employeeId: id } });
                await WorkExperience.update({ deleted: 1 }, { where: { employeeId: id } });
                await EmergencyContact.update({ deleted: 1 }, { where: { employeeId: id } });
                await NextOfKin.update({ deleted: 1 }, { where: { employeeId: id } });

                await User.update({ deleted: 1 }, { where: { currentUserEmployeeId: id } });
                // await Department.update({ headByEmployeeId: null, deptHeadStatus: 'Vacant' }, { where: { headByEmployeeId: id } });

                await ReportTo.update({ reportToEmplyId: null }, { where: { reportToEmplyId: id } });

                await ReportTo.update({ immediateSupEmplyId: null }, { where: { immediateSupEmplyId: id } });

                const terminatedEmply = await Employee.findOne({ where: { id: id }, include: [{ model: JobDesc }] });

                const dept = await Department.findOne({ where: { headByEmployeeId: terminatedEmply.id } });

                if (dept) {
                    // terminating emply as HOD
                    const terminateHOD = await new HODsChanged({
                        remarks: 'Employee was terminated by removal from the system',
                        date: new Date(),
                        statusAs: 'Terminated',
                        position: terminatedEmply.jobdesc.jobTitle,
                        file: null,
                        trackCode: dept.trackCode,
                        userId: req.user.id,
                        employeeId: terminatedEmply.id,
                        departmentId: dept.id,
                    });
                    await terminateHOD.save();

                    await Department.update({ deptHeadStatus: 'Vacant', headByEmployeeId: terminatedEmply.id, trackCode: dept.trackCode }, { where: { id: dept.id } });
                }

                await genFunct.log(req, ['Terminated employee', (await this.pathname(req)).toString()]);

                return res.status(200).json({ data: 'Okay' });

            }
        } else {

            // if (delEmply) {
            await Address.destroy({ where: { employeeId: id } });
            await ReportTo.destroy({ where: { employeeId: id } });
            await BankDetail.destroy({ where: { employeeId: id } });
            await Spouse.destroy({ where: { employeeId: id } });
            await Dependant.destroy({ where: { employeeId: id } });
            await SSNITBenfit.destroy({ where: { employeeId: id } });
            await EducationBacground.destroy({ where: { employeeId: id } });
            await WorkExperience.destroy({ where: { employeeId: id } });
            await EmergencyContact.destroy({ where: { employeeId: id } });
            await NextOfKin.destroy({ where: { employeeId: id } });

            await Department.update({ headByEmployeeId: null, deptHeadStatus: 'Vacant' }, { where: { headByEmployeeId: id } });

            await ReportTo.update({ reportToEmplyId: null }, { where: { reportToEmplyId: id } });

            await ReportTo.update({ immediateSupEmplyId: null }, { where: { immediateSupEmplyId: id } });

            await Employee.destroy({ where: { id: id } });

            await genFunct.log(req, ['Deleted employee data', (await this.pathname(req)).toString()]);

            return res.status(200).json({ data: 'Okay' });

            // }
        }
    } catch (err) {
        console.log('Error from ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.postAttendReport = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                path: `/${process.env.MENT}/getAttendReport`,
                pageTitle: 'Attend Report',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }

        function date(date) {
            return moment(date).format('DD-MM-YYYY');
        }

        function isDepartSelected(dept) {
            if (dept) {
                return `departmentId: ${dept}`
            }
        }

        const from = moment(req.body.repFromDate || req.params.from).format('YYYY-MM-DD');
        const to = moment(req.body.repToDate || req.params.to).format('YYYY-MM-DD');

        const from1 = moment(req.body.repFromDate || req.params.from, 'YYYY-MM-DD');
        const to1 = moment(req.body.repToDate || req.params.to, 'YYYY-MM-DD');

        const days = -1 * moment.duration(from1.diff(to1)).asDays() + 1;
        const employId = [];
        const attendData = [];

        let getAttend;
        if (req.body.getdept) {
            console.log('With dept ======>');

            getAttend = await AttendMarked.findAll({
                where: {
                    date: {
                        [Op.between]: [from, to]
                    },
                    deleted: 0
                },
                include: [{
                    model: Employee,
                    where: {
                        deleted: 0,
                        departmentId: req.body.getdept
                    },
                    require: false,
                }]
            });
        } else {
            console.log('Without dept ======>');
            getAttend = await AttendMarked.findAll({
                where: {
                    date: {
                        [Op.between]: [from, to]
                    },
                    deleted: 0
                },
                include: [{
                    model: Employee,
                    where: {
                        deleted: 0
                    },
                    require: false,
                }]
            });
        }

        console.log('Length of getAttend ======>', getAttend.length);


        for (let i = 0; i < getAttend.length; i++) {
            if (!employId.includes(getAttend[i].employeeId)) {
                employId.push(getAttend[i].employeeId);
            }
        }
        let totalPres = 0;
        let totalAbs = 0;
        for (let i = 0; i < employId.length; i++) {
            const employ = await Employee.findOne({ where: { id: employId[i], deleted: 0 } });
            const countPre = await AttendMarked.findAndCountAll({
                where: {
                    date: {
                        [Op.between]: [from, to]
                    },
                    employeeId: employId[i],
                    attend_status: 1,
                    deleted: 0
                }
            });
            totalPres += countPre.count;

            const countAbs = await AttendMarked.findAndCountAll({
                where: {
                    date: {
                        [Op.between]: [from, to]
                    },
                    employeeId: employId[i],
                    attend_status: 0,
                    deleted: 0
                }
            });

            totalAbs += countAbs.count;

            const dept = await Department.findOne({ where: { id: employ.departmentId, deleted: 0 } });


            let data = await {
                id: employId[i],
                staffID: employ.staffID,
                fullname: `${employ.title} ${employ.fName} ${genFunct.getFulName(employ.mName, employ.lName)}`,
                daysAtt: (countPre.count + countAbs.count),
                days: days,
                pres: countPre.count,
                abs: countAbs.count,
                dept: (dept) ? dept.deptName : 'N/A',
                photo: employ.photo,
                fdate: req.body.repFromDate,
                tdate: req.body.repToDate,
                email: employ.email,
                phone: employ.phone,
                date: `${date(req.body.repFromDate || req.params.from)} - ${date(req.body.repToDate || req.params.to)}`
            }
            attendData.push(data);

        }

        const summary = `From: ${date(req.body.repFromDate || req.params.from)} To: ${date(req.body.repToDate || req.params.to)} - ${days} days(s)<br>
        Total Turnout: Pre: ${totalPres} Abs: ${totalAbs}<br>
        Percentage Turnout: Pre: ${((totalPres / (totalPres + totalAbs)) * 100).toFixed(2)} %   Abs: ${((totalAbs / (totalPres + totalAbs)) * 100).toFixed(2)} %`;

        if (req.xhr) {
            console.log('In xhr => ', req.xhr);

            await genFunct.log(req, ['Generated report on attendants data', (await this.pathname(req)).toString()]);

            return res.status(200).json({ data: attendData, date: summary });
        } else {
            console.log('In browser => ', );

            await genFunct.log(req, ['Generated report on attendants data pdf', (await this.pathname(req)).toString()]);

            console.log('In browser3 => ', );
            const html = fs.readFileSync(path.join(__dirname, '../views/report-html/employees.html'), 'utf-8');
            const filename = Math.random() + '_doc' + '.pdf';
            const document = {
                html: html,
                data: {
                    products: attendData,
                    company: 'Adamu Moha'
                },
                path: './docs/' + filename
            }
            await pdf.create(document, options)
                .then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });
            // const filepath = await 'http://192.168.100.5:3001/docs/' + filename;
            const filePathName = await path.join(path.dirname(process.mainModule.filename), 'docs', `${filename}`);
            const data1 = await fs.readFileSync(filePathName);
            res.contentType("application/pdf");
            fileHandler.deleteFile(filePathName);
            return res.send(data1);
        }

    } catch (err) {
        console.log('Error from ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.getEmplyAttendMarked = async(req, res, next) => {
    try {
        // console.log('From To => ', req.params.from, req.params.to);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                path: `/${process.env.MENT}/getEmplyAttendMarked`,
                pageTitle: 'Attend Report',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }
        const from = moment(req.params.from).format('YYYY-MM-DD');
        const to = moment(req.params.to).format('YYYY-MM-DD');
        const id = req.params.id;
        const getAttendMarked = [];

        const employee = await Employee.findOne({
            where: {
                id: id,
                deleted: 0
            },
            include: [{
                model: Shift,
            }]
        });


        const dateArray = await genFunct.datearray(from, to);

        let color = 'black'

        for (let i = 0; i < dateArray.length; i++) {
            let j = dateArray.length - (1 + i);
            const date = await moment(dateArray[j]).format('YYYY-MM-DD');
            let clock_date = await moment(dateArray[j]).format('DD-MM-YYYY');
            let empShift = employee.shift.shift_name;
            // console.log('datej => ', j);
            let clock_type, clock_typeb, punch_time, punch_timeb, late, overtime, left_earl;
            const punchData = await PunchData.findAll({
                where: {
                    punch_date: date,
                    employeeId: id,
                    clock_type: {
                        [Op.or]: ['CI', 'CO']
                    }
                },
                order: [
                    ['timestamp', 'ASC']
                ],
                include: [{
                    model: Shift
                }]
            });

            if (punchData) {
                // await markedAttnd.push(punchData);
                const last = punchData.length - 1;
                if (punchData.length > 1) {
                    clock_type = (punchData) ? punchData[0].clock_type : 'N/A';
                    punch_time = (clock_type == 'CI') ? punchData[0].punch_time : 'N/A';
                    late = (punch_time !== 'N/A') ? punchData[0].late : 'N/A';

                    clock_typeb = (punchData) ? punchData[last].clock_type : 'N/A';
                    punch_timeb = (clock_typeb == 'CO') ? punchData[last].punch_time : 'N/A';
                    overtime = (clock_typeb == 'CO') ? punchData[last].over_time : 'N/A'
                    left_earl = (clock_typeb == 'CO') ? punchData[last].left_earl : 'N/A'

                    empShift = (punchData[0].shift.shift_name === punchData[last].shift.shift_name) ? punchData[0].shift.shift_name : `${punchData[0].shift.shift_name} , ${punchData[last].shift.shift_name}`;

                    clock_date = moment(punchData[0].punch_date).format('DD-MM-YYYY');

                }
                if (punchData.length == 1) {
                    clock_type = (punchData) ? punchData[last].clock_type : 'N/A';
                    punch_time = (clock_type == 'CI') ? punchData[last].punch_time : 'N/A';
                    late = (punch_time !== 'N/A') ? punchData[last].late : 'N/A';

                    clock_typeb = (punchData) ? punchData[last].clock_type : 'N/A';
                    punch_timeb = (clock_typeb == 'CO') ? punchData[last].punch_time : 'N/A';
                    overtime = (clock_typeb == 'CO') ? punchData[last].over_time : 'N/A'
                    left_earl = (clock_typeb == 'CO') ? punchData[last].left_earl : 'N/A'

                    empShift = punchData[last].shift.shift_name

                    clock_date = moment(punchData[last].punch_date).format('DD-MM-YYYY');

                }
            }

            if (punch_time === 'N/A' && punch_timeb === 'N/A') {
                // color = 'red';
                // console.log('Color => ', color);
            }

            if (clock_type !== 'N/A') {
                // console.log('Math => 1', Date.now(punchIn.punch_time));
                if (late < 0) {
                    // color = '#FF7F50'
                }
            }
            // let status = false;
            let leaType = 'N/A';

            const leaTyp = await Leaves.findAll({
                where: { status: 'Approved', employeeId: id, deleted: 0 },
                include: [{
                    model: LeaveType,
                    where: {
                        deleted: 0,
                    },
                    require: false,
                }]
            });
            if (leaTyp) {
                for (let i = 0; i < leaTyp.length; i++) {
                    if ((Math.floor(new Date(date) / 1000) >= Math.floor(new Date(leaTyp[i].from) / 1000)) && (Math.floor(new Date(date) / 1000) <= Math.floor(new Date(leaTyp[i].to) / 1000))) {
                        // status = true;
                        leaType = leaTyp[i].leaveType.leaveType //{ id: leaTyp.id, leavetyp: leaTyp.leaveType.leaveType }
                    }
                }

            }

            let data = await {
                // id: getMarkedAtt[i].id,
                date: `<label style="color: ${color}">${clock_date}</label>`,
                shift: `<label style="color: ${color}">${empShift}</label>`,
                startTime: `<label style="color: ${color}">${(punch_time)?punch_time:'N/A'}</label>`,
                closeTime: `<label style="color: ${color}">${(punch_timeb)?punch_timeb:'N/A'}</label>`,
                late: `<label style="color: ${color}">${(late)?late:'N/A'}</label>`,
                left_earl: `<label style="color: ${color}">${(left_earl)?left_earl:'N/A'}</label>`,
                overtime: `<label style="color: ${color}">${(overtime)?overtime:'N/A'}</label>`,
                leavTyp: `<label style="color: ${color}">${leaType}</label>`,
            }
            await getAttendMarked.push(data);
            // status = false;
            leaType = 'N/A';
            color = 'black';
        }

        await genFunct.log(req, ['View marked attendances', (await this.pathname(req)).toString()]);
        // console.log('From To => ', req.params.from, req.params.to);
        
        let dateRange = `Attendance data for ${employee.title || ''} ${employee.fName} ${genFunct.getFulName(employee.mName, employee.lName)} between ${moment(req.params.from).format('DD-MM-YYYY')} and ${moment(req.params.to).format('DD-MM-YYYY')}`;


        return res.status(200).json({ data: getAttendMarked, date: dateRange });
    } catch (error) {
        console.log('Error from ===>', err);
        msg = 'Sorry something went wrong, please try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.getAllDeptHead = async(req, res, next) => {
    try {
        const headData = [];
        const dept = await Department.findAll({
            where: {
                headByEmployeeId: {
                    [Op.ne]: null
                }
            },
            // include: [{ model: Employee }]
        });

        if (dept) {
            for (let i = 0; i < dept.length; i++) {
                const deptHead = await Employee.findOne({ where: { id: dept[i].headByEmployeeId, deleted: 0 } });

                let data = await {
                    id: deptHead.id,
                    deptId: dept[i].id,
                    dept: dept[i].deptName,
                    name: `${deptHead.title || ''} ${deptHead.fName} ${genFunct.getFulName(deptHead.mName, deptHead.lName)}`
                }

                await headData.push(data)
            }
        }
        // console.log('Department =======> ', headData);
        await genFunct.log(req, ['View department head data', (await this.pathname(req)).toString()]);

        return res.status(200).json({ data: headData });
        // console.log('Department =======> ', dept);
    } catch (err) {
        console.log('Error from ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.deleteLeaveApply = async(req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    try {
        const leaveId = req.params.leaveId;
        const del = await Leaves.update({ deleted: 1 }, { where: { id: leaveId } });
        const delProce = await LeavesProcess.update({ deleted: 1 }, { where: { id: leaveId } });
        if (del) {
            await genFunct.log(req, ['Deleted applied leave', (await this.pathname(req)).toString()]);

            return res.status(200).json({ ok: 'ok' });
        }
    } catch (err) {
        console.log('Error from ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }

};

exports.getDeptEmployees = async(req, res, next) => {
    try {
        const compiledData = [];
        const deptId = req.params.deptId;
        const employees = await Employee.findAll({
            where: { departmentId: deptId, deleted: 0 },
            include: [{ model: JobDesc }],
            order: [
                ['id', 'DESC']
            ]
        });
        if (employees) {
            for (let i = 0; i < employees.length; i++) {
                let data = { id: employees[i].id, fullname: `${employees[i].title} ${employees[i].fName} ${genFunct.getFulName(employees[i].mName, employees[i].lName)} => ${employees[i].jobdesc.jobTitle}`, job: employees[i].jobdesc.jobTitle };
                compiledData.push(data);
            }
        }
        await genFunct.log(req, ['Accessed employees under a ' + deptId + ' department', (await this.pathname(req)).toString()]);

        return res.status(200).json({ data: compiledData });
    } catch (err) {
        console.log('Error from getDeptEmployee ', err);
        return res.status(500).json({ error: 'Something went wrong.' });
    }
};

exports.getShifts = async(req, res, next) => {

    const dataArray = [];
    const shift = await Shift.findAll({ where: { deleted: 0 } });

    function getDigits(dig) {
        if (dig.toString().length == 1) {
            return `0${dig}`;
        }
        return dig;
    }

    if (shift) {
        for (let i = 0; i < shift.length; i++) {
            const countEmply = await Employee.findAndCountAll({where: {deleted: 0, shiftId: shift[i].id}});
            let data = await { id: shift[i].id, date: moment(shift[i].createdAt).format('DD-MM-YYYY'), name: shift[i].shift_name, start: `${getDigits(shift[i].start_hour).toString()}:${getDigits(shift[i].start_minute).toString()}`, end: `${getDigits(shift[i].end_hour).toString()}:${getDigits(shift[i].end_minute).toString()}`, duration: shift[i].shift_duration, break: (shift[i].allow_break) ? `${getDigits(shift[i].break_hour).toString()}:${getDigits(shift[i].break_minute).toString()}` : 'No', grace: shift[i].grace_period, totalEmply: countEmply.count, startH: shift[i].start_hour, startM: shift[i].start_minute, endH: shift[i].end_hour, endM: shift[i].end_minute, days: JSON.parse(shift[i].days), allwBreak: shift[i].allow_break, breakH: (shift[i].allow_break) ? shift[i].break_hour : 0, breakM: (shift[i].allow_break) ? shift[i].break_minute : 0, breakDu: (shift[i].allow_break) ? shift[i].break_duration_minute : 1, allwOverT: shift[i].allow_over_time, overtimeH: (shift[i].allow_over_time) ? shift[i].overtime_hour : 0, overtimeM: (shift[i].allow_over_time) ? shift[i].overtime_minute : 0, overtimeRate: (shift[i].allow_over_time) ? shift[i].overtime_rate : 0 }

            // console.log('Days => ', JSON.parse(shift[i].days));

            await dataArray.push(data);
        }

        await genFunct.log(req, ['View shifts', (await this.pathname(req)).toString()]);
        return res.status(200).json({ data: dataArray });
    }
    await genFunct.log(req, ['View shifts', (await this.pathname(req)).toString()]);
    return res.status(200).json({ data: [] });
}

exports.addShift = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            })
        }
        if (req.body.shiftMode == 'addShift') {
            const saveShift = await new Shift({
                shift_name: req.body.shiftName,
                start_hour: req.body.startHour,
                start_minute: req.body.startMin,
                end_hour: req.body.endHour,
                end_minute: req.body.endMin,
                shift_duration: req.body.shiftDuration,
                grace_period: req.body.gracePeriod,
                days: JSON.stringify(req.body.days),
                allow_break: (req.body.break !== undefined) ? req.body.break : 0,
                break_hour: (req.body.break !== undefined) ? req.body.breakHour : null,
                break_minute: (req.body.break !== undefined) ? req.body.breakMin : null,
                break_duration_minute: (req.body.break !== undefined) ? req.body.breakDuraMin : null,
                allow_over_time: (req.body.overtime !== undefined) ? req.body.overtime : 0,
                overtime_hour: (req.body.overtime !== undefined) ? req.body.overtimeHour : null,
                overtime_minute: (req.body.overtime !== undefined) ? req.body.overtimeMin : null,
                overtime_rate: (req.body.overtime !== undefined) ? req.body.overtimeRate : null,
                userId: req.user.id
            });

            saveShift.save();
            await genFunct.log(req, ['Created new shift', (await this.pathname(req)).toString()]);

            return res.status(200).json({ data: 'Ok' });
        }
        if (req.body.shiftMode == 'editShift') {
            const shift = await Shift.findOne({ where: { id: req.body.shiftID, deleted: 0 } });

            if (shift) {
                shift.shift_name = req.body.shiftName;
                shift.start_hour = req.body.startHour;
                shift.start_minute = req.body.startMin;
                shift.end_hour = req.body.endHour;
                shift.end_minute = req.body.endMin;
                shift.shift_duration = req.body.shiftDuration;
                shift.grace_period = req.body.gracePeriod;
                shift.days = JSON.stringify(req.body.days);
                shift.allow_break = (req.body.break !== undefined) ? req.body.break : 0;
                shift.break_hour = (req.body.break !== undefined) ? req.body.breakHour : null;
                shift.break_minute = (req.body.break !== undefined) ? req.body.breakMin : null;
                shift.break_duration_minute = (req.body.break !== undefined) ? req.body.breakDuraMin : null;
                shift.allow_over_time = (req.body.overtime !== undefined) ? req.body.overtime : 0;
                shift.overtime_hour = (req.body.overtime !== undefined) ? req.body.overtimeHour : null;
                shift.overtime_minute = (req.body.overtime !== undefined) ? req.body.overtimeMin : null;
                shift.overtime_rate = (req.body.overtime !== undefined) ? req.body.overtimeRate : null;
                shift.userId = req.user.id;

                await shift.save()

                await genFunct.log(req, ['Updated shift', (await this.pathname(req)).toString()]);
                return res.status(200).json({ data: 'Ok' });
            }
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }

}

exports.getShift = async(req, res, next) => {
    try {
        const id = req.params.id;

        function getDigits(dig) {
            if (dig.toString().length == 1) {
                return `0${dig}`;
            }
            return dig;
        }


        const getShift = await Shift.findOne({ where: { id: id, deleted: 0 } });
        // console.log('Timestamp => ', Math.floor(new Date() / 1000));

        if (getShift) {
            const emplyData = await genFunct.getEmplyUnder(getShift.id);

            const shift = { id: getShift.id, date: moment(getShift.createdAt).format('DD-MM-YYYY'), name: getShift.shift_name, start: `${getDigits(getShift.start_hour).toString()}:${getDigits(getShift.start_minute).toString()}`, end: `${getDigits(getShift.end_hour).toString()}:${getDigits(getShift.end_minute).toString()}`, duration: getShift.shift_duration, break: (getShift.allow_break) ? `${getDigits(getShift.break_hour).toString()}:${getDigits(getShift.break_minute).toString()}` : 'No', breakDu: (getShift.allow_break) ? getShift.break_duration_minute : 1, overtime: (getShift.allow_over_time) ? `${getDigits(getShift.overtime_hour).toString()}:${getDigits(getShift.overtime_minute).toString()}` : 'No', rate: (getShift.allow_over_time) ? getShift.overtime_rate : 0, grace: getShift.grace_period, totalEmply: (emplyData.length != 0) ? emplyData[0].count : 0 };

            await genFunct.log(req, ['View shift data for shift id: ' + id, (await this.pathname(req)).toString()]);
            return res.status(200).json({ data: emplyData, shift: shift });
        }

    } catch (err) {
        console.log('error form getShift/id', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.getNoShiftEmployees = async(req, res, next) => {
    try {
        const dataArray = [];
        const getEmployees = await Employee.findAll({ where: { shiftId: null, deleted: 0 } });

        if (getEmployees) {
            // console.log('getEmployees => ', getEmployees);

            for (let i = 0; i < getEmployees.length; i++) {
                const dept = await Department.findOne({ where: { id: getEmployees[i].departmentId } });
                let data = { id: getEmployees[i].id, name: `${getEmployees[i].title} ${getEmployees[i].fName} ${genFunct.getFulName(getEmployees[i].mName, getEmployees[i].lName)} => `, dept: dept.deptName };

                dataArray.push(data);
            }

            // console.log('dataArray =? ', dataArray);

            await genFunct.log(req, ['Accessed employees without shift data', (await this.pathname(req)).toString()]);
            return res.status(200).json({ data: dataArray });
        }

    } catch (err) {
        console.log('error form getNoShiftEmployees', err);
        return res.status(500).json({ error: 'Something went wrong' });
    }

};

exports.addEmployeeToShift = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }

        const shiftId = req.body.selectID;
        let employIds = req.body.adEmploy;

        const val = [];
        if (!Array.isArray(employIds)) {
            val.push(employIds);
            employIds = val;

        }

        const newData = [];
        for (let i = 0; i < employIds.length; i++) {

            const id = +employIds[i]
            const shiftCode = await + Math.floor(new Date() / 1000) + id

            await Employee.update({ shiftId: shiftId, shiftCode: shiftCode }, { where: { id: employIds[i] } });

            const saveHistory = await new EmpShiftHistory({
                from: new Date(),
                shift_code: shiftCode,
                shiftId: shiftId,
                employeeId: employIds[i],
                userId: req.user.id,
            })

            saveHistory.save();

            const isUser = await TerminalUser.findOne({ where: { employeeId: employIds[i] } });
            // console.log('TerminalUser => ', TerminalUser);
            if (isUser) {
            // console.log('isUser => ', isUser);
                
                const isData = await PunchData.findAll({ where: { user_id: isUser.terminal_user_id, employeeId: {[Op.eq]: null} } });
                if (isData) {
            // console.log('isData => ', isData);
                    
                    for (let i = 0; i < isData.length; i++) {
                        newData.push({ timestamp: isData[i].timestamp, user_id: isData[i].user_id, date: isData[i].punch_date, number: isData[i].terminal_number });
            // console.log('isDatanewData => ', isData[i].punch_date);

                    }
                }
            }   
        }
        console.log('newData => ', newData);
        await genFunct.processPunch(newData);

        await genFunct.log(req, [`Added ${employIds.length} to shift ${shiftId}`, (await this.pathname(req)).toString()]);
        const emplyUnder = await genFunct.getEmplyUnder(shiftId);
        return res.status(201).json({ data: emplyUnder });

    } catch (err) {
        console.log('Error from addEmployeeToShift ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.removeEmplyFromShift = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }

        const shiftId = req.params.shifID;
        const employId = req.params.employID;

        const employ = await Employee.findOne({ where: { id: employId, deleted: 0 } });


        await Employee.update({ shiftId: null }, { where: { id: employId } });
        await EmpShiftHistory.update({ to: new Date(), userId: req.user.id }, { where: { shift_code: employ.shiftCode } });

        await genFunct.log(req, [`Remove ${employId} from shift ${shiftId}`, (await this.pathname(req)).toString()]);


        const emplyUnder = await genFunct.getEmplyUnder(shiftId);

        return res.status(201).json({ data: emplyUnder });
    } catch (err) {
        console.log('Error from removeEmplyFromShift ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};


exports.removeAll = async(req, res, next) => {
    try {
        const shiftId = req.body.selectID;
        let employId = req.body.employID;

        const val = [];
        if (!Array.isArray(employId)) {
            val.push(employId);
            employId = val;
        }

        // console.log('Body => ', req.body);

        for (let i = 0; i < employId.length; i++) {
            const employ = await Employee.findOne({ where: { id: employId[i], deleted: 0 } });

            await Employee.update({ shiftId: null }, { where: { id: employId[i] } });
            await EmpShiftHistory.update({ to: new Date(), userId: req.user.id }, { where: { shift_code: employ.shiftCode } });
        }

        await genFunct.log(req, [`Remove all ${req.body.length} employees from shift ${shiftId}`, (await this.pathname(req)).toString()]);
        const emplyUnder = await genFunct.getEmplyUnder(shiftId);
        return res.status(201).json({ data: emplyUnder });

    } catch (err) {
        console.log('Error from removeall ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.getEmpUnderDept = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }

        const deptId = req.params.deptId;
        const emplyData = [];

        const getEmplys = await Employee.findAndCountAll({ where: { departmentId: deptId, deleted: 0 } });
        if (getEmplys) {
            // console.log('getEmplys 2 => ', getEmplys);
            for (let i = 0; i < getEmplys.count; i++) {
                let data = await { id: getEmplys.rows[i].id, name: `${getEmplys.rows[i].title} ${getEmplys.rows[i].fName} ${genFunct.getFulName(getEmplys.rows[i].mName, getEmplys.rows[i].lName)}` };

                emplyData.push(data);
            }
        }


        await genFunct.log(req, [`Accessed employees under dept ${deptId}`, (await this.pathname(req)).toString()]);

        return res.status(201).json({ data: emplyData });

    } catch (err) {
        console.log('Error from getEmpUnderDept ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.AddEvent = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }

        if (req.body.eventMode == 'add') {


            await genFunct.log(req, [`Added new event ${req.body.eventName}`, (await this.pathname(req)).toString()]);

            const saveEvent = await new HolidayEvents({
                eventName: req.body.eventName,
                date: req.body.eventDate,
                occurrence: req.body.occur,
                userId: req.user.id
            });

            await saveEvent.save();

            return res.status(201).json({ data: 'ok' });
        }

        if (req.body.eventMode == 'edit') {

            const event = await HolidayEvents.findOne({ where: { id: req.body.eventId, deleted: 0 } });

            event.eventName = req.body.eventName;
            event.date = req.body.eventDate;
            event.occurrence = req.body.occur;
            event.userId = req.user.id;

            await event.save();

            await genFunct.log(req, [`Update new event ${req.body.eventName}`, (await this.pathname(req)).toString()]);

            return res.status(201).json({ data: 'ok' });
        }

    } catch (err) {
        console.log('Error from AddEvent ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.getAllCalendarEvents = async(req, res, next, from=false) => {
    try {

        const role = req.user.role;
        const id = req.user.id;
        const thisYear = [];
        const previousYear = [];
        let birthdays = await genFunct.getStaffBirthdays(role, id);
        const year = [];

        const events = await HolidayEvents.findAndCountAll({ where: { deleted: 0 } });

        for (let i = 0; i < events.count; i++) {
            const thYear = new Date().getFullYear();

            if (thYear == new Date(events.rows[i].date).getFullYear()) {
                let data = await { id: events.rows[i].id, event: events.rows[i].eventName, date: moment(events.rows[i].date).format('DD-MM-YYYY'), evtdate: moment(events.rows[i].date).format('YYYY-MM-DD'), occur: (events.rows[i].occurrence) ? 'Once' : 'Yearly' };

                thisYear.push(data);

            } else {
                let data = await { id: events.rows[i].id, event: events.rows[i].eventName, date: moment(events.rows[i].date).format('DD-MM-YYYY'), evtdate: moment(events.rows[i].date).format('YYYY-MM-DD'), occur: (events.rows[i].occurrence) ? 'Once' : 'Yearly', year: new Date(events.rows[i].date).getFullYear() };

                previousYear.push(data);

                if (!year.includes(new Date(events.rows[i].date).getFullYear())) {
                    console.log('Yes =>');
                    // caliYear.push({ year: new Date(events.rows[i].date).getFullYear() });
                    year.push(new Date(events.rows[i].date).getFullYear())
                }
            }
        }

        await genFunct.log(req, [`Accessed calendar data`, (await this.pathname(req)).toString()]);
        const bd = await thisYear.concat(birthdays);
        // console.log('Birthdays => ', bd);
        if(from){
            return [thisYear, birthdays];
        }

        return res.status(200).json({ thisYear: thisYear, previousYear, caliYear: year, birthdays: bd});


    } catch (err) {
        console.log('Error from getAllCalendarEvents ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.getPastYearsEvents = async(req, res, next) => {
    try {
        const data = [];
        const year = req.params.year;

        const yearEvents = await HolidayEvents.findAndCountAll({ where: { deleted: 0 } });

        for (let i = 0; i < yearEvents.count; i++) {
            if (year == new Date(yearEvents.rows[i].date).getFullYear()) {
                let dat = await { id: yearEvents.rows[i].id, event: yearEvents.rows[i].eventName, date: moment(yearEvents.rows[i].date).format('DD-MM-YYYY'), occur: yearEvents.rows[i].occurrence, year: new Date(yearEvents.rows[i].date).getFullYear() };

                data.push(dat);
            }
        }

        await genFunct.log(req, [`Accessed events data under year ${year}`, (await this.pathname(req)).toString()]);
        return res.status(200).json({ data: data });

    } catch (err) {
        console.log('Error from getPastYearsEvents ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.calibrateEvents = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }

        let ids = req.body.calibrateEvent;
        const val = [];
        if (!Array.isArray(ids)) {
            val.push(ids);
            ids = val;
        }

        for (let i = 0; i < ids.length; i++) {
            const event = await HolidayEvents.findOne({ where: { id: ids[i], deleted: 0 } });

            if (event) {
                // let date = moment(event.date).format(`${new Date().getFullYear()}-MM-DD`);
                const saveEvent = await new HolidayEvents({
                    eventName: event.eventName,
                    date: moment(event.date).format(`${new Date().getFullYear()}-MM-DD`),
                    occurrence: event.occurrence,
                    userId: req.user.id
                });

                await saveEvent.save();

                await event.save();
            }
        }

        await genFunct.log(req, [`Calibrated ${ids.length} event to ${new Date().getFullYear()}`, (await this.pathname(req)).toString()]);

        return res.status(201).json({ data: 'ok' });

    } catch (err) {
        console.log('Error from calibrateEvents ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.getAttendByDate = async(req, res, next, data = []) => {

    try {
        await genFunct.pullData(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }
        const markedAttnd = []
        let leaType = 'N/A';

        const date = (data.length)? moment(data[0]).format('YYYY-MM-DD'):moment(req.params.date).format('YYYY-MM-DD');
        // await genFunct.pullData(req);
        let employees;
        if (data.length) {
            if (data[1]) {
                employees = await Employee.findAll({
                    where: {
                        dateEmplyed: {
                            [Op.lte]: data[0]
                        },
                        departmentId: data[1],
                        deleted: 0
                    },
                    include: [{
                        model: Shift
                    }, ]
                });
            } else {
                employees = await Employee.findAll({
                    where: {
                        dateEmplyed: {
                            [Op.lte]: data[0]
                        },
                        deleted: 0
                    },
                    include: [{
                        model: Shift
                    }, ]
                });
            }
            // console.log('Here => ', await employees);

        } else {
            employees = await Employee.findAll({
                where: {
                    dateEmplyed: {
                        [Op.lte]: date
                    },
                    deleted: 0
                },
                include: [{
                    model: Shift
                }, ]
            });
        }
        const histo = await EmpDeptHistory.findAll({
            where: {
                from: {
                    [Op.gte]: date
                },
                to: {
                    [Op.or]: {
                        [Op.lte]: date,
                        [Op.eq]: null
                    }
                }
            }
        });

        // markedAttnd.push(employees);
        for (let i = 0; i < employees.length; i++) {
            // if (moment(employees[i].dateEmplyed).format('YYYY-MM-DD') <= date) {
            let clock_type, clock_typeb, punch_time, punch_timeb, late, overtime, left_earl, empName, empDept, empShift, staffID, photo;

            empName = `${employees[i].title} ${employees[i].fName} ${genFunct.getFulName(employees[i].mName, employees[i].lName)}`;
            staffID = employees[i].staffID;
            photo = (employees[i].photo) ? employees[i].photo : 'img/avatar.svg';
            empShift = (employees[i].shift) ? employees[i].shift.shift_name : 'N/A';
            empDept = await Department.findOne({ where: { id: employees[i].departmentId } }).then(result => {
                return (result) ? result.deptName : 'N/A';
            });
            // markedAttnd.push(photo);
            const leaTyp = await Leaves.findOne({
                where: {
                    status: 'Approved',
                    employeeId: employees[i].id,
                    deleted: 0
                },
                include: [{
                    model: LeaveType,
                    where: {
                        deleted: 0,
                    },
                    require: false,
                }]
            })

            // markedAttnd.push(leaTyp);

            if (leaTyp) {
                // for (let i = 0; i < leaTyp.length; i++) {
                    if ((Math.floor(new Date(date) / 1000) >= Math.floor(new Date(leaTyp.from) / 1000)) && (Math.floor(new Date(date) / 1000) <= Math.floor(new Date(leaTyp.to) / 1000))) {
                        // status = true;
                        leaType = leaTyp.leaveType.leaveType //{ id: leaTyp.id, leavetyp: leaTyp.leaveType.leaveType }
                    }
                // }
            }

            const punchData = await PunchData.findAll({
                where: {
                    punch_date: (data.length) ? data[0] : date,
                    employeeId: employees[i].id,
                    clock_type: {
                        [Op.or]: ['CI', 'CO']
                    }
                },
                order: [
                    ['timestamp', 'ASC']
                ],
                include: [{
                    model: Shift
                }, { model: Department }]
            });

            if (punchData) {

                // await markedAttnd.push(punchData);
                const last = punchData.length - 1;
                if (punchData.length > 1) {
                    clock_type = (punchData) ? punchData[0].clock_type : 'N/A';
                    punch_time = (clock_type == 'CI') ? punchData[0].punch_time : 'N/A';
                    late = (punch_time !== 'N/A') ? punchData[0].late : 'N/A';

                    clock_typeb = (punchData) ? punchData[last].clock_type : 'N/A';
                    punch_timeb = (clock_typeb == 'CO') ? punchData[last].punch_time : 'N/A';
                    overtime = (clock_typeb == 'CO') ? punchData[last].over_time : 'N/A'
                    left_earl = (clock_typeb == 'CO') ? punchData[last].left_earl : 'N/A'

                    empDept = (punchData[0].department.deptName === punchData[last].department.deptName) ? punchData[0].department.deptName : `${punchData[0].department.deptName} , ${punchData[last].department.deptName}`

                    empShift = (punchData[0].shift.shift_name === punchData[last].shift.shift_name) ? punchData[0].shift.shift_name : `${punchData[0].shift.shift_name} , ${punchData[last].shift.shift_name}`

                    // empDept = (dept)
                }
                if (punchData.length == 1) {
                    clock_type = (punchData) ? punchData[last].clock_type : 'N/A';
                    punch_time = (clock_type == 'CI') ? punchData[last].punch_time : 'N/A';
                    late = (punch_time !== 'N/A') ? punchData[last].late : 'N/A';

                    clock_typeb = (punchData) ? punchData[last].clock_type : 'N/A';
                    punch_timeb = (clock_typeb == 'CO') ? punchData[last].punch_time : 'N/A';
                    overtime = (clock_typeb == 'CO') ? punchData[last].over_time : 'N/A'
                    left_earl = (clock_typeb == 'CO') ? punchData[last].left_earl : 'N/A'

                    empDept = punchData[last].department.deptName;

                    empShift = punchData[last].shift.shift_name
                }
            }
            // }
            let color = '';
            let colorLeave = '';
            if (leaType !== 'N/A' && ((punch_time || 'N/A') !== 'N/A' || (punch_timeb || 'N/A') !== 'N/A')) {
                colorLeave = 'red';
                // console.log('Leaves => ', leaType, punch_time, punch_timeb);
            }
            let data2 = await {
                // id: getMarkedAtt[i].id,
                staffID: `<label style="color: ${color ||colorLeave }">${staffID}</label>`,
                fullname: `<label style="color: ${color || colorLeave}">${empName}</label>`,
                startTime: `<label style="color: ${color || colorLeave}">${punch_time || 'N/A'}</label>`,
                closeTime: `<label style="color: ${color || colorLeave}">${punch_timeb || 'N/A'}</label>`,
                dept: `<label style="color: ${color || colorLeave}">${empDept} </label>`,
                photo: `<img style="width: 75px; height: 55px; padding: 0px; margin: 0px;" src="/${photo}">`,
                leavTyp: `<label style="color: ${color || colorLeave}">${leaType}</label>`,

                late: `<label style="color: ${color || colorLeave}"> ${late || 'N/A'} </label>`,
                left_earl: `<label style="color: ${color || colorLeave}"> ${left_earl || 'N/A'} </label>`,
                overtime: `<label style="color: ${color || colorLeave}"> ${overtime || 'N/A'} </label>`,
                shift: `<label style="color: ${color || colorLeave}"> ${empShift} </label>`,
            }
            await markedAttnd.push(data2);
            leaType ='N/A'
        }

        //https://www.w3schools.com/js/js_array_sort.asp
        markedAttnd.sort(function (a, b) {
            let x = a.startTime.toLowerCase()
            let y = b.startTime.toLowerCase()
            if (x < y) {
                return -1
            }
            if (x > y) {
                return 1
            }
            return 0
        })


        if (!data.length) {
            // console.log('Good => ', histo);
            await genFunct.log(req, [`View attendance data for ${req.params.date}`, (await this.pathname(req)).toString()]);
            return res.status(200).json({ data: markedAttnd });
        } else {
            return markedAttnd;
        }


    } catch (err) {
        console.log('Error from getAttendByDate ', err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

exports.postAttendReportByDate = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                path: `/${process.env.MENT}/getAttendReport`,
                pageTitle: 'Attend Report',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }

        function date(date) {
            return moment(date).format('DD-MM-YYYY');
        }

        function isDepartSelected(dept) {
            if (dept) {
                return `departmentId: ${dept}`
            }
        }

        const from = moment(req.body.repFromDate || req.params.from).format('YYYY-MM-DD');
        const to = moment(req.body.repToDate || req.params.to).format('YYYY-MM-DD');

        const from1 = moment(req.body.repFromDate || req.params.from, 'YYYY-MM-DD');
        const to1 = moment(req.body.repToDate || req.params.to, 'YYYY-MM-DD');

        const daysDff = -1 * moment.duration(from1.diff(to1)).asDays() + 1;
        const days = await genFunct.getMonthWorkingDays(from1) //Math.floor(-1 * moment.duration(fr.diff(to)).asDays() + 1);

        const employId = [];
        const attendData = [];

        let employees;
        if (req.body.getdept) {
            employees = await Employee.findAll({
                where: {
                    dateEmplyed: {
                        [Op.lte]: from
                    },
                    departmentId: req.body.getdept,
                    deleted: 0
                },
                include: [{
                    model: Shift,
                }]
            });

        } else {
            console.log('Without dept ======>');
            employees = await Employee.findAll({
                where: {
                    dateEmplyed: {
                        [Op.lte]: from
                    },
                    deleted: 0
                },
                include: [{
                    model: Shift,
                }]
            });
        }

        // console.log('Length of getAttend ======>', getAttend.length);

        let totalClockIn = 0;
        let totalClockOut = 0;
        let totalLate = 0;
        let totalCloseBT = 0;
        let totalOverTime = 0;

        for (let i = 0; i < employees.length; i++) {
            let empName, empDept, empShift, staffID, photo;

            empName = `${employees[i].title} ${employees[i].fName} ${genFunct.getFulName(employees[i].mName, employees[i].lName)}`;
            staffID = employees[i].staffID;
            photo = (employees[i].photo) ? employees[i].photo : 'img/avatar.svg';
            empShift = (employees[i].shift) ? employees[i].shift.shift_name : 'N/A';
            empDept = await Department.findOne({ where: { id: employees[i].departmentId } }).then(result => {
                return (result) ? result.deptName : 'N/A';
            });


            const dateArray = await genFunct.datearray(from, to);

            let totalClockInPerRange = 0;
            let totalClockOutPerRange = 0;
            let totalLatePerRange = 0
            let totalCloseBTPerRange = 0
            let totalOverTimePerRange = 0

            const employee_id = employees[i].id;

            for (let i = 0; i < dateArray.length; i++) {
                const date = await moment(dateArray[i]).format('YYYY-MM-DD');

                totalClockInPerRange += await PunchData.findAndCountAll({
                    where: {
                        punch_date: date,
                        employeeId: employee_id,
                        clock_type: 'CI'
                    }
                }).then(result => {
                    if (result) {
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].late < 0) {
                                totalLatePerRange += result[i].late;
                            }
                            // totalCloseBTPerRange += result[i].left_earl;
                            // totalOverTimePerRange += result[i].over_time
                        }
                    }
                    return (result.count > 1) ? 1 : result.count;
                });

                totalClockOutPerRange += await PunchData.findAndCountAll({
                    where: {
                        punch_date: date,
                        employeeId: employee_id,
                        clock_type: 'CO'
                    }
                }).then(result => {
                    if (result) {
                        for (let i = 0; i < result.length; i++) {
                            totalCloseBTPerRange += result[i].left_earl;
                            totalOverTimePerRange += result[i].over_time
                        }
                    }
                    return (result.count > 1) ? 1 : result.count;
                });
            }

            totalClockIn += totalClockInPerRange;
            totalClockOut += totalClockOutPerRange;
            totalLate += totalLatePerRange;
            totalCloseBT += totalCloseBTPerRange;
            totalOverTime += totalOverTimePerRange;

            let data = await {
                id: employees[i].id,
                staffID: staffID,
                fullname: empName,
                // daysAtt: (countPre.count + countAbs.count),
                days: `${days}`,
                clockIn: `<label>${totalClockInPerRange}</label>`,
                clockOut: `<label>${totalClockOutPerRange}</label>`,
                percent: `<label>${Math.ceil((totalClockInPerRange / totalClockOutPerRange) * 100).toFixed(2)} %</label>`,
                late: Math.floor(totalLatePerRange / 60),
                closeBT: Math.floor(totalCloseBTPerRange / 60),
                overTime: totalOverTimePerRange,
                dept: empDept,
                photo: `<img style="width: 75px; height: 55px; padding: 0px; margin: 0px;" src="/${photo}">`,
                fdate: req.body.repFromDate,
                tdate: req.body.repToDate,
                email: employees[i].email,
                phone: employees[i].phone,
                manage: `<a href="#" class="getAllAtt">Details</a>`,
                date: `${date(req.body.repFromDate || req.params.from)} - ${date(req.body.repToDate || req.params.to)}`,
                image: `${photo}`,
            }

            totalClockInPerRange = 0;
            totalClockOutPerRange = 0;

            attendData.push(data);
        }

        const summary = `<span style="float:left; font-size: 20px; color: black;">From: ${date(req.body.repFromDate || req.params.from)} To: ${date(req.body.repToDate || req.params.to)} - ${daysDff} day(s)</span><br>
        <span style="float:left; font-size: 20px; color: black;">Total Turnout: ClockIn: ${totalClockIn} ClockOut: ${totalClockOut}</span>`;

        const totals = `Total Turnout: ClockIn: ${totalClockIn} ClockOut: ${totalClockOut}`

        // Percentage Turnout: ${((totalPres / totalAbs) * 100).toFixed(2)} %

        if (req.xhr) {
            console.log('In xhr => ', req.xhr);

            await genFunct.log(req, ['Generated report on attendants data', (await this.pathname(req)).toString()]);

            return res.status(200).json({ data: attendData, date: summary, total: totals });
        } else {
            console.log('In browser => ', );

            await genFunct.log(req, ['Generated report on attendants data pdf', (await this.pathname(req)).toString()]);

            console.log('In browser3 => ', );


            const html = fs.readFileSync(path.join(__dirname, '../views/report-html/attend-report.html'), 'utf-8');
            const filename = Math.random() + '_doc' + '.pdf';

            const document = {
                html: html,
                data: {
                    products: attendData
                },
                path: './docs/' + filename
            }
            await pdf.create(document, options)
                .then(res => {
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                });

            // const filepath = await 'http://192.168.100.5:3001/docs/' + filename;

            const filePathName = await path.join(path.dirname(process.mainModule.filename), 'docs', `${filename}`);

            const data1 = await fs.readFileSync(filePathName);
            res.contentType("application/pdf");

            fileHandler.deleteFile(filePathName);

            return res.send(data1);
        }

    } catch (err) {
        console.log('Error get-By ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.saveManualClock = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files.fillform !== undefined) {
                fileHandler.deleteFile(req.files.fillform[0].path);
            }
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }

        const newData = [];
        const termUser = await TerminalUser.findOne({
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
        });

        const number = termUser.terminal_user_id.split('-')[0];
        const user_id = termUser.terminal_user_id;
        if (req.body.session == 'A') {
            const saveLoop = [req.body.clockInTime + ':00', req.body.clockOutTime + ':00']
            for (let i = 0; i < saveLoop.length; i++) {
                let timestamp = Math.floor(new Date(`${req.body.date} ${saveLoop[i]}`) / 1000)
                const saveClock = await new PunchData({
                    punch_date: req.body.date,
                    punch_time: saveLoop[i],
                    terminal_number: number,
                    user_id: user_id,
                    timestamp: timestamp,
                    punch_agent: 'Manual',
                    userId: req.user.id
                });

                await saveClock.save();
                newData.push({ timestamp: timestamp, user_id: user_id, date: req.body.date, number: number });
            }
        }
        if (req.body.session == 'CI' || req.body.session == 'CO') {
            let punchtime = (req.body.session == 'CI') ? req.body.clockInTime + ':00' : req.body.clockOutTime + ':00';
            let timestamp = Math.floor(new Date(`${req.body.date} ${punchtime}`) / 1000)
            const saveClock = await new PunchData({
                punch_date: req.body.date,
                punch_time: punchtime,
                terminal_number: number,
                user_id: user_id,
                timestamp: timestamp,
                punch_agent: 'Manual',
                userId: req.user.id
            });
            await saveClock.save();
            newData.push({ timestamp: timestamp, user_id: user_id, date: req.body.date, number: number });
        }

        if (newData.length > 0) {
            await genFunct.processPunch(newData);
        }
        // fileHandler.deleteFile(req.files.fillform[0].path);

        await genFunct.log(req, [`Manual clocking for ${termUser.employee.fName}`, (await this.pathname(req)).toString()]);

        return res.status(200).json({ data: 'ok' });

        // console.log('Body => ', req.files.fillform[0].path);

    } catch (err) {
        console.log('Error saveManualClock ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';

        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
}

exports.reportManager = async(req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // consolse.log('Error => ', await errors);
            return res.status(422).json({
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
            });
        }

        const reportType = req.body.reportType;
        const subTypeOne = req.body.subtypeOne || null;
        const subTypeTwo = req.body.subtypeTwo || null;
        const fromDate = req.body.fromDate || null;
        const toDate = req.body.toDate || null;

        fileHandler.deletePDFFiles();
        // console.log('Date => ', fromDate, toDate);
        if (reportType == 'employees' && subTypeOne == 'all') {
            const data = await this.getEmployees(req, res, next, [true, fromDate, toDate]);

            let dateRange = (fromDate) ? `Employees employed between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `All time employees records up to ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`;
            const datafile = 'pdf.pdf'; //await genFunct.generatePDF(res, 'employees', [data, dateRange]);

            // res.contentType("application/pdf");
            // fileHandler.deleteFile(filePathName);
            // res.open(data1, '_blank');
            // console.log('Data1 =>', data1.toString('base64'));
            // return res.send(datafile);
            // console.log('Path => ', datafile[0]);
            
            return res.status(200).json({ data: data, date: dateRange, datafile: datafile[0], key: 'employees all' });
        }

        if (reportType == 'employees' && subTypeOne == 'department') {
            if (subTypeTwo == null) {
                // console.log('subTypeTwo => ', subTypeTwo);
                const data = await this.getDepartments(req, res, next, [true, fromDate, toDate]);
                let dateRange = (fromDate) ? `Department record between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `All time department records up to ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`
                return res.status(200).json({ data: data, date: dateRange, key: 'dept all' });
            } else {
                const deptId = subTypeTwo;
                const dataHistory = [];
                let headDetails;
                let head = [];
                let employees;
                let dateRange;

                // console.log('subTypeTwo2 => ', subTypeTwo);
                const depart = await Department.findOne({ where: { id: deptId, deleted: 0 } });

                if (fromDate) {

                    employees = await Employee.findAndCountAll({
                        where: {
                            departmentId: depart.id,
                            dateEmplyed: {
                                [Op.between]: [fromDate, toDate]
                            },
                        }
                    });
                } else {
                    employees = await Employee.findAndCountAll({
                        where: {
                            departmentId: depart.id,
                            deleted: 0,
                        }
                    });
                }

                dateRange = (fromDate) ? `${employees.count} employees employed between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')} under ${depart.deptName} department` : `All time ${employees.count} employees records up to ${moment(new Date()).format('DD-MM-YYYY HH:m:s')} under ${depart.deptName} department`

                console.log('depart.headByEmployeeId => ', depart.deptName);
                if (depart) {
                    head = await Employee.findOne({ where: { id: depart.headByEmployeeId } }).then(result => {
                        if (result) {
                            // console.log('result.jobdescId => ', result.jobdescId);
                            return JobDesc.findOne({ where: { id: result.jobdescId } }).then(result2 => {
                                if (result2) {
                                    return [`${result.title} ${result.fName} ${genFunct.getFulName(result.mName, result.lName)}`, `${result2.jobTitle}`]
                                }
                                return [`${result.title} ${result.fName} ${genFunct.getFulName(result.mName, result.lName)}`, `N/A`]
                            });
                        }
                        return [];
                    });
                }
                headDetails = await { date: dateRange, name: depart.deptName, status: (head.length) ? 'Active' : 'Vacant', since: moment(depart.updatedAt).format('DD-MM-YYYY'), head: (head.length) ? head[0] : 'N/A', job: (head.length) ? head[1] : 'N/A' }
                    // console.log('Dept => ', employees.count);

                for (let i = 0; i < employees.count; i++) {
                    const sup = await ReportTo.findOne({ where: { employeeId: employees.rows[i].id } }).then(result => {
                        if (result) {
                            if (result.immediateSupEmplyId) {
                                console.log('result.immediateSupEmplyId => ', result.immediateSupEmplyId);
                                return Employee.findOne({ where: { id: result.immediateSupEmplyId } }).then(result2 => {
                                    if (result2) {
                                        return `${result2.title} ${result2.fName} ${genFunct.getFulName(result2.mName, result2.lName)}`;
                                    }
                                })
                            }
                        }
                    });
                    const jobT = await JobDesc.findOne({ where: { id: employees.rows[i].jobdescId } }).then(result => { if (result) { return `${result.jobTitle}` } });

                    let data = { date: moment(employees.rows[i].dateEmplyed).format('DD-MM-YYYY'), staffID: employees.rows[i].staffID, name: `${employees.rows[i].title} ${employees.rows[i].fName} ${genFunct.getFulName(employees.rows[i].mName, employees.rows[i].lName)}`, phone: employees.rows[i].phone, email: employees.rows[i].email, super: (sup) ? sup : 'N/A', jobTitle: (jobT) ? jobT : 'N/A', leave: 'N/A' }

                    dataHistory.push(data);

                }

                await genFunct.log(req, [`View employees under ${depart.deptName} department`, (await this.pathname(req)).toString()]);

                return res.status(200).json({ data: dataHistory, dept: headDetails, key: 'employUD' })

            }
        }

        if (reportType == 'employees' && subTypeOne == 'job description') {
            if (subTypeTwo == null) {
                const data = await this.getJobTitleDesc(req, res, next, [true, fromDate, toDate]);
                let dateRange = (fromDate) ? `Job description record created between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `All time job description records up to ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`
                return res.status(200).json({ data: data, date: dateRange, key: 'job all' });
            } else {
                const jobId = subTypeTwo;
                const employList = [];
                let jobDetails = {};
                let count;
                // let head = ['N/A', 'N/A'];

                const job = await JobDesc.findOne({ where: { id: jobId }, });
                if (fromDate) {
                    count = await Employee.findAndCountAll({
                        where: {
                            jobdescId: job.id,
                            dateEmplyed: {
                                [Op.between]: [fromDate, toDate]
                            }
                        }
                    });
                    // console.log('Data1 => ', await count.count);

                } else {
                    count = await Employee.findAndCountAll({ where: { jobdescId: job.id, deleted: 0 } });
                }

                const dateRange = (fromDate) ? `${count.count} employee(s) employed between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')} under ${job.jobTitle} job decription` : `All time ${count.count} employee(s) records up to ${moment(new Date()).format('DD-MM-YYYY HH:m:s')} under ${job.jobTitle} job decription`


                jobDetails = { total: count.count, date: moment(job.createdAt).format('DD-MM-YYYY'), title: job.jobTitle, des: job.jobDescription, range: dateRange }

                for (let i = 0; i < count.count; i++) {
                    const sup = await ReportTo.findOne({ where: { employeeId: count.rows[i].id } }).then(result => {
                        if (result) {
                            if (result.immediateSupEmplyId) {
                                console.log('result.immediateSupEmplyId => ', result.immediateSupEmplyId);
                                return Employee.findOne({ where: { id: result.immediateSupEmplyId } }).then(result2 => {
                                    if (result2) {
                                        return `${result2.title} ${result2.fName} ${genFunct.getFulName(result2.mName, result2.lName)}`;
                                    }
                                })
                            }
                        }
                    });
                    const dept = await Department.findOne({ where: { id: count.rows[i].departmentId } }).then(result => { if (result) { return `${result.deptName}` } });

                    let data = { date: moment(count.rows[i].dateEmplyed).format('DD-MM-YYYY'), staffID: count.rows[i].staffID, name: `${count.rows[i].title} ${count.rows[i].fName} ${genFunct.getFulName(count.rows[i].mName, count.rows[i].lName)}`, phone: count.rows[i].phone, email: count.rows[i].email, super: (sup) ? sup : 'N/A', dept: (dept) ? dept : 'N/A', leave: 'N/A' }
                    employList.push(data);
                }

                return res.status(200).json({ data: employList, job: jobDetails, key: 'jobbyID' });

            }
        }

        if (reportType == 'employees' && subTypeOne == 'salary grades') {
            if (subTypeTwo == null) {
                const data = await this.getSalaryStructure(req, res, next, [true,fromDate, toDate]);
                let dateRange = (fromDate) ? `Salary grade record created between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `All time Salary grade records up to ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`

                return res.status(200).json({ data: data, date: dateRange, key: 'salary all' });
            } else {
                const salaryId = subTypeTwo;
                const salaryList = [];
                let salaryDetails = {};
                let count;
                // let head = ['N/A', 'N/A'];

                const salary = await SalaryStructure.findOne({ where: { id: salaryId }, include: [{ model: Employee }] });

                if (fromDate) {
                    count = await Employee.findAndCountAll({
                        where: {
                            salarystructureId: salary.id,
                            dateEmplyed: {
                                [Op.between]: [fromDate, toDate]
                            }
                        }
                    });
                } else {
                    count = await Employee.findAndCountAll({ where: { salarystructureId: salary.id, deleted: 0 } });
                }

                const countAllw = await Allowance.findAndCountAll({ where: { salarystructureId: salary.id } }).then(result => {
                    if (result) {
                        let totalAmount = 0;
                        for (let i = 0; i < result.rows.length; i++) {
                            totalAmount += result.rows[i].allwAmount;
                        }
                        return [result.count, totalAmount];
                    } else {
                        return [0, 0];
                    }
                });

                const dateRange = (fromDate) ? `${count.count} employee(s) employed between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')} under ${salary.grade} salary grade` : `All time ${count.count} employee(s) records up to ${moment(new Date()).format('DD-MM-YYYY HH:m:s')} under ${salary.grade} salary grade`

                salaryDetails = { total: count.count, date: moment(salary.createdAt).format('DD-MM-YYYY'), grade: salary.grade, basic: salary.basic.toFixed(2), totalGross: (salary.basic * count.count).toFixed(2), des: salary.description, totalAllw: countAllw[0], allwAmount: countAllw[1].toFixed(2), range: dateRange }

                for (let i = 0; i < count.count; i++) {
                    const sup = await ReportTo.findOne({ where: { employeeId: count.rows[i].id } }).then(result => {
                        if (result) {
                            if (result.immediateSupEmplyId) {
                                console.log('result.immediateSupEmplyId => ', result.immediateSupEmplyId);
                                return Employee.findOne({ where: { id: result.immediateSupEmplyId } }).then(result2 => {
                                    if (result2) {
                                        return `${result2.title} ${result2.fName} ${genFunct.getFulName(result2.mName, result2.lName)}`;
                                    }
                                })
                            }
                        }
                        return 'N/A'
                    });
                    const dept = await Department.findOne({ where: { id: count.rows[i].departmentId } }).then(result => { if (result) { return `${result.deptName}` } else { return 'N/A'; } });

                    const jobT = await JobDesc.findOne({ where: { id: count.rows[i].jobdescId } }).then(result => { if (result) { return `${result.jobTitle}` } });

                    let data = { date: moment(count.rows[i].dateEmplyed).format('DD-MM-YYYY'), staffID: count.rows[i].staffID, name: `${count.rows[i].title} ${count.rows[i].fName} ${genFunct.getFulName(count.rows[i].mName, count.rows[i].lName)}`, phone: count.rows[i].phone, email: count.rows[i].email, super: (sup) ? sup : 'N/A', dept: (dept) ? dept : 'N/A', job: (jobT) ? jobT : 'N/A', leave: 'N/A' }
                    salaryList.push(data);
                }
                return res.status(200).json({ data: salaryList, salary: salaryDetails, key: 'salaryByID' });
            }
        }

        if (reportType == 'leaves') {
            if (subTypeOne == 'leaves') {
                const date = await moment(new Date()).format('YYYY-MM-DD HH:m:s');
                const leaveList = [];
                let leaveType;
                if (fromDate) {
                    leaveType = await LeaveType.findAll({
                        where: {
                            createdAt: {
                                [Op.between]: [fromDate, toDate]
                            }
                        }
                    });
                } else {
                    leaveType = await LeaveType.findAll({ where: { deleted: 0 } });
                }
                if (leaveType) {
                    for (let i = 0; i < leaveType.length; i++) {
                        let countEmp;
                        let onLeave;
                        if (fromDate) {
                            //get employ
                            countEmp = await Employee.findAndCountAll({
                                where: {
                                    leaveTypeId: leaveType[i].id,
                                    dateEmplyed: {
                                        [Op.between]: [fromDate, toDate]
                                    }
                                }
                            });
                            //get how are on leave as of now
                            onLeave = await Leaves.findAndCountAll({
                                where: {
                                    leaveTypeId: leaveType[i].id,
                                    status: 'Approved',
                                    from: {
                                        [Op.gte]: fromDate
                                    },
                                    to: {
                                        [Op.lte]: toDate
                                    },
                                    deleted: 0
                                }
                            });
                        } else {
                            countEmp = await Employee.findAndCountAll({ where: { leaveTypeId: leaveType[i].id, deleted: 0 } });
                            //get how are on leave as of now
                            onLeave = await Leaves.findAndCountAll({
                                where: {
                                    leaveTypeId: leaveType[i].id,
                                    status: 'Approved',
                                    from: {
                                        [Op.lte]: date
                                    },
                                    to: {
                                        [Op.gte]: date
                                    },
                                    deleted: 0
                                }
                            });
                        }

                        let data = { date: moment(leaveType[i].createdAt).format('DD-MM-YYYY'), type: leaveType[i].leaveType, days: leaveType[i].nofdays, gender: leaveType[i].genderBased, des: leaveType[i].description, carryon: (leaveType[i].carryon) ? 'Yes' : 'No', linked: countEmp.count, onLeave: onLeave.count };

                        leaveList.push(data);
                        // console.log('Leav => ', leaveType[i].id, leaveType[i].leaveType, countEmp.count, onLeave.count);
                    }
                }
                let dateRange = (fromDate) ? `Leave policies record created between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `All time Leave policies records up to ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`

                // const data = await this.getLeaveTypes(req, res, next, true);
                return res.status(200).json({ data: leaveList, date: dateRange, key: 'leavesType' });
            } else {
                const fetchData = await this.getAllLeaves(req, res, next, true);
                if (subTypeOne == 'on leave' || subTypeOne == 'approve leave') {
                    const onLeave = [];
                    if (fromDate) {
                        const datearray = await genFunct.datearray(fromDate, toDate);
                            const onLeaveCount = [];
                        for (let i = 0; i < datearray.length; i++) {
                            const leaveStatus = await genFunct.getLeaveProcess(datearray[i], 'Approved');
                            for (let j = 0; j < leaveStatus.length; j++){
                                const status = await (leaveStatus[j].status !== undefined) ? leaveStatus[j].status : leaveStatus[j].status;
                                const id = await (leaveStatus[j].leaveId !== undefined) ? leaveStatus[j].leaveId : leaveStatus[j].id;
                                if (!onLeaveCount.includes(id + '-' + status)) {
                                    const getLeave = await genFunct.getLeave(id);
                                    onLeave.push(getLeave);
                                    onLeaveCount.push(id + '-' + status);
                                }
                            }                            
                            }
                    } else {
                        const leaveStatus = await genFunct.getLeaveProcess(new Date(), 'Approved');
                        for (let j = 0; j < leaveStatus.length; j++){
                                const id = await (leaveStatus[j].leaveId !== undefined) ? leaveStatus[j].leaveId : leaveStatus[j].id;
                                const getLeave = await genFunct.getLeave(id);
                                onLeave.push(getLeave);
                                }
                    }

                    let dateRange = '';
                    let key = '';
                    if (subTypeOne == 'on leave') {
                        key = 'onLeave'
                       dateRange = (fromDate) ? `${onLeave.length} employee(s) were on leave between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `${onLeave.length} employee(s) is/are on leave as of ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`;
                    }
                    if (subTypeOne == 'approve leave') {
                        key = 'approve'
                        dateRange = (fromDate) ? `${onLeave.length} employee(s) leave were approve and are on leave or waiting to go between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `${onLeave.length} employee(s) leave is/are been approved as of ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`;
                    }
                    return res.status(200).json({ data: onLeave, date: dateRange, key: key });
                }

                if (subTypeOne == 'pending leave') {
                    const pending = [];
                    if (fromDate) {
                        const datearray = await genFunct.datearray(fromDate, toDate);
                            const pendingCount = [];
                        for (let i = 0; i < datearray.length; i++) {
                            const leaveStatus = await genFunct.getLeaveProcess(datearray[i], 'Pending');
                            for (let j = 0; j < leaveStatus.length; j++){
                                const status = await (leaveStatus[j].status !== undefined) ? leaveStatus[j].status : leaveStatus[j].status;
                                const id = await (leaveStatus[j].leaveId !== undefined) ? leaveStatus[j].leaveId : leaveStatus[j].id;
                                if (!pendingCount.includes(id + '-' + status)) {
                                    const getLeave = await genFunct.getLeave(id);
                                    pending.push(getLeave);
                                    pendingCount.push(id + '-' + status);
                                }
                            }                            
                            }
                        // }
                    } else {
                            const leaveStatus = await genFunct.getLeaveProcess(new Date(), 'Pending');
                        for (let j = 0; j < leaveStatus.length; j++){
                                const id = await (leaveStatus[j].leaveId !== undefined) ? leaveStatus[j].leaveId : leaveStatus[j].id;
                                const getLeave = await genFunct.getLeave(id);
                                pending.push(getLeave);
                                }
                        }

                    let dateRange = (fromDate) ? `${pending.length} employee(s) leave were on pending and waiting to be approve between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `${pending.length} employee(s) leave is/are pending waiting to be approve as of ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`;

                    return res.status(200).json({ data: pending, date: dateRange, key: 'pending' });
                }

                if (subTypeOne == 'rejected leave') {
                    const rejected = [];
                    if (fromDate) {
                          const datearray = await genFunct.datearray(fromDate, toDate);
                            const rejectedCount = [];
                        for (let i = 0; i < datearray.length; i++) {
                            const leaveStatus = await genFunct.getLeaveProcess(datearray[i], 'Rejected');
                            for (let j = 0; j < leaveStatus.length; j++){
                                const status = await (leaveStatus[j].status !== undefined) ? leaveStatus[j].status : leaveStatus[j].status;
                                const id = await (leaveStatus[j].leaveId !== undefined) ? leaveStatus[j].leaveId : leaveStatus[j].id;
                                
                                if (!rejectedCount.includes(id + '-' + status)) {
                                    const getLeave = await genFunct.getLeave(id);
                                    rejected.push(getLeave);
                                    rejectedCount.push(id + '-' + status);
                                }
                            }                            
                        }
                    } else {
                        const leaveStatus = await genFunct.getLeaveProcess(new Date(), 'Rejected');
                        for (let j = 0; j < leaveStatus.length; j++){
                                const id = await (leaveStatus[j].leaveId !== undefined) ? leaveStatus[j].leaveId : leaveStatus[j].id;
                                const getLeave = await genFunct.getLeave(id);
                                rejected.push(getLeave);
                                }
                    }

                    let dateRange = (fromDate) ? `${rejected.length} employee(s) leave were rejected between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `${rejected.length} employee(s) leave is/are rejected as of ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`;

                    return res.status(200).json({ data: rejected, date: dateRange, key: 'rejected' });
                }

                if (subTypeOne == 'all') {
                    const allLeave = [];
                    const stats = ['Pending', 'Approved', 'Rejected'];
                    if (fromDate) {
                        const datearray = await genFunct.datearray(fromDate, toDate);
                        const allLeaveCount = [];
                        for (let h = 0; h < stats.length; h++) {
                            for (let i = 0; i < datearray.length; i++) {
                                const leaveStatus = await genFunct.getLeaveProcess(datearray[i], stats[h]);
                                for (let j = 0; j < leaveStatus.length; j++) {
                                    const id = await (leaveStatus[j].leaveId !== undefined) ? leaveStatus[j].leaveId : leaveStatus[j].id;
                                
                                    if (!allLeaveCount.includes(id)) {
                                        const getLeave = await genFunct.getLeave(id);
                                        allLeave.push(getLeave);
                                        allLeaveCount.push(id);
                                    }
                                }
                            }
                    }
                    } else {
                        const allLeaveCount = [];
                    for (let i = 0; i < stats.length; i++) {
                        const leaveStatus = await genFunct.getLeaveProcess(new Date(), stats[i]);
                            
                        for (let j = 0; j < leaveStatus.length; j++) {
                            const id = await (leaveStatus[j].leaveId !== undefined) ? leaveStatus[j].leaveId : leaveStatus[j].id;
                            if (!allLeaveCount.includes(id)) {
                                const getLeave = await genFunct.getLeave(id);
                                allLeave.push(getLeave);
                                allLeaveCount.push(id);
                            }
                        }
                    }
                    }

                    let dateRange = (fromDate) ? `Employees leave applications between ${moment(fromDate).format('DD-MM-YYYY')} and ${moment(toDate).format('DD-MM-YYYY')}` : `Employees leave applications as of ${moment(new Date()).format('DD-MM-YYYY HH:m:s')}`;

                    return res.status(200).json({ data: allLeave, date: dateRange, key: 'all' });
                }
            }
        }

        if (reportType == 'attendance') {
            if (subTypeOne == 'bydate') {
                const date = (fromDate) ? fromDate : new Date();
                const deptID = (subTypeTwo) ? subTypeTwo : null;
                const data = [date, deptID]
                const getAttend = await this.getAttendByDate(req, res, next, data);

                console.log('getAttend => ', date, data);

                let dateRange = `Employee(s) attendance for ${moment(date).format('DD-MM-YYYY')}`;

                return res.status(200).json({ data: getAttend, date: dateRange, key: 'attendbydate' });
            }
            if (subTypeOne == 'daterange') {

            }
        }



        // if (reportType == 'employees' && subTypeOne == 'department') {}


        //let begins

    } catch (err) {
        console.log('Error reportManager ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }

    }
};

exports.updateSettings = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }

        const staffID = req.body.staffIDgen;
        const amanclock = req.body.amanclock;
        const getSettings = await SystemSettings.findAll({ where: { deleted: 0 } });

        for (let i = 0; i < getSettings.length; i++) {
            if (getSettings[i].key == 'Staff ID generation') {
                if (getSettings[i].value !== staffID) {
                    await SystemSettings.update({ value: staffID }, { where: { key: 'Staff ID generation' } });
                    await Company.update({ staff_ID_gene: staffID }, { where: { deleted: 0 } });
                    let saveHistory = new SettingsChangeHistory({ key: getSettings[i].key, value: getSettings[i].value, userId: req.user.id, systemSettingId: getSettings[i].id });
                    saveHistory.save();
                    await genFunct.log(req, [`Updated ${getSettings[i].key} value to ${staffID}`, (await this.pathname(req)).toString()]);
                }
            }
            if (getSettings[i].key == 'Manual Clocking') {
                if (getSettings[i].value !== amanclock) {
                    await SystemSettings.update({ value: amanclock }, { where: { key: 'Manual Clocking' } });
                    let saveHistory = new SettingsChangeHistory({ key: getSettings[i].key, value: getSettings[i].value, userId: req.user.id, systemSettingId: getSettings[i].id });
                    saveHistory.save();
                    await genFunct.log(req, [`Updated ${getSettings[i].key} value to ${amanclock}`, (await this.pathname(req)).toString()]);
                }
            }
        }
        // await genFunct.log(req, [`Updated ${'key here'}`, (await this.pathname(req)).toString()]);
        return res.status(200).json({ data: getSettings });
    } catch (err) {
        console.log('Error updateSettings ===>', err);
        msg = 'Sorry something went wrong, please check your input and try again';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.getSettings = async(req, res, next) => {
    try {
        const settings = [];
        const getSettings = await SystemSettings.findAll({ where: { deleted: 0 } });
        for (let i = 0; i < getSettings.length; i++) {
            settings.push({ key: getSettings[i].key, value: getSettings[i].value });
        }
        if (settings.length == 1) {
            const comp = await Company.findOne({ where: { deleted: 0 } });
            if(comp){
                settings.push({ key: 'Staff ID generation', value: comp.staff_ID_gene });
                let saveSettings = new SystemSettings({ key: 'Staff ID generation', value: 'Auto', userId: req.user.id });
                    await saveSettings.save();
            }
            else {
                settings.push({ key: 'Staff ID generation', value: 'Auto' });
                let saveSettings = new SystemSettings({ key: 'Staff ID generation', value: 'Auto', userId: req.user.id });
                    await saveSettings.save();
            }
        }
        await genFunct.log(req, [`View system settings`, (await this.pathname(req)).toString()]);

        // console.log('Req => ', req.session);

        return res.status(200).json({ data: settings });
    } catch (err) {
        console.log('Error updateSettings ===>', err);
        msg = 'Sorry something went wrong';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        const tasklist = [];
        let tasks = '';
        if (req.user.role === "Admin") {
            tasks = await Task.findAll({ where: { deleted: 0 }, order: [
                    ['id', 'DESC']
                ],
             });
        }
        if (req.user.role === "HOD") {
            const dept = await Department.findOne({
                where: {
                    headByEmployeeId: req.user.currentUserEmployeeId,
                    deleted: 0,
                }
            });

            const employ = await Employee.findAll({
                where: { departmentId: dept.id, deleted: 0 }
            });

            let id = await employ.map(employees => employees.id);
            
            tasks = await Task.findAll({ where: { deleted: 0, employeeId: { [Op.in]: id } }, order: [
                    ['id', 'DESC']
                ],
             });   
        }
        if (req.user.role === "STDU") {
            tasks = await Task.findAll({ where: { deleted: 0, employeeId: req.user.currentUserEmployeeId }, order: [
                    ['id', 'DESC']
                ],
             });
        }
        if (tasks) {
            for (let i = 0; i < tasks.length; i++) {
                const countProgress = await TaskProgress.findAndCountAll({ where: { taskId: tasks[i].id } });
                const dateCreated = moment(tasks[i].createdAt).format('DD-MM-YYYY');
                const dueDate = moment(tasks[i].dueDate).format('DD/MM/YYYY');
                let overDue = false;
                if (tasks[i].status) {
                    overDue = Math.floor(new Date(tasks[i].dateCompleted) / 1000) > Math.floor(new Date(tasks[i].dueDate) / 1000) ? true : false;
                    // console.log('Tasks1 => ', tasks[i].taskName, overDue);
                } else {
                    overDue = Math.floor(new Date() / 1000) > Math.floor(new Date(tasks[i].dueDate) / 1000) ? true : false;
                    // console.log('Tasks2 => ', tasks[i].taskName, overDue);

                }
                const toMe = (tasks[i].userId == req.user.id) ? req.user.uuid : false; // bad but dont worry
                const name = await genFunct.getFullName(tasks[i].employeeId);
                
                let data = { taskid: tasks[i].id, task: tasks[i].taskName, desc: tasks[i].description, date:new Date(tasks[i].createdAt).toDateString(), date2:dateCreated, assignedto: name, duedate: new Date(tasks[i].dueDate).toDateString(), duedate2: dueDate, status: tasks[i].status, overDue:overDue, employeeId:tasks[i].employeeId, toMe: toMe, dateComp: (tasks[i].status)?new Date(tasks[i].dateCompleted).toDateString():'N/A', countProgress:countProgress.count };

                tasklist.push(data);
            }
        }
        // console.log('Tasks => ', tasklist);
        await genFunct.log(req, [`View task list`, (await this.pathname(req)).toString()]);
        return res.status(200).json({ data: tasklist });
    } catch (err) {
        console.log('Error getTasks ===>', err);
        msg = 'Sorry something went wrong';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        }
    }
};

exports.addTask = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }
        const asignedTo = (req.user.role == 'STDU') ? req.user.currentUserEmployeeId : req.body.assignTo;
        if (req.body.taskMode == 'addMode') {
                const addTask = await new Task({
                    taskName: req.body.taskName,
                    description: req.body.taskDescript,
                    dueDate: `${req.body.dueDate} 23:59:59`,
                    employeeId: asignedTo,
                    userId: req.user.id
                });
                const task = await addTask.save();
                // Send Email to the assignee
                const head = 'New task has been assigned to you.';
                const taskName = req.body.taskName;
                const taskAt = 'Created Date: '+new Date(task.createdAt).toUTCString()
                const taskDue = new Date(task.dueDate).toUTCString()
                const assignBy = req.user.name;
                const taskDecs = req.body.taskDescript;

                const name = await genFunct.getFullName(asignedTo);
                const emplEmail = await Employee.findOne({ where: { id: asignedTo }});
                const header = [emplEmail.email, `New task: ${taskName}`, req.user.id];
                const taskData = [name,taskName, taskAt, taskDue, assignBy, taskDecs, head]
                const content = await newTask(taskData)    
                const status = await sendMail(header, content);
                const state = (status)?'Task created: Email sent':'Task created: Email could not be sent, will try again in next 5 minutes'
            
                await genFunct.log(req, ['Created new task', (await this.pathname(req)).toString()]);
                return res.status(200).json({ data: state });
            }
        if (req.body.taskMode == 'editMode') {
                const taskId = req.body.taskID;
                const task = await Task.findOne({ where: { id: taskId, deleted: 0 } });
                task.taskName = req.body.taskName;
                task.description = req.body.taskDescript;
                task.dueDate = req.body.dueDate;
                task.employeeId = asignedTo;
                task.userId = req.user.id;
            
                const saveTask = await task.save();
                const head = `The task '${saveTask.taskName}' assigned to you have been updated.`;
                const taskName = req.body.taskName;
                const taskAt = 'Updated at: '+new Date(saveTask.updatedAt).toUTCString()
                const taskDue = new Date(saveTask.dueDate).toUTCString()
                const assignBy = req.user.name;
                const taskDecs = req.body.taskDescript;

                const name = await genFunct.getFullName(asignedTo);
                const emplEmail = await Employee.findOne({ where: { id: asignedTo }});
                const header = [emplEmail.email, `Task updated: ${taskName}`, req.user.id];
                const taskData = [name,taskName, taskAt, taskDue, assignBy, taskDecs, head]
                const content = await newTask(taskData)    
                const status = await sendMail(header, content);
                const state = (status)?'Task updated: Email sent':'Task updated: Email could not be sent, will try again in next 5 minutes'
                
                await genFunct.log(req, ['Updated a task', (await this.pathname(req)).toString()]);
                return res.status(200).json({ data: state });
            }
        return res.status(500).json({ error: 'Data not save.'});

    } catch (err) {
       console.log('Error addTask ===>', err);
        msg = 'Sorry something went wrong';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        } 
    }
};

exports.addProgress = async (req, res, next) => {
    try {
        
        const errors = validationResult(req);
        let state = '';
        if (!errors.isEmpty()) {
            return res.status(422).json({ validationErrors: errors.array() });
        }
        const taskStatus = (req.body.taskStatus !== undefined) ? req.body.taskStatus : 0;
        const addProgress = await new TaskProgress({
            taskProgress: req.body.progressDescript,
            status: taskStatus,
            taskId: req.body.taskProID,
            userId: req.user.id
        });
        addProgress.save();
        if (taskStatus) {
            const dateComplete = new Date();
            await Task.update({ status: taskStatus, dateCompleted: dateComplete }, { where: { id: req.body.taskProID } });
            
            const task = await Task.findOne({ where: { id: req.body.taskProID } });
            const user = await User.findOne({ where: { id: task.userId } });
            const taskName = task.taskName || 'N/A';
            const taskAt = new Date(task.createdAt).toUTCString()|| 'N/A'
            const taskDue = new Date(task.dueDate).toUTCString() || 'N/A'
            const assignTo = req.user.name || 'N/A';
            const taskDecs = task.description || 'N/A';
            const head = `Task completed`;
            const dateCompleted = new Date(task.dateCompleted).toUTCString();
            const overDue = Math.floor(new Date(task.dateCompleted) / 1000) > Math.floor(new Date(task.dueDate) / 1000) ? 'Yes' : 'No';

            const header = [user.email, `Task Completed: ${task.taskName}`, req.user.id];
            const taskData = [user.name,taskName, taskAt, taskDue, assignTo, taskDecs, head, dateCompleted, overDue]
            const content = await taskCompleted(taskData)    
            const status = await sendMail(header, content);
            state = (status) ? 'Task updated: Email sent' : 'Task updated: Email could not be sent, will try again in next 5 minutes';
        }
                
        // Send Email to the assignee but don't send to same person
        await genFunct.log(req, ['Added task progres task', (await this.pathname(req)).toString()]);
        return res.status(200).json({ data: state });

    } catch (err) {
       console.log('Error addTask ===>', err);
        msg = 'Sorry something went wrong';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        } 
    }
};

exports.delTask = async(req, res, next)=>{
    try {
        const taskId = req.params.taskId;
        const userRole = req.user.role;
        const userId = req.user.id;
        const getTask = await Task.findOne({ where: { id: taskId, deleted: 0 } });
        if (getTask) {
            if (userRole == 'Admin') {
                await Task.update({ deleted: 1 }, { where: { id: taskId } });
                await TaskProgress.update({ deleted: 1 }, { where: { taskId: taskId } });
                await genFunct.log(req, ['Deleted task', (await this.pathname(req)).toString()]);
                return res.status(200).json({ data: 'Ok' });
            }
            if ((userRole == 'HOD' && userId == getTask.userId) || userRole == 'STDU' && userId == getTask.userId) {
                await Task.update({ deleted: 1 }, { where: { id: taskId } });
                await TaskProgress.update({ deleted: 1 }, { where: { taskId: taskId } });
                await genFunct.log(req, ['Deleted task', (await this.pathname(req)).toString()]);
                return res.status(200).json({ data: 'Ok' });
            }
            return res.status(500).json({ error: 'Data not save.'});
        }
        return res.status(500).json({ error: 'Data not save.'});

    } catch (err) {
        console.log('Error delTask ===>', err);
        msg = 'Sorry something went wrong';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        } 
    }
}

exports.viewTaskProgress = async(req, res, next)=>{
    try {
        const taskId = req.params.taskId;
        const taskProgress = [];

        const getProgress = await TaskProgress.findAll({ where: { taskId: taskId, deleted: 0 } });
        if (getProgress) {
            for (let i = 0; i < getProgress.length; i++){
                const user = await User.findOne({ where: { id: getProgress[i].userId } });
                const emp = await Employee.findOne({ where: { id: user.currentUserEmployeeId } });
                const name = await genFunct.getFullName(emp.id);
                let data = { date: new Date(getProgress[i].createdAt).toDateString(), name: name, image: emp.photo, desc: getProgress[i].taskProgress };
                taskProgress.push(data);
            }
            await genFunct.log(req, [`View task progress`, (await this.pathname(req)).toString()]);
            return res.status(200).json({ data: taskProgress });
        }
    } catch (err) {
        console.log('Error delTask ===>', err);
        msg = 'Sorry something went wrong';
        if (req.xhr) {
            return res.status(500).json({ error: msg });
        } else {
            return errorsfile.get500(req, res, next, msg);
        } 
    }
}