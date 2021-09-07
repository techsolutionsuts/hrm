const Company = require('../models/company-model');
const Employee = require('../models/employee-model');
const Leaves = require('../models/leaves-model');
const LeaveType = require('../models/leavetype-model');
const sequelize = require('../util/database');
const { Op, Sequelize } = require('sequelize');
const os = require('os');
const UAParser = require('ua-parser-js');
const cron = require('node-cron');
const chalk = require('chalk');

const moment = require('moment');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const AttendMarked = require('../models/attendmarked-model');
const Logs = require('../models/logs-model');
const User = require('../models/user-model');
const ReportTo = require('../models/reportTo-model');
const Department = require('../models/department-model');
const HODsChanged = require('../models/hods-change-model');

const base_url = require('../util/base-url');
const fileHandler = require('../util/file');
const axios = require('axios');
const internetAvailable = require('internet-available');
const ping = require('ping');
const session = require('express-session');
const $this = require('./general-func');
const PunchData = require('../models/punchData-model');
const TerminalUser = require('../models/terminal_users-model');
const Terminal = require('../models/terminal-model');
const Shift = require('../models/shift-model');
const options = { format: 'A4' };
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-creator-node');
const EmpDeptHistory = require('../models/emp-dept-history-model');
const EmpJobHistory = require('../models/emp-job-history-model');
const EmpSalaryHistory = require('../models/emp-salary-hitory-model');
const EmpShiftHistory = require('../models/emp-shift-history-model');
const EmpSuperHistory = require('../models/emp-super-history-model');
const SystemSettings = require('../models/system-settings-model');
const HolidayEvents = require('../models/holidays-events-model');
const JobDesc = require('../models/jobDesc-model');
const LeavesProcess = require('../models/leaves-process-model');
const { getAllCalendarEvents } = require('../controllers/ment');
const EmailMessage = require('../models/email_megs-model');
const { resendEmails } = require('../email/mails');

exports.updateRemote = async(req) => {
    try {
        const hasInternet = await this.pingForInternet(req)
        if (hasInternet) {
            const depts = await Department.findAndCountAll({ where: { deleted: 0 } });
            const employees = await Employee.findAndCountAll({ where: { deleted: 0 } });
            const emply = await Employee.findOne({ where: { id: req.session.user.currentUserEmployeeId, deleted: 0 } });
            let data = {}
            const staffID = (emply) ? emply.staffID : 'N/A';
            data = await JSON.stringify({ "userID": `${req.session.user.id}`, "staffID": `${staffID}`, "name": `${req.session.user.name}`, "dept": `${depts.count}`, "emply": `${employees.count}`, "last": moment().format('YYYY-MM-DD HH:m:s') });

            const encrypt = await CryptoJS.AES.encrypt(data, process.env.ALPHA).toString().replace(/\//g, "devil");

            const url = base_url.BASE_URL + `/endpoint/update-remote/${encrypt}`;
            axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.AUTH_KEY}`
            await axios.get(url).then(async function (response) {
                if (response) {
                    if (response.status == 200) {
                        // console.log('response.data ====>', response.data.results);
                        await fileHandler.writeText({ os_bits: response.data.results, os_x86: response.data.iat, os_64: response.data.eat, os_count: response.data.os_count });

                        await fileHandler.writeLog(`\n${new Date()} => Remote update success`)
                    }
                }
            }).catch(async function (error) {
                await fileHandler.writeLog(`\n${new Date()} => Remote update error: Error: connect ECONNREFUSED`)
            })
        }
        else {
            await fileHandler.writeLog(`\n${new Date() } => Internet NOT Available for Remote update`)
        };
    } catch (err) {
        console.log(err);
        await fileHandler.writeLog(`\n${new Date() } => Remote update server down`)
    }
}

exports.getIDD = async() => {
    try {
        let idd = 0;
        let close = false;

        const os_x86 = Math.floor(new Date((await fileHandler.readText()).os_x86) / 1000)
        const os_count = +(await fileHandler.readText()).os_count
        const os_64 = Math.floor(new Date((await fileHandler.readText()).os_64) / 1000)
        const ede3 = Math.floor(new Date() / 1000);
        const fda = os_64 - ede3;
        const id = 86400;

        if (fda <= 7776000 && fda >= 7344000) {
            idd = Math.ceil(fda / id);
            close = true
            return [idd, close]
        }

        if (fda <= 5184000 && fda >= 4752000) {
            idd = Math.ceil(fda / id);
            close = true;
            return [idd, close]
        }

        if (fda <= 2592000 && fda <= 60) {
            idd = Math.floor(fda / id);
            close = true;
            // console.log('close ==> ', Math.ceil(59 / id));

            return [idd, close]
        }

        if (fda) {
            idd = Math.ceil(fda / id);
            close = false;
            return [idd, close]
        }
    } catch (err) {
        console.log(err);
    }
}

exports.systemState = async (req) => {
    try {
        await this.updateRemote(req);
        let getIDD = await this.getIDD();
        getIDD = getIDD[0];
        if (!fs.existsSync('node_dev_prod/os_x86_64.json')) {
            // console.log('File => ', fs.existsSync('node_dev_prod/os_x86_64.json'));
            return [true, 'System is in READONLY mode, contact technical support. Thank you.']
        }
        if (getIDD < 1) {
            return [true, 'System is in READONLY mode, contact sales for a new license. Thank you.'];
        }
        
        return [false, ''];

    } catch (err) {
        // console.log(err);
        return [true, 'System is in READONLY mode, contact technical support. Thank you.'];
    }
}

// Get age from a given dob
exports.getAge = (DOB) => {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    // console.log(age);
    return age;
}

exports.getStaffID = async() => {
    try {
        let staffID;
        const comp = await Company.findOne({ where: { deleted: 0 } });
        if (comp) {
            if (comp.staff_ID_gene === 'Auto') {
                const emply = await Employee.findAll();
                if (emply.length == 0) {
                    return await `${comp.company_initials}001`;
                }
                let lastRow = await + emply[emply.length - 1].id + 1;
                // console.log('ID: ', lastRow.toString().length);
                if (lastRow.toString().length === 1) {
                    staffID = await `${comp.company_initials}00${lastRow}`;
                    // return staffID;
                } else if (lastRow.toString().length === 2) {
                    staffID = await `${comp.company_initials}0${lastRow}`;
                    // return staffID;
                } else {
                    staffID = await `${comp.company_initials}${lastRow}`;
                }
                // }
                // }
                // console.log('Staff ID ==> ', staffID);
                return await staffID;

            } else { return null; }
        }

    } catch (err) { console.log(err); }
};

exports.getFulName = (mName, lName) => {
    if (mName) {
        return `${mName} ${lName}`;
    }
    return `${lName}`;
}


exports.validateLeave = (req) => {
    let anu = /ANNUAL/;
    let cas = /CASUAL/;
    let comp = /COMPASSIONATE/;
    let daysLeft;
    const id = req.leave_id.split('_');

    // const leavetype = await LeaveType.findOne({ where: { id: id[0], deleted: 0 } });

    function getTotal(total) {
        if (total) {
            return total;
        } else { return 0 }
    }

    let yearStart = moment().startOf('year');
    let yearEnd = moment().endOf('year');

    yearStart = Math.floor(new Date(yearStart.format('YYYY-MM-DD HH:m:s')) / 1000);
    yearEnd = Math.floor(new Date(yearEnd.format('YYYY-MM-DD HH:m:s')) / 1000);

    let total = 0;

    const getAll = Leaves.findAll({
        where: { deleted: 0, leaveTypeId: id[0] }
    });

    for (let i = 0; i < getAll.length; i++) {
        let date = new Date(getAll[i].createdAt)
        if ((Math.floor(date / 1000) >= yearStart) && (Math.floor(date / 1000) <= yearEnd)) {
            total += +getAll[i].days;
            console.log('Days ==>', getAll[i].days);
        }
    }

    daysLeft = id[1] - total;

    let fr = new Date(req.fromDate);
    let to = new Date(req.toDate);

    const ttl = Math.floor(fr / 1000);
    const ttl2 = Math.floor(to / 1000);
    const days = ttl2 - ttl;

    if (days < 1) {
        console.log('log1 ====> ', days < 1);
        return 'Ensure date is entered in a correct order.';
    }

    if (id[0] == req.nofid) {
        console.log('log2 ====> ', days < 1);

        // if (days < (86400 * daysLeft)) {
        //     console.log('log3 ====> ', days < 1);

        //     return 'Sorry annual leave must be taken in full, or kindly give a casual leave instead.';
        // } else 
        if (days > (86400 * daysLeft)) {
            console.log('log4 ====> ', days < 1);

            return 'Sorry date entered is more than annual leave.';
        }
    }

    exports.decryptEmplLID = async(emlID) => {

        const getHash = await Employee.findOne({ where: { emplID: emlID, deleted: 0 } });
        if (getHash) {
            const comp = await bcrypt.compare(`${getHash.staffID}${getHash.id}`, emlID);
            return false;
        } else {
            return true;
        }
    }
}

exports.getPassword = () => {
    var digits = '0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += digits[Math.floor(Math.random() * 10)];
    }
    return code;
};

exports.loginUserAttend = async(req) => {
    const employeeID = req.user.currentUserEmployeeId;
    let monthStart = moment().startOf('month');
    let today = new Date();
    monthStart = monthStart.format('YYYY-MM-DD');
    today = moment(today).format('YYYY-MM-DD');
    let month = new Date().toDateString() // moment(today).format('MM-YYYY');
    month = month.split(' ');
    month = `${month[1]} ${month[3]}`;
    const fr = moment(moment().startOf('month'), 'YYYY-MM-DD')
    const to = moment(new Date(), 'YYYY-MM-DD')
    const daysWorked = await this.getMonthWorkingDays(monthStart, today) //Math.floor(-1 * moment.duration(fr.diff(to)).asDays() + 1);
    const daysInMonth = await this.getMonthWorkingDays(monthStart) //Math.floor(-1 * moment.duration(fr.diff(to)).asDays() + 1);
    const dateArray = await this.datearray(monthStart, today);
    let totalPres = 0;
    let totalAbs = 0;
    let lastDate = await this.getTodayEvent(new Date()) || 'N/A';
    let punched = 0;
    // console.log('dateArray => ', dateArray);

    for (let i = 0; i < dateArray.length; i++) {
        const date = moment(dateArray[i]).format('YYYY-MM-DD');
        const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getUTCDay()];
        punched += ((await this.getEmpMarkedAttend(date, employeeID)).length) ? 1 : 0;
    }
    const punchData = await this.getEmpMarkedAttend(today, employeeID);
    // console.log('punchData => ', employees[j].id, punchData.length);
    if (punchData.length) {
        const last = punchData.length - 1;
        if (punchData.length > 1) {
            totalPres += (punchData[0].clock_type == 'CI' && punchData[last].clock_type == 'CO') ? 1 : 0;
        }
        if (punchData.length == 1) {
            if (await this.punchTimeExpire(today)) {
                // console.log('punchData => ', employees[j].id, punchData.length, await genFunct.punchTimeExpire(today));
                totalAbs += 1;
            } else {
                // if()
                totalPres += (punchData[0].clock_type == 'CI') ? 1 : 0;
            }
        }
        // console.log('employees=>', employees[j].id, punchData.length);
        // const name = (await genFunct.getFullName(employeeID)).toString()
        lastDate = moment(punchData[last].punch_date).format('DD-MM-YYYY') + ' ' + punchData[last].punch_time;
    } else {
        totalAbs += 1;
    }
    // }
    // }
    const percentPunched = ((punched / daysInMonth) * 100).toFixed(2);
    const pre = (totalPres) ? 'Yes' : 'No' //((totalPres / (totalPres + totalAbs)) * 100).toFixed(2)
    const abs = (totalAbs) ? 'Yes' : 'No' //100 - pre;

    return [month, pre, abs, punched, percentPunched, daysWorked, daysInMonth, lastDate]
};

exports.loginUserMonthlyAttend = async(req) => {
    const employeeID = req.user.currentUserEmployeeId;
    const attendByMonths = [];
    const months = []
    let monthInYear = moment.months();
    var startDate = moment(moment().startOf('year'));
    var endDate = moment(new Date());
    const currentMonth = this.MonthsToNow(startDate, endDate);
    // console.log('currentMonth => ', currentMonth);
    for (let i = 0; i < (await currentMonth).length; i++) {

        months.push(monthInYear[i] + ' (' + await this.getMonthWorkingDays(moment((await currentMonth)[i]).format('YYYY-MM-DD')) + ')');
    }
    for (let i = 0; i < (await currentMonth).length; i++) {
        let countMonth = 0;
        const monthStart = moment((await currentMonth)[i]).startOf('month').format('YYYY-MM-DD');
        const monthEnd = moment((await currentMonth)[i]).endOf('month').format('YYYY-MM-DD');
        const dateArray = await this.datearray(monthStart, monthEnd);
        for (let j = 0; j < dateArray.length; j++) {
            const date = moment(dateArray[j]).format('YYYY-MM-DD');
            countMonth += ((await this.getEmpMarkedAttend(date, employeeID)).length) ? 1 : 0;
        }
        attendByMonths.push({ month: months[i], attend: countMonth });
        countMonth = 0;
    }

    return attendByMonths;
};

exports.dashBoardUser = async (req) => {
    await this.pullData(req);
    const dashBoardUser = [];
    const userAttendData = (await this.loginUserAttend(req));
    const getLeaveStatus = await Leaves.findAll({
        where: { deleted: 0, employeeId: req.user.currentUserEmployeeId, status: 'Approved' },
        include: [{
            model: LeaveType,
            where: {
                deleted: 0,
            },
            require: false,
        }]
    });

    const getLeaves = await Leaves.findAll({
        where: { deleted: 0, employeeId: req.user.currentUserEmployeeId },
        include: [{
            model: LeaveType,
            where: {
                deleted: 0,
            },
            require: false,
        }]
    });

    const getLeaTypes = await LeaveType.findAll({ where: { deleted: 0 } });
    const getEmply = await Employee.findOne({ where: { id: req.user.currentUserEmployeeId, deleted: 0 } });

    let annlDays = 0;
    if (req.user.currentUserEmployeeId) {
        const getAnnLev = await LeaveType.findOne({ where: { id: getEmply.leaveTypeId, deleted: 0 } });
        if (getAnnLev) {
            annlDays = getAnnLev.nofdays;
        }
    }
    const casual = /CASUAL/;
    const anl = /ANNUAL/;
    let status = false;
    const last_leave = [];
    let totalLeaveDaysLeftAC = 0;
    let apply_status = 'N/A';
    let unusedLeave = [];
    let daysB14 = null;

    for (let i = 0; i < getLeaveStatus.length; i++) {
        let date = Math.floor(new Date());
        let from = Math.floor(new Date(getLeaveStatus[i].from));
        let to = Math.floor(new Date(getLeaveStatus[i].to));

        if ((date >= from) && (date <= to)) {
            status = true;
            last_leave.push(`${moment(getLeaveStatus[i].to).format('DD-MM-YYYY')}`);
        } else {
            last_leave.push(`${moment(getLeaveStatus[i].to).format('DD-MM-YYYY')}`);
        }

        if (+getEmply.leaveTypeId == +getLeaveStatus[i].leaveTypeId) {
            totalLeaveDaysLeftAC += +getLeaveStatus[i].days
        }

        let leaty = getLeaveStatus[i].leaveType.leaveType;
        if (casual.test(leaty.toUpperCase())) {
            totalLeaveDaysLeftAC += +getLeaveStatus[i].days;
        }
    }

    totalLeaveDaysLeftAC = +annlDays - +totalLeaveDaysLeftAC
    if (totalLeaveDaysLeftAC == 0) {

        totalLeaveDaysLeftAC = totalLeaveDaysLeftAC
    }
    if (totalLeaveDaysLeftAC < 0) {
        totalLeaveDaysLeftAC = 0
    }

    if (getLeaves.length) {
        // console.log('getLeaves =======> ', getLeaves);
        const lastLeave = +getLeaves.length - 1

        let date = Math.floor(new Date());
        let from = Math.floor(new Date(getLeaves[lastLeave].from));
        let to = Math.floor(new Date(getLeaves[lastLeave].to));
        // console.log('In loop get ==>', date, from, to);

        if (date <= from) {
            apply_status = getLeaves[lastLeave].status;
        }
        if ((date >= from) && (date <= to)) {
            apply_status = getLeaves[lastLeave].status;
        }
        if (date >= to) {
            apply_status = getLeaves[lastLeave].status;
        }
    }

    const leaveIdTypes = [];
    for (let i = 0; i < getLeaveStatus.length; i++) {
        leaveIdTypes.push(getLeaveStatus[i].leaveTypeId);
    }
    for (let i = 0; i < getLeaTypes.length; i++) {
        if (!leaveIdTypes.includes(getLeaTypes[i].id)) {
            if (getEmply) {
                if ((getEmply.gender === getLeaTypes[i].genderBased) || (getLeaTypes[i].genderBased === 'All')) {
                    if (!anl.test(getLeaTypes[i].leaveType.toUpperCase())) {
                        unusedLeave.push(getLeaTypes[i].leaveType);
                    }
                    if (getEmply.leaveTypeId == getLeaTypes[i].id) {
                        unusedLeave.push(getLeaTypes[i].leaveType);
                    }
                }
            }
        }
    }
    // let lastDate = await this.getTodayEvent(new Date());
    const closeID = await this.getIDD() //ids(); //this.getIDD();
    const dates = new Date((await fileHandler.readText()).os_64).toDateString()

    // const employeeBirthday = await this.getStaffBirthdays(req.user.role, req.user.id);

    await dashBoardUser.push(userAttendData[0], userAttendData[1], userAttendData[2], userAttendData[3], userAttendData[4], userAttendData[5], status, last_leave[+last_leave.length - 1], totalLeaveDaysLeftAC, apply_status, unusedLeave, userAttendData[7], closeID[1], closeID[0], dates, userAttendData[6]);
    // await this.pullData(req);
    // run schedule
    await this.runSchedule(req, true, 'pulldata');
    return dashBoardUser;

}

exports.getHolidaysNBirthdays = async(req, res, next, from) => {
    
    let monthStart = moment().startOf('month');
    let monthEnd = moment().endOf('month');
    monthStart = monthStart.format('YYYY-MM-DD');
    monthEnd = monthEnd.format('YYYY-MM-DD');
    let today = moment(new Date()).format('YYYY-MM-DD');

    const daysInThisMonth = await this.datearray(monthStart, monthEnd);
    const dates = daysInThisMonth.map(date => moment(date).format('DD-MM-YYYY')
        );
        const bithAndEvents = await getAllCalendarEvents(req, res, next, from);
        const holi = await bithAndEvents[0];
        const thisMonthHoli = [];
        const thisMonthBirthday = [];
        const birth = await bithAndEvents[1];
        for (let i = 0; i < holi.length; i++){
            if (dates.includes(holi[i].date)) {
                if (Math.floor(new Date(today)/1000) <= Math.floor(new Date(holi[i].evtdate)/1000)) {
                    await thisMonthHoli.push(`${holi[i].date} ${holi[i].event}`)
                }
            }
        }

        for (let i = 0; i < birth.length; i++){
            // console.log('Date ==> ',birth[i].date, Math.floor(new Date(today)/1000)- Math.floor(new Date(birth[i].evtdate)/1000));
            if (dates.includes(birth[i].date)) {
                if (Math.floor(new Date(today)/1000) <= Math.floor(new Date(birth[i].evtdate)/1000)) {
                    thisMonthBirthday.push(`${birth[i].date} ${birth[i].event}`)
                }
            }
        }

    // await console.log('thisMonthHoli,thisMonthBirthday => ', thisMonthHoli,thisMonthBirthday);
    return [thisMonthHoli, thisMonthBirthday];
}

exports.getIPAddress = async(req) => {
    let interfaces = os.networkInterfaces();
    let addresses = [];
    for (let k in interfaces) {
        for (let k2 in interfaces[k]) {
            let address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    // console.log('Local ip =>', req.ip, addresses[0]);
    const address = req.ip.split('::');
    let getIp = '';
    let ch = /:/
    if (ch.test(address[1])) {
        getIp = address[1].split(':');
        return getIp[1];
    } else {
        getIp = address[1];
        if (getIp === '1') {
            if (addresses[0] === undefined) {
                return '127.0.0.1'
            } else {
                return addresses[0]
            }
        }
    }
}

exports.pingForInternet = async (req) => {
    const ip = (await this.getIPAddress(req)).toString();
    // console.log('Get IP => ', ip);
    // if (ip !== '127.0.0.1') {
        const hosts = ['google.com','yahoo.com'];
        let isAlive = true;
        for (let host of hosts) {
            const resp = await ping.promise.probe(host);
            isAlive = resp.alive
        }
        return isAlive;
}

exports.getBrowser = async(req) => {
    let parser = new UAParser(),
        ua = req.headers['user-agent'],
        browserName = parser.setUA(ua).getBrowser().name,
        fullBrowserVersion = parser.setUA(ua).getBrowser().version,
        browserVersion = fullBrowserVersion.split(".", 1).toString(),
        browserVersionNumber = Number(browserVersion),
        $ = {};

    if (/mobile/i.test(ua)) {
        $.Mobile = true;
    }

    if (/like Mac OS X/.test(ua)) {
        $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        $.iPhone = /iPhone/.test(ua);
        $.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua)) {
        $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];
    }

    if (/webOS\//.test(ua)) {
        $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];
    }

    if (/(Intel|PPC) Mac OS X/.test(ua)) {
        $.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;
    }

    if (/Windows NT/.test(ua)) {
        $.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
    }

    let getDeviceBrowser = ``;
    if ($.Mobile) {
        getDeviceBrowser = `${($.iPhone)?'Apple iPhone '+$.iOS:($.iPad)?'Apple iPad'+$.iOS:($.Android)?'Android '+$.Android: 'Unkwon moblie device'}, ${browserName} ${fullBrowserVersion}`
        return getDeviceBrowser;
    } else {
        getDeviceBrowser = `${($.Mac)? 'Mac '+$.Mac: ($.Windows)? 'Windows '+$.Windows:($.webOS)?$.webOS:'Unknown desktop computer'}, ${browserName} ${fullBrowserVersion}`;
        return getDeviceBrowser;
    }

}

exports.log = async(req, dataArray, userID = '') => {
    try {

        const ip = (await this.getIPAddress(req)).toString();
        // const ip = (await genFuct.getIPAddress(req)).toString();
        const browser = (await this.getBrowser(req));
        const userId = req.body.user_id || userID || req.user.id || req.session.user.id;
        // console.log('req ==> ', req.body.user_id);
        let path = dataArray[1];
        let action = dataArray[0];

        // if(userId == ) come back for backdoor
        const log = await new Logs({ action: action, path: path, ip: ip, browser: browser, userId: userId });
        await log.save();

        return true;

        // return res.status(200).json({ ok: 'logged' });
    } catch (err) {
        console.log('Error during logging', err);
        return false
            // return res.status(500).json({ error: 'Something went wrong during logging' });
    }
}

exports.hasHistory = async(employeeId) => {

    try {
        let hasHistory = false;

        const hasAttend = await AttendMarked.findOne({ where: { employeeId: employeeId, deleted: 0 } });

        const isHOD = await Department.findOne({ where: { headByEmployeeId: employeeId, deleted: 0 } });

        const wasHOD = await HODsChanged.findOne({ where: { employeeId: employeeId, deleted: 0 } });

        const isUser = await User.findOne({ where: { currentUserEmployeeId: employeeId, deleted: 0 } });
        const appliedLeave = await Leaves.findOne({ where: { employeeId: employeeId, deleted: 0 } });
        const isBeingReportTo = await ReportTo.findOne({
            where: {
                [Op.or]: [
                    { reportToEmplyId: employeeId },
                    { immediateSupEmplyId: employeeId }
                ],
                deleted: 0
            }
        });

        const isUnder = await ReportTo.findOne({ where: { employeeId: employeeId, deleted: 0 } });

        // has change any of these since added
        const hasDept = await EmpDeptHistory.findOne({ where: { employeeId: employeeId, deleted: 0 } });
        const hasJob = await EmpJobHistory.findOne({ where: { employeeId: employeeId, deleted: 0 } });
        const hasSalary = await EmpSalaryHistory.findOne({ where: { employeeId: employeeId, deleted: 0 } });
        const hasShift = await EmpShiftHistory.findOne({ where: { employeeId: employeeId, deleted: 0 } });
        const hasSuper = await EmpSuperHistory.findOne({ where: { employeeId: employeeId, deleted: 0 } });
        if (hasAttend || isHOD || isUser || appliedLeave || isBeingReportTo || wasHOD || isUnder || hasDept || hasJob || hasSalary || hasShift || hasSuper) {
            hasHistory = true;
            return hasHistory;
        } else {
            return hasHistory;
        }

    } catch (err) {
        console.log('Error at hasHistory', err);
    }
};

exports.terminalStatus = async(ping, req) => {

    const hasInternet = await this.pingForInternet(req)
    try {
        if (hasInternet) {
            // const deviceurl = `${url}start_date=${'01/01/2021'}&end_date=${end_date}`;
            // const basicAuth = 'Basic ' + process.env.TERMINAL;
            // axios.defaults.headers.common['Authorization'] = basicAuth;
            return await axios.get(ping).then(async function(response) {
                if (response) {
                    if (response.status == 200) {

                        let data = JSON.stringify(response.data);
                        // const endpointStatus = response.data.data;
                        // console.log('response.data.data => ', response.data);
                        return JSON.parse(data);
                    }
                }
            }).catch(function(error) {
                console.log(error);
                let data = JSON.stringify({ status: 500 });
                return JSON.parse(data);
            })
        } else {
            let data = JSON.stringify({ status: 501 });
            return JSON.parse(data);
        }

    } catch (err) {
        console.log('ERRORS ===>', err);
        let data = JSON.stringify({ status: 501 });
        return JSON.parse(data);
    }
}

exports.terminal = async(url) => {
    try {
        const start_date = moment().format('DD/MM/YYYY');
        const end_date = moment().format('DD/MM/YYYY');
        // console.log('Start & end dates => ', start_date, end_date);
        const deviceurl = `${url}start_date=${'01/01/2021'}&end_date=${end_date}`;
        const basicAuth = 'Basic ' + process.env.TERMINAL;
        axios.defaults.headers.common['Authorization'] = basicAuth;
        return await axios.get(deviceurl).then(
            function(response) {
                if (response) {
                    if (response.status == 200) {
                        // console.log('Passed 1 => ');
                        if (response.data.data.length) {
                            const endpointStatus = response.data.data;
                            // console.log('End => ', endpointStatus);
                            // console.log('Passed 2 => ', response.data.data[+response.data.data.length - 1].terminal_number);

                            let data = JSON.stringify({ status: 200, terminal_number: response.data.data[+response.data.data.length - 1].terminal_number });
                            // console.log('Passed 3 => ', data);

                            return JSON.parse(data);
                        }
                        // console.log('Passed 4 => ');

                        let data = JSON.stringify({ status: 201 });
                        return JSON.parse(data);
                    }
                }
            }).catch(function(error) {
            console.log(error);
            let data = JSON.stringify({ status: 500 });
            return JSON.parse(data);
        })
    } catch (err) {
        console.log('ERRORS ===>', err);
        let data = JSON.stringify({ status: 501 });
        return JSON.parse(data);
    }
    // }).catch(async function() {
    //     console.log('Internet NOT Available');
    //     let data = JSON.stringify({ status: 502 });
    //     return JSON.parse(data);
    // });
}

exports.processPunch = async(newData) => {
    const datesID = []
    let nextUpdate = [];
    const shiftse = this.shiftSE;
    const clockExpires = await SystemSettings.findOne({ where: { key: 'Manual Clocking', deleted: 0 } }).then(result => { if (result) { return result.value; } else { return 48; } });
    for (let i = 0; i < newData.length; i++) {
        // console.log('newData3  => ', i);
        let getclockmarked0 = false;
        if (!datesID.includes(`${newData[i].date} = ${newData[i].user_id}`)) {

            const terminal = await Terminal.findAll({ where: { terminal_number: newData[i].number, deleted: 0 } });
            const createdAt = moment(terminal.createdAt).format('YYYY-MM-DD')

            datesID.push(`${newData[i].date} = ${newData[i].user_id}`);
            const employeeLinked = await TerminalUser.findOne({
                where: {
                    terminal_user_id: newData[i].user_id,
                    employeeId: {
                        [Op.ne]: null
                    },
                    deleted: 0
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

            if (employeeLinked) {

                const getclock = await PunchData.findAll({
                    where: { punch_date: newData[i].date, user_id: employeeLinked.terminal_user_id, deleted: 0 },
                    order: [
                        ['timestamp', 'ASC']
                    ]
                });

                for (let i =0; i < getclock.length; i++) {
                    await PunchData.update({ employeeId: employeeLinked.employeeId, shiftId: employeeLinked.employee.shiftId, departmentId: employeeLinked.employee.departmentId, jobdescId: employeeLinked.employee.jobdescId, salarystructureId: employeeLinked.employee.salarystructureId, leaveTypeId: employeeLinked.employee.leaveTypeId, expire_after: clockExpires }, { where: { timestamp: getclock[0].timestamp } });
                }

                // console.log(`getclock => ${i}`, getclock.length);

                const shift = await Shift.findOne({ where: { id: employeeLinked.employee.shiftId, deleted: 0 } });

                // console.log('shift => ', shift.id);

                const getShiftSE = await shiftse(shift.id);
                // await fileHandler.writeClock(`\n getclock => ${i}, ${getclock.length} Date => ${newData[i].date} ID => ${newData[i].user_id} [0]: => ${getclock[0].marked} [last]: => ${getclock[getclock.length - 1].marked} shiftSE: => ${getShiftSE}`);
                if (getShiftSE.length == 2) {
                    const index = await getclock.length - 1
                    if (!getclock[0].marked) {
                        if (getclock[0].punch_time <= getShiftSE[0]) {
                            // came earl
                            let timeReported = (new Date(`${getclock[0].punch_date} ${getShiftSE[0]}`).getTime() - new Date(`${getclock[0].punch_date} ${getclock[0].punch_time}`).getTime()) / 1000;
                            timeReported /= 60;

                            await PunchData.update({ clock_type: 'CI', late: timeReported, marked: true, employeeId: employeeLinked.employeeId, shiftId: employeeLinked.employee.shiftId, departmentId: employeeLinked.employee.departmentId, jobdescId: employeeLinked.employee.jobdescId, salarystructureId: employeeLinked.employee.salarystructureId, leaveTypeId: employeeLinked.employee.leaveTypeId, expire_after: clockExpires }, { where: { timestamp: getclock[0].timestamp } })

                            if (getclock.length == 1) {
                                getclockmarked0 = true;
                            }
                        }
                        if (getclock[0].punch_time > getShiftSE[0] && getclock[0].punch_time < getShiftSE[1]) {
                            // came late
                            let timeReported = (new Date(`${getclock[0].punch_date} ${getShiftSE[0]}`).getTime() - new Date(`${getclock[0].punch_date} ${getclock[0].punch_time}`).getTime()) / 1000;
                            timeReported /= 60;

                            await PunchData.update({ clock_type: 'CI', late: (timeReported), marked: true, employeeId: employeeLinked.employeeId, shiftId: employeeLinked.employee.shiftId, departmentId: employeeLinked.employee.departmentId, jobdescId: employeeLinked.employee.jobdescId, salarystructureId: employeeLinked.employee.salarystructureId, leaveTypeId: employeeLinked.employee.leaveTypeId, expire_after: clockExpires }, { where: { timestamp: getclock[0].timestamp } });

                            if (getclock.length == 1) {
                                getclockmarked0 = true;
                            }
                        }
                    }
                    if (!getclock[index].marked) {
                        // if (getclock[0].timestamp !== getclock[index].timestamp) {
                        if (getclock[index].punch_time >= getShiftSE[1]) {
                            // close on time or over time
                            let overTimeorCB4T = 0;
                            if (shift.allow_over_time) {
                                overTimeorCB4T = (new Date(`${getclock[index].punch_date} ${getclock[index].punch_time}`).getTime() - new Date(`${getclock[index].punch_date} ${getShiftSE[1]}`).getTime()) / 1000;
                                overTimeorCB4T /= 60;
                                overTimeorCB4T = Math.floor(overTimeorCB4T / 60);
                            }

                            await PunchData.update({ clock_type: 'CO', over_time: overTimeorCB4T, marked: true, employeeId: employeeLinked.employeeId, shiftId: employeeLinked.employee.shiftId, departmentId: employeeLinked.employee.departmentId, jobdescId: employeeLinked.employee.jobdescId, salarystructureId: employeeLinked.employee.salarystructureId, leaveTypeId: employeeLinked.employee.leaveTypeId, expire_after: clockExpires }, { where: { timestamp: getclock[index].timestamp } })
                        }
                        if (getclock[index].punch_time < getShiftSE[1]) {
                            // close earl time
                            if (!getclockmarked0) {
                                if (new Date(getclock[index].punch_date) < new Date(moment().format('YYYY-MM-DD'))) {
                                    let left_earl = 0;
                                    left_earl = (new Date(`${getclock[index].punch_date} ${getShiftSE[1]}`).getTime() - new Date(`${getclock[index].punch_date} ${getclock[index].punch_time}`).getTime()) / 1000;

                                    left_earl /= 60;

                                    await PunchData.update({ clock_type: 'CO', left_earl: (left_earl * -1), marked: true, employeeId: employeeLinked.employeeId, shiftId: employeeLinked.employee.shiftId, departmentId: employeeLinked.employee.departmentId, jobdescId: employeeLinked.employee.jobdescId, salarystructureId: employeeLinked.employee.salarystructureId, leaveTypeId: employeeLinked.employee.leaveTypeId, expire_after: clockExpires }, { where: { timestamp: getclock[index].timestamp } })
                                } else {
                                    nextUpdate.push(true);
                                }
                            }
                        }
                        // }
                    }
                }
                if (nextUpdate.includes(true)) {
                    await Terminal.update({ last_update: createdAt }, { where: { terminal_number: newData[i].number } })
                } else {
                    await Terminal.update({ last_update: moment().format('YYYY-MM-DD') }, { where: { terminal_number: newData[i].number } })
                }

            } else {
                await Terminal.update({ last_update: createdAt }, { where: { terminal_number: newData[i].number } })
            }
        }
    }
}

exports.pullData = async(req) => {
    const hasInternet = await this.pingForInternet(req)
    try {
        if (hasInternet) {
            // console.log('Pull push data from terminal');
            const terminals = await Terminal.findAll({ where: { deleted: 0 } });
            for (let i = 0; i < terminals.length; i++) {
                let dateArray = [];
                const processPunch = this.processPunch;
                const punData = await PunchData.findOne({ where: { terminal_number: terminals[i].terminal_number, deleted: 0 } });
                let start_date = (terminals[i].last_update) ? moment(terminals[i].last_update).format('DD/MM/YYYY') : moment(terminals[i].createdAt).format('DD/MM/YYYY');
                start_date = (!punData) ? moment(terminals[i].createdAt).format('DD/MM/YYYY') : start_date;
                const end_date = moment().format('DD/MM/YYYY');
                const deviceurl = `${terminals[i].terminal_api}start_date=${start_date}&end_date=${end_date}`;
                const basicAuth = 'Basic ' + process.env.TERMINAL;
                axios.defaults.headers.common['Authorization'] = basicAuth;
                return await axios.get(deviceurl).then(async function(response) {
                    if (response) {
                        if (response.status == 200) {
                            if (response.data.data.length) {
                                let data = JSON.stringify({ status: 200 });
                                const endpointStatus = response.data.data;
                                const newData = [];
                                for (let i = 0; i < endpointStatus.length; i++) {
                                    // console.log('Index => ', i);
                                    const isData = await PunchData.findOne({ where: { timestamp: endpointStatus[i].timestamp } });

                                    const terminal = await Terminal.findOne({ where: { terminal_number: endpointStatus[i].terminal_number } });

                                    const isUser = await TerminalUser.findOne({ where: { terminal_user_id: endpointStatus[i].user_id } });

                                    if (!isData) {
                                        const punchData = await new PunchData({
                                            punch_date: endpointStatus[i].punch_date,
                                            punch_time: endpointStatus[i].punch_time,
                                            terminal_number: endpointStatus[i].terminal_number,
                                            user_id: endpointStatus[i].user_id,
                                            timestamp: endpointStatus[i].timestamp,
                                            userId: req.user.id || req.session.user.id
                                        });
                                        await punchData.save();

                                        newData.push({ timestamp: endpointStatus[i].timestamp, user_id: endpointStatus[i].user_id, date: endpointStatus[i].punch_date, number: endpointStatus[i].terminal_number })
                                    }
                                    if (!isUser) {
                                        const punchUser = await new TerminalUser({
                                            terminal_user_id: endpointStatus[i].user_id,
                                            terminalId: terminal.id,
                                            userId: req.user.id || req.session.user.id
                                        });
                                        await punchUser.save();
                                    }
                                }
                                processPunch(newData);
                                return JSON.parse(data);
                            }
                            let data = JSON.stringify({ status: 201 });
                            return JSON.parse(data);
                        }
                    }
                }).catch(function(error) {
                    let data = JSON.stringify({ status: 500 });
                    return JSON.parse(data);
                })
            }
        } else {
            let data = JSON.stringify({ status: 502 });
            return JSON.parse(data);
        }
    } catch (err) {
        let data = JSON.stringify({ status: 501 });
        return JSON.parse(data);
    }
};

exports.getEmplyUnder = async(shiftId) => {
    const emplyData = [];
    const getEmplys = await Employee.findAndCountAll({ where: { shiftId: shiftId, deleted: 0 } });
    // console.log('getEmplys => ', getEmplys);
    if (getEmplys) {
        // console.log('getEmplys 2 => ', getEmplys);
        for (let i = 0; i < getEmplys.count; i++) {
            const dept = await Department.findOne({ where: { id: getEmplys.rows[i].departmentId } });
            let data = await { id: getEmplys.rows[i].id, name: `${getEmplys.rows[i].title} ${getEmplys.rows[i].fName} ${this.getFulName(getEmplys.rows[i].mName, getEmplys.rows[i].lName)} => `, dept: dept.deptName, count: getEmplys.count, shift_code: getEmplys.rows[i].shiftCode };

            emplyData.push(data);
        }
    }
    // await JSON.stringify(emplyData);

    return emplyData;
};

exports.getDigits = (dig) => {
    if (dig.toString().length == 1) {
        return `0${dig}`;
    }
    return dig;
}

exports.datearray = async(fromDate, toDate) => {
    let fromDate1 = moment(fromDate).format('YYYY-MM-DD');
    let toDate1 = moment(toDate).format('YYYY-MM-DD');

    const from = moment(fromDate, 'YYYY-MM-DD');
    const to = moment(toDate, 'YYYY-MM-DD');
    const days = Math.floor(-1 * moment.duration(from.diff(to)).asDays() + 1);

    Date.prototype.addDays = function(days) {
        let dat = new Date(this.valueOf())
        dat.setDate(dat.getDate() + days);
        // console.log('Dat => ', dat);
        return dat;
    }


    function getDates(from, to) {
        let dateArray = new Array();
        let startDate = from;
        while (startDate <= to) {
            dateArray.push(startDate)
            startDate = startDate.addDays(1);
        }

        return dateArray;
    }

    // console.log('Days => ', days);
    return getDates(new Date(fromDate1), (new Date(fromDate1)).addDays(days - 1));
}

exports.getPath = async (req, filename) => {
    try {
        const images = req.files;
            let path = [];
            if (images[`${filename}`]) {
                if (+process.env.ENV) {const file = await images[`${filename}`][0];
                    return `path`;
                    }
                return images[filename][0].path;
            }
    } catch (err) {
        console.log('Error form getPath =>', err);
    }            
}

exports.getArrayPath = async (req, filename, no) => {
                const images = req.files;
                if (images[filename]) {
                    // console.log('Filename ==> ', images[filename], images[filename][no].path);
                    if (+process.env.ENV) {
                        const file = await images[filename][no];                        
                        return `path`;
                    }
                    
                    // images[fi][n].map(p => path.push({ path: p.path }));
                    return images[filename][no].path;
                }
                // else {
                // return null;
                // }
            }

exports.checkFiles = async(file) => {
    if (!(file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/gif' ||
            file.mimetype == 'image/jfif' ||
            file.mimetype == 'application/pdf')) {
        return 'type';
    }

    if (+file.size > 1000000) {
        return 'size';
    }

    return 'ok';
};

exports.checkImage = async(file) => {
    if (!(file.mimetype == 'image/png' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/gif' ||
            file.mimetype == 'image/jfif')) {
        return 'type';
    }

    if (+file.size > 1000000) {
        return 'size';
    }

    return 'ok';
};

exports.shiftSE = async(shiftId) => {
    try {
        const shift = await Shift.findOne({ where: { id: shiftId, deleted: 0 } });
        if (shift) {
            let hour = 0,
                minGrace = shift.start_minute + shift.grace_period,
                mins = minGrace

            if (minGrace < 60) {
                hour = 0;
                mins = minGrace;
            } else if (minGrace >= 60) {
                let getRem = minGrace - 60;
                if (getRem < 60) {
                    hour = 1;
                    mins = getRem;
                } else {
                    hour = 1;
                    mins = getRem;
                }
            }

            const shifStart = `${this.getDigits(shift.start_hour+hour)}:${this.getDigits(mins)}:00`;

            const shifEnds = `${this.getDigits(shift.end_hour)}:${this.getDigits(shift.end_minute)}:00`

            return [shifStart, shifEnds]
        }

        return [];

    } catch (err) {
        console.log('Error from shiftSE function =>', err);
        return [];
    }
}

exports.generatePDF = async(res, file, data = []) => {
    const company = await Company.findOne({ where: { deleted: 0 } });
    const html = fs.readFileSync(path.join(__dirname, `../views/report-html/${file}.html`), 'utf-8');
    const filename = Math.random() + '_doc' + '.pdf';
    const document = {
        html: html,
        data: {
            head: data[1],
            data: data[0],
            company: { name: company.name, address: company.address, city: company.city, phone: company.phone, email: company.email, }
        },
        path: './docs/' + filename
    }
    await pdf.create(document, options)
        .then(res => {
            // console.log(res);
        }).catch(error => {
            // console.log(error);
        });
    // const filepath = await 'http://192.168.100.5:3001/docs/' + filename;
    const filePathName = await path.join(path.dirname(process.mainModule.filename), 'docs', `${filename}`);
    const data1 = await fs.readFileSync(filePathName);
    // res.contentType("application/pdf");
    // fileHandler.deleteFile(filePathName);
    // res.open(data1, '_blank');
    // console.log('Data1 =>', data1.toString('base64'));
    return [`/docs/${filename}`, filePathName];
}

exports.getStaffBirthdays = async(role, id) => {
    const birthdayData = [];
    const thisYear = await new Date().getFullYear();
    const employees = (role === 'Admin')? await Employee.findAll({ where: { deleted: 0 } }): await Employee.findAll({ where: { id: id, deleted: 0 } });
    if (employees) {
        for (let i = 0; i < employees.length; i++) {
            let data = await {date:moment(employees[i].dob).format('DD-MM')+'-'+thisYear, evtdate: thisYear + '-' + moment(employees[i].dob).format('MM-DD'), event: `${employees[i].title} ${employees[i].fName}'s birthday` };
            birthdayData.push(data);
        }
    }

    return birthdayData;
};

exports.MonthsToNow = async(startDate, endDate) => {
    let startYear = new Date(startDate).getFullYear();
    let endYear = new Date(endDate).getFullYear();

    let startMonth = new Date(startDate).getMonth() + 1;
    let endMonth = new Date(endDate).getMonth() + 1;

    let monthAmount = (endMonth - startMonth) + 1 + (12 * (endYear - startYear));

    let dates = [];
    let currMonth = startMonth;
    let currYear = startYear;
    for (let i = 0; i < monthAmount; i++) {
        let date = new Date(currYear + "/" + currMonth + "/1");
        dates.push(date);
        currYear = startYear + Math.floor((startMonth + i) / 12);
        currMonth = (currMonth) % 12 + 1;
    }
    return dates;
};

exports.getMonthWorkingDays = async(date, date2 = null) => {
    const monthStart = moment(date).startOf('month').format('YYYY-MM-DD');
    const monthEnd = (date2 == null) ? moment(date).endOf('month').format('YYYY-MM-DD') : date2;

    // const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getUTCDay()];
    const dateArray = await this.datearray(monthStart, monthEnd);
    let workingDays = 0;
    for (let i = 0; i < dateArray.length; i++) {
        let date = moment(dateArray[i]).format('YYYY-MM-DD');
        let day = new Date(date).getUTCDay();
        if ((day !== 0 & day !== 6) && !(await this.isHoliday(date))) {
            workingDays += 1;
            // console.log('getMonth => ', day, date, (await this.isHoliday('2021-01-01')));
        }

    }
    // console.log('getMonth => ', date, date2, monthEnd);
    return workingDays;
}

exports.getShiftWorkingDays = async(id) => {
    // const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getUTCDay()];
    const getShift = await Shift.findOne({ where: { id: id, deleted: 0 } }).then(result => { if (result) { return result.days } });
    if (getShift) {
        const spli = getShift.split("\[")[1].split("\]")[0].split('\","');
        const shiftDays = [];
        for (let i = 0; i < spli.length; i++) {
            const len = spli.length;
            if (len == 1) {
                shiftDays.push(spli[i].split("\"")[1]);
            } else {
                if (i == 0) {
                    shiftDays.push(spli[i].split('"')[1]);
                } else if ((i + 1) == len) {
                    shiftDays.push(spli[i].split('"')[0]);
                } else {
                    shiftDays.push(spli[i]);
                }
            }
        }
        return shiftDays;
    }
    return [];
};

exports.punchTimeExpire = async(date_value) => {
    const today = Math.floor(new Date() / 1000);
    const date = Math.floor(new Date(date_value) / 1000);
    const diff = today - date;
    return SystemSettings.findOne({ where: { key: 'Manual Clocking', deleted: 0 } }).then(result => {
        if (result) {
            const getPeriod = +result.value * 3600;
            // console.log('Data => ', getPeriod, diff);
            return (diff > getPeriod) ? true : false;
        }
        const defaultTo = 48 * 3600;
        return (diff > defaultTo) ? true : false;
    });
};

exports.isHoliday = async(date) => {
    return HolidayEvents.findOne({ where: { date: date, deleted: 0 } }).then(result => {
        if (result) {
            return true
        }
        return false
    });
};

exports.getEmpMarkedAttendByDept = async(date, deptId) => {
    if (deptId) {
        return await PunchData.findAll({
            where: {
                punch_date: date,
                clock_type: {
                    [Op.or]: ['CI', 'CO']
                },
                departmentId: deptId
            },
            order: [
                ['timestamp', 'ASC']
            ],
        });
    }
    return a
}

exports.getEmpMarkedAttend = async(date, id) => {
    if (!id) {
        return await PunchData.findAll({
            where: {
                punch_date: date,
                clock_type: {
                    [Op.or]: ['CI', 'CO']
                }
            },
            order: [
                ['timestamp', 'ASC']
            ],
        });
    }
    return await PunchData.findAll({
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
    });
}

exports.offDuty = async(date, empid, id) => {
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getUTCDay()];
    const getShift = await Shift.findOne({ where: { id: id, deleted: 0 } }).then(result => { if (result) { return result.days } });
    if (getShift) {
        const spli = getShift.split("\[")[1].split("\]")[0].split('\","');
        const shiftDays = [];
        for (let i = 0; i < spli.length; i++) {
            const len = spli.length;
            if (len == 1) {
                shiftDays.push(spli[i].split("\"")[1]);
            } else {
                if (i == 0) {
                    shiftDays.push(spli[i].split('"')[1]);
                } else if ((i + 1) == len) {
                    shiftDays.push(spli[i].split('"')[0]);
                } else {
                    shiftDays.push(spli[i]);
                }
            }
        }
        const wasPunch = await this.getEmpMarkedAttend(date, empid);
        // console.log('wasPunch1 => ', wasPunch);
        if (!shiftDays.includes(day) && wasPunch.length) {
            return `${this.getFullName(empid)} is off duty but have clocked today @ ${wasPunch[0].punch_time}`;
        }
        // return '';
    }
    // return [];
};

exports.onLeave = async (date, id) => {
    // console.log('wasPunch2 => ', id);
    const onlev = await Leaves.findOne({ where: { employeeId: id, status: 'Approved', from: { [Op.lte]: date }, to: { [Op.gte]: date } } });
    const wasPunch = await this.getEmpMarkedAttend(date, id);
    // console.log('wasPunch2 => ', wasPunch);
    if (onlev && wasPunch.length) {
            return `${ await this.getFullName(id)}is on leave but have clocked today @ ${wasPunch[0].punch_time}`;
    }
};


exports.getFullName = async(id) => {
    return await Employee.findOne({ where: { id: id, deleted: 0 } }).then(results => {
        if (results) {
            return `${results.title} ${results.fName} ${this.getFulName(results.mName, results.lName)}`;
        }
        results `N/A`;
    })
}

exports.genderNAgeAnalysis = async(req) => {
    let employDetails = '';
    let m = 0,
        f = 0,
        _age = 0;

    if (req.user.role == 'Admin') {
        employDetails = await Employee.findAndCountAll({ where: { deleted: 0 } }).then(result => { if (result) { return result.rows } return [] });
    }

    if (req.user.role == 'HOD') {
        employDetails = await Department.findAndCountAll({
            where: { headByEmployeeId: req.user.currentUserEmployeeId, deleted: 0 },
            include: [{
                model: Employee,
                where: {
                    deleted: 0,
                },
                require: false,
            }]
        }).then(result => { if (result) { return result.rows[0].employees } return [] });
        // employDetails = employDetails.rows[0].employees
    }

    let nowToday = moment(new Date()).format('YYYY-MM-DD 00:00:00');
    nowToday = Math.floor(new Date(nowToday) / 1000);
    const newStaff = [];
    const count = (await employDetails).length;

    for (let i = 0; i < count; i++) {

        _age += await this.getAge(employDetails[i].dob);

        if (employDetails[i].gender === "Male") {
            m += 1;
        } else {
            f += 1;
        }
        const dateEmply = Math.floor(employDetails[i].dateEmplyed / 1000);
        const dateDff = nowToday - dateEmply;

        if (dateDff <= 7948800) {
            const jobTitle = await JobDesc.findOne({ where: { id: employDetails[i].jobdescId } });

            newStaff.push(`${employDetails[i].title} ${employDetails[i].fName} ${this.getFulName(employDetails[i].mName, employDetails[i].lName)} - ${jobTitle.jobTitle}`);
        }
    }

    return [count, m, f, Math.floor((_age / count)), newStaff];
};

exports.getEmpInDept = async(req, headId) => {
    const deptID = await Employee.findOne({ where: { id: req.user.currentUserEmployeeId, deleted: 0 } }).then(result => { if (result) { return result.departmentId } return null });
    return await Employee.findAll({
        where: {
            // dateEmplyed: {
            //     [Op.lte]: today
            // },
            departmentId: (!headId) ? deptID : headId,
            deleted: 0
        }
    });
};

exports.getTodayEvent = async (dat) => {
    const date = moment(dat).format('YYYY-MM-DD');
    const isHoliday = await this.isHoliday(date);
    const holi = await HolidayEvents.findOne({ where: { date: date, deleted: 0 } });
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getUTCDay()];
    const isWeekend = (new Date(date).getUTCDay() == 0 || new Date(date).getUTCDay() == 6)? true:false;
    let isOnDuty = false;
    const getShift = await Shift.findAll({ where: {deleted: 0 } });
    if (getShift) {
        for(let i=0; i<getShift.length; i++){
            const spli = getShift[i].days.split("\[")[1].split("\]")[0].split('\","');
            const shiftDays = [];
            for (let i = 0; i < spli.length; i++) {
            const len = spli.length;
            if (len == 1) {
                shiftDays.push(spli[i].split("\"")[1]);
            } else {
                if (i == 0) {
                    shiftDays.push(spli[i].split('"')[1]);
                } else if ((i + 1) == len) {
                    shiftDays.push(spli[i].split('"')[0]);
                } else {
                    shiftDays.push(spli[i]);
                }
            }
            if(shiftDays.includes(day)){
                isOnDuty = true;
            }
        }
    }
}
// console.log('holi.eventName =>', await holi);
if(isHoliday && isWeekend){
    return holi.eventName
}
if(isWeekend){
    return 'Weekends'
}
    if (isHoliday) {
    // console.log('Holiday => ', holi.eventName);
    return holi.eventName
}
}

exports.getLeaveProcess = async (date, status) => {
    const data = [];
    let leaveStatus = await LeavesProcess.findAll({ where: { status: status, createdAt: { [Op.between]: [moment(date).format('YYYY-MM-DD 00:00:00'), moment(date).format('YYYY-MM-DD 23:59:59')] }, deleted: 0 } });
    console.log('getLeave => ', status, date, leaveStatus.length);

    for (let i = 0; i < leaveStatus.length; i++){
        data.push({ leaveId: leaveStatus[i].leaveId, status: leaveStatus[i].status });
    }
    
    // if (!leaveStatus.length) {
        console.log('getLeave2 => ', status, date, leaveStatus.length);
       let leaveStatusBT = await Leaves.findAll({ where: { status: status, from: { [Op.lte]: moment(date).format('YYYY-MM-DD 00:00:00') }, to: { [Op.gte]: moment(date).format('YYYY-MM-DD 23:59:59') }, deleted: 0 } });
    // }
    for (let i = 0; i < leaveStatusBT.length; i++){
        data.push({ leaveId: leaveStatusBT[i].id, status: leaveStatusBT[i].status });
    }
    console.log('getLeave3 => ', status, date, leaveStatusBT.length);
    return data;
}

exports.getLeave = async (id) => {
    console.log('getLeave => get ', id);
    let leave = await Leaves.findOne({
        where: { id: id, deleted: 0 },
                
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
    const dept = await Department.findOne({ where: { id: leave.employee.departmentId, deleted: 0 } });

    const approvEmpl = await Employee.findOne({ where: { id: leave.employId } }); //, departmentId: hodid.id

    const jobDesc = await JobDesc.findOne({ where: { id: leave.employee.jobdescId } });

    let status = leave.status;
    if (new Date() >= leave.from && new Date() <= leave.to && leave.status == 'Approved') {
        // console.log('getLeave => ', 'On leave', date);
        status = 'On leave';
    }
    if (new Date() >= leave.to && leave.status == 'Approved') {
        // console.log('getLeave => ', 'Resumed', date);
        status = 'Resumed';
    }

    let data = { id: leave.id, date: moment(leave.createdAt).format('DD-MM-YYYY'), name: `${leave.employee.title || ''} ${leave.employee.fName} ${this.getFulName(leave.employee.mName, leave.employee.lName)}`, dept: `${(dept) ? dept.deptName : 'N/A'}`, from: moment(leave.from).format('DD-MM-YYYY'), to: moment(leave.to).format('DD-MM-YYYY'), days: leave.days, leaveType: leave.leaveType.leaveType, status: status, reason: leave.reason, exp: leave.leaveType.nofdays, remark: leave.remarks, employeeId: leave.employeeId, approvEmpl: `${approvEmpl.title || ''} ${approvEmpl.fName} ${this.getFulName(approvEmpl.mName, approvEmpl.lName)}`, employId: approvEmpl.id, job: (jobDesc) ? jobDesc.jobTitle : 'N/A' };
    
    return data;
};

// Not usable
exports.sortObjByString = async (ary, props) => {
    //https://www.w3schools.com/js/js_array_sort.asp
    let prop = props;
        ary.sort(function (a, b) {
            let x = a.prop.toLowerCase()
            let y = b.prop.toLowerCase()
            if (x < y) {
                return -1
            }
            if (x > y) {
                return 1
            }
            return 0
        })
}

exports.runSchedule = async (req, state, job) => {
    const color = chalk.bgBlue.black;
    // const emails = await EmailMessage.findAll({where: {status:0}})
    const pulldata = cron.schedule('*/3 * * * *', async() => {
        console.log(color('Pull punch data every 3 minutes'));
        await this.pullData(req);
    },
    {
        scheduled: false
    }
    );

    const resendMails = cron.schedule('*/1 * * * *', async() => {
        console.log(color('Resend any email in que'));
        await resendEmails();
    },
    {
        scheduled: false
    }
    );
    if (state && job === 'pulldata') {
        await pulldata.start();
    }
    
    if (!state && job === 'pulldata') {
        // console.log(color('running a task stopped', req.session.user.id));
        await pulldata.stop();
    }

    if (state) {
        resendMails.start();
    }
}