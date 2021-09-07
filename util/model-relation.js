const Company = require('../models/company-model');
const User = require('../models/user-model');
const Department = require('../models/department-model');
const Employee = require('../models/employee-model');
const JobTitle = require('../models/jobTitle-model');
const JobDesc = require('../models/jobDesc-model');
const SalaryStructure = require('../models/salaryStructure-model');
const Address = require('../models/address-model');
const ReportTo = require('../models/reportTo-model');
const BankDetail = require('../models/bankDetails-model');
const Dependant = require('../models/dependant-model');
const EmployDataChange = require('../models/employeeDataChange-model');
const GroupUnderDept = require('../models/groupsUnDept-model');
const Spouse = require('../models/spouse-model');
const SSNITBenfit = require('../models/ssnitBenefit-model');

const EmergencyContact = require('../models/emergency-contact-model');
const NextOfKin = require('../models/next-of-kin-model');
const EducationBacground = require('../models/educationBackground-model');
const WorkExperience = require('../models/workExperiences-model');
const Allowance = require('../models/allowance-model');
const TaxStruct = require('../models/taxStructure-model');
const SSNITStruct = require('../models/ssnitStructure-model');
const LeaveType = require('../models/leavetype-model');
const Leaves = require('../models/leaves-model');
const AttendMarked = require('../models/attendmarked-model');
const Bank = require('../models/bank-model');
const Logs = require('../models/logs-model');
const HODsChanged = require('../models/hods-change-model');
const Terminal = require('../models/terminal-model');
const TerminalUser = require('../models/terminal_users-model');
const PunchData = require('../models/punchData-model');
const Shift = require('../models/shift-model');
const EmpShiftHistory = require('../models/emp-shift-history-model');
const HolidayEvents = require('../models/holidays-events-model');
const LinkedTermUserHitory = require('../models/linkedTermUserHitory-model');
const EmpDeptHistory = require('../models/emp-dept-history-model');
const EmpJobHistory = require('../models/emp-job-history-model');
const EmpSalaryHistory = require('../models/emp-salary-hitory-model');
const SettingsChangeHistory = require('../models/settings-change-history-model');
const SystemSettings = require('../models/system-settings-model');
const EmpSuperHistory = require('../models/emp-super-history-model');
const LeavesProcess = require('../models/leaves-process-model');
const Task = require('../models/task-model');
const TaskProgress = require('../models/task_progress-model');
const EmailMessage = require('../models/email_megs-model');


exports.modelRelations = () => {
    User.hasMany(User);
    User.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Employee);
    User.belongsTo(Employee, {
        as: 'CurrentUser', // as system user
        foreignKey: 'currentUserEmployeeId',
        constraints: false,
        oneDelete: 'CASCADE',
    });

    Department.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });
    User.hasMany(Department);

    Department.hasMany(Employee);
    Department.belongsTo(Employee, {
        as: 'HeadByEmployee', // as head Of Department
        foreignKey: 'headByEmployeeId',
        constraints: false,
        oneDelete: 'CASCADE',
    });

    // User.hasMany(JobTitle);
    // JobTitle.belongsTo(User, {
    //   constraints: true,
    //   oneDelete: 'CASCADE',
    // });

    // JobTitle.hasMany(Employee);
    // Employee.belongsTo(JobTitle, {
    //   constraints: true,
    //   oneDelete: 'CASCADE',
    // });

    JobDesc.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });
    User.hasMany(JobDesc);


    JobDesc.hasMany(Employee);
    Employee.belongsTo(JobDesc, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(ReportTo);
    Employee.belongsTo(ReportTo, {
        as: 'ReportTo', // as head Of Department
        foreignKey: ['reportToEmployeeId', 'directRepToEmployeeId'],
        constraints: false,
        oneDelete: 'CASCADE',
    });

    User.hasMany(SalaryStructure);
    SalaryStructure.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    SalaryStructure.hasMany(Employee);
    Employee.belongsTo(SalaryStructure, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Address);
    Address.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(Address);
    Address.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(BankDetail);
    BankDetail.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(BankDetail);
    BankDetail.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Dependant);
    Dependant.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(Dependant);
    Dependant.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EmployDataChange);
    EmployDataChange.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(EmployDataChange);
    EmployDataChange.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(GroupUnderDept);
    GroupUnderDept.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Department.hasMany(GroupUnderDept);
    GroupUnderDept.belongsTo(Department, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    GroupUnderDept.hasMany(Employee);
    Employee.belongsTo(GroupUnderDept, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Spouse);
    Spouse.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(Spouse);
    Spouse.belongsTo(Employee, {
        constraints: false,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EmergencyContact);
    EmergencyContact.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(EmergencyContact);
    EmergencyContact.belongsTo(Employee, {
        constraints: false,
        oneDelete: 'CASCADE',
    });

    User.hasMany(NextOfKin);
    NextOfKin.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasOne(NextOfKin);
    NextOfKin.belongsTo(Employee, {
        constraints: false,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EducationBacground);
    EducationBacground.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(EducationBacground);
    EducationBacground.belongsTo(Employee, {
        constraints: false,
        oneDelete: 'CASCADE',
    });

    User.hasMany(WorkExperience);
    WorkExperience.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(WorkExperience);
    WorkExperience.belongsTo(Employee, {
        constraints: false,
        oneDelete: 'CASCADE',
    });

    User.hasMany(SSNITBenfit);
    SSNITBenfit.belongsTo(User, {
        constraints: false,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(SSNITBenfit);
    SSNITBenfit.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Allowance);
    Allowance.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    SalaryStructure.hasMany(Allowance);
    Allowance.belongsTo(SalaryStructure, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(TaxStruct);
    TaxStruct.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(SSNITStruct);
    SSNITStruct.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    JobDesc.hasMany(SalaryStructure);
    SalaryStructure.belongsTo(JobDesc, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(LeaveType);
    LeaveType.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Leaves);
    Leaves.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    LeaveType.hasMany(Leaves);
    Leaves.belongsTo(LeaveType, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(Leaves);
    Leaves.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });


    LeaveType.hasMany(Employee);
    Employee.belongsTo(LeaveType, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(AttendMarked);
    AttendMarked.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(AttendMarked);
    AttendMarked.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    // Leaves.hasMany(AttendMarked);
    // AttendMarked.belongsTo(Leaves, {
    //     constraints: true,
    //     oneDelete: 'CASCADE',
    //     default: null
    // });

    User.hasMany(Bank);
    Bank.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Logs);
    Logs.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(HODsChanged);
    HODsChanged.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Department.hasMany(HODsChanged);
    HODsChanged.belongsTo(Department, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(HODsChanged);
    HODsChanged.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Terminal);
    Terminal.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(TerminalUser);
    TerminalUser.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Terminal.hasMany(TerminalUser);
    TerminalUser.belongsTo(Terminal, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(TerminalUser);
    TerminalUser.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(PunchData);
    PunchData.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(PunchData);
    PunchData.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Shift.hasMany(PunchData);
    PunchData.belongsTo(Shift, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Department.hasMany(PunchData);
    PunchData.belongsTo(Department, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    JobDesc.hasMany(PunchData);
    PunchData.belongsTo(JobDesc, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    SalaryStructure.hasMany(PunchData);
    PunchData.belongsTo(SalaryStructure, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    LeaveType.hasMany(PunchData);
    PunchData.belongsTo(LeaveType, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Shift);
    Shift.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Shift.hasMany(Employee);
    Employee.belongsTo(Shift, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Shift.hasMany(EmpShiftHistory);
    EmpShiftHistory.belongsTo(Shift, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(EmpShiftHistory);
    EmpShiftHistory.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EmpShiftHistory);
    EmpShiftHistory.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(HolidayEvents);
    HolidayEvents.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(LinkedTermUserHitory);
    LinkedTermUserHitory.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    TerminalUser.hasMany(LinkedTermUserHitory);
    LinkedTermUserHitory.belongsTo(TerminalUser, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(LinkedTermUserHitory);
    LinkedTermUserHitory.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });
    // Employee dept history
    Department.hasMany(EmpDeptHistory);
    EmpDeptHistory.belongsTo(Department, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(EmpDeptHistory);
    EmpDeptHistory.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EmpDeptHistory);
    EmpDeptHistory.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    // Employee job dec history
    JobDesc.hasMany(EmpJobHistory);
    EmpJobHistory.belongsTo(JobDesc, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(EmpJobHistory);
    EmpJobHistory.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EmpJobHistory);
    EmpJobHistory.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    // Employee salary history
    SalaryStructure.hasMany(EmpSalaryHistory);
    EmpSalaryHistory.belongsTo(SalaryStructure, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(EmpSalaryHistory);
    EmpSalaryHistory.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EmpSalaryHistory);
    EmpSalaryHistory.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    // employee super change history
    ReportTo.hasMany(EmpSuperHistory);
    EmpSuperHistory.belongsTo(ReportTo, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(EmpSuperHistory);
    EmpSuperHistory.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EmpSuperHistory);
    EmpSuperHistory.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    // System settings changes by system users
    User.hasMany(SystemSettings);
    SystemSettings.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(SettingsChangeHistory);
    SettingsChangeHistory.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    SystemSettings.hasMany(SettingsChangeHistory);
    SettingsChangeHistory.belongsTo(SystemSettings, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(LeavesProcess);
    LeavesProcess.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Leaves.hasMany(LeavesProcess);
    LeavesProcess.belongsTo(Leaves, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(Task);
    Task.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Task.hasMany(TaskProgress);
    TaskProgress.belongsTo(Task, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    Employee.hasMany(Task);
    Task.belongsTo(Employee, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(TaskProgress);
    TaskProgress.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

    User.hasMany(EmailMessage);
    EmailMessage.belongsTo(User, {
        constraints: true,
        oneDelete: 'CASCADE',
    });

};

// ============================= //
//     Product.belongsTo(User, {
//         constraints: true,
//         oneDelete: 'CASCADE',
//     });

//     User.hasMany(Product);

//     User.hasOne(Cart);
//     Cart.belongsTo(User);

//     Cart.belongsToMany(Product, {
//         through: CartItem,
//     });
//     Product.belongsToMany(Cart, {
//         through: CartItem,
//     });

//     Order.belongsTo(User);
//     User.hasMany(Order);
//     Order.belongsToMany(Product, {
//         through: OrderItem,
//     });
// }