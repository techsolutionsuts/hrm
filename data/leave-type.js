// const dateFormat = require('dateformat');
const moment = require('moment')

const date = moment().format('YYYY-MM-D HH:m:s');

module.exports = [{
        "leaveType": "Annual leave",
        "description": "A leave given an employee on annual basis.",
        "nofdays": 22,
        "carryon": true,
        "deleted": false,
        "createdAt": date,
        "updatedAt": date,
        "genderBased": "All"
    },
    {
        "leaveType": "Sick leave",
        "description": "Sick leave is time off given by the company to allow employees to recover from an illness and take care of their health.",
        "nofdays": 14,
        "carryon": false,
        "deleted": false,
        "createdAt": date,
        "updatedAt": date,
        "genderBased": "All"
    },
    {
        "leaveType": "Casual leave",
        "description": "Casual leave is taken by an employee for travel, vacation, rest, and family events. Such leaves are given to allow the employee to take time off for any life events they have like traveling to another country or weddings they have to attend.",
        "nofdays": 14,
        "carryon": false,
        "deleted": false,
        "createdAt": date,
        "updatedAt": date,
        "genderBased": "All"
    },
    {
        "leaveType": "Maternity leave",
        "description": "Maternity leave is given to new mothers for taking care of the newborn to recovering from the delivery and providing extra leave days in case of any postnatal complications. ",
        "nofdays": 90,
        "carryon": false,
        "deleted": false,
        "createdAt": date,
        "updatedAt": date,
        "genderBased": "Female"
    },
    {
        "leaveType": "Paternity leave",
        "description": "Paternity leave is granted to new fathers—  husbands or partners of a pregnant woman, surrogate parent, or someone who adopted a child— to take care of their newborns without any worry.",
        "nofdays": 14,
        "carryon": false,
        "deleted": false,
        "createdAt": date,
        "updatedAt": date,
        "genderBased": "Male"
    },
    {
        "leaveType": "Compassionate leave",
        "description": "Compassionate leave is given to an employee to take time off work due to something that is happened in their personal life.",
        "nofdays": 3,
        "carryon": false,
        "deleted": false,
        "createdAt": date,
        "updatedAt": date,
        "genderBased": "All"
    },
    {
        "leaveType": "Sabbatical leave",
        "description": "sabbatical leaves are “a break from work” where employees can pursue interests they have or take time off for physical and mental health reasons.",
        "nofdays": 180,
        "carryon": false,
        "deleted": false,
        "createdAt": date,
        "updatedAt": date,
        "genderBased": "All"
    },
    {
        "leaveType": "Unpaid leave",
        "description": "If employee has exceeded the number of leaves they were eligible for and are taking a leave that doesn’t fall under special leaves like maternity or bereavement leave, they can still take a leave with a pay cut",
        "nofdays": 14,
        "carryon": false,
        "deleted": false,
        "createdAt": date,
        "updatedAt": date,
        "genderBased": "All"
    }
]