const TaxStruct = require('../models/taxStructure-model');
const SSNITStruct = require('../models/ssnitStructure-model');
const Bank = require('../models/bank-model');
const bankData = require('./banks.js');
const leaveTypeData = require('./leave-type.js');
const LeaveType = require('../models/leavetype-model');
const SystemSettings = require('../models/system-settings-model');

exports.pushData = async(id)=>{
try {
  TaxStruct.create({
    first: '319_0',
    nextOne: '100_5',
    nextTwo: '120_10',
    nextThree: '3000_17.5',
    nextFour: '16461_25',
    exceeding: '20000_30',
    userId: id,
  });

  SSNITStruct.create({
    teirOne: 13,
    teirTwo: 5.5,
    userId: id,
  });

  for (let i = 0; i < bankData.length; i++) {
    Bank.create({
        bankName: bankData[i].bankName,
        userId: id,
    });
  }
for (let i = 0; i < leaveTypeData.length; i++) {
    LeaveType.create({
        leaveType: leaveTypeData[i].leaveType,
        description: leaveTypeData[i].description,
        nofdays: leaveTypeData[i].nofdays,
        carryon: leaveTypeData[i].carryon,
        deleted: leaveTypeData[i].deleted,
        genderBased: leaveTypeData[i].genderBased,
        userId: id,
    });
  }

  SystemSettings.create({
      key: 'Manual Clocking',
      value: '48',
      userId: id,
  });

} catch (error) {
  console.log('Error => ', error);
}
}

