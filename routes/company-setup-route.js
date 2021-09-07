const express = require('express');
const {
    check,
    body
} = require('express-validator/check');

const companySetupController = require('../controllers/company-setup-controller');

const User = require('../models/user-model');
const isCompany = require('../mitm/is-company-setup');
const _0aux17c983 = require('../mitm/is-auth');
const Company = require('../models/company-model');
const su_0x17c983 = require('../mitm/is-sudo');
const genFunc = require('../general-func/general-func');
const Terminal = require('../models/terminal-model');
const TerminalUser = require('../models/terminal_users-model');
const Employee = require('../models/employee-model');

const router = express.Router();

router.post('/create-company', [
    body('date', 'Please enter a valid date').not().isEmpty().withMessage('Date must not be empty').isDate().withMessage('Please provide a valid date.').custom((value, {
        req
    }) => {
        let date = new Date(value)
        if (date > Date.now()) {
            throw new Error('Sorry date must not be after today\'s date.');
        }
        return true;
    }),

    body('company_name').not().isEmpty().withMessage('Company name cannot be empty').isLength({
        min: 5
    }).withMessage('Company name must be more than five letters').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('Company name must be letters only ');
        }
        return true;
    }).custom((value, {
        req
    }) => {
        return Company.findOne({
            where: {
                name: value,
                deleted: 0
            }
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Sorry company name already exist.');
            }
            return true;
        });
    }),

    body('tin').not().isEmpty().withMessage('TIN cannot be empty').isLength({
        min: 5,
        max: 12
    }).withMessage('TIN must not be more than 12 digits and less than 5 digits').custom((value, {
        req
    }) => {

        return Company.findOne({
            where: {
                tin: value,
                deleted: 0
            }
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Sorry TIN number already exist.');
            }
            return true;
        });
    }),

    body('reg_number').not().isEmpty().withMessage('Registration number cannot be empty').isLength({
        min: 5
    }).withMessage('Must not be less than 5 digits').custom((value, {
        req
    }) => {
        return Company.findOne({
            where: {
                regNum: value,
                deleted: 0
            }
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Sorry company reg. number already exist.');
            }
            return true;
        });
    }),

    body('company_type').not().isEmpty().withMessage('Please select company type.').isLength({
        min: 5
    }).withMessage('Must not be less than 5 digits'),

    body('direct').not().isEmpty().withMessage('Must not be empty').isLength({
        min: 5
    }).withMessage('Must not be less than 5 digits').custom((value, {
        req
    }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('Director name must be letters only ');
        }
        return true
    }),

    body('contact').not().isEmpty().withMessage('Must not be empty').isMobilePhone().isLength({
        min: 5
    }).withMessage('Phone number length must be 10').custom((value, {
        req
    }) => {
        if (!(/^[0-9]+$/.test(value))) {
            return Promise.reject('Phone number must be numbers only.');
        }
        return true;
    }).custom((value, {
        req
    }) => {
        return Company.findOne({
            where: {
                phone: value,
                deleted: 0
            }
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Sorry phone number already exist.');
            }
            return true;
        });

    }),

    body('email').isEmail().withMessage('Please provide a valid email').custom((value, {
        req
    }) => {
        return Company.findOne({
            where: {
                email: value,
                deleted: 0
            }
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Sorry company email already exist.');
            }
            return true;
        });
    }),

    body('website').custom((value, {
        req
    }) => {
        return Company.findOne({
            where: {
                website: value,
                deleted: 0
            }
        }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('Sorry company website already exist.');
            }
            return true;
        });
    }),

    body('region').not().isEmpty().withMessage('Must not be empty.').isLength({
        min: 5
    }).withMessage('Must not be less than 5 digits'),

    body('city').not().isEmpty().withMessage('Must not be empty').isLength({
        min: 5
    }).withMessage('Must not be less than 5 digits'),

    body('dac').not().isEmpty().withMessage('Must not be empty').isLength({
        min: 5
    }).withMessage('Must not be less than 5 digits'),

    body('address').not().isEmpty().withMessage('Must not be empty').isString().withMessage('Please provide a valid data').isLength({
        min: 5
    }).withMessage('Must not be less than 5 digits'),
    body('staff_id').not().isEmpty().withMessage('Must not be empty'),
    body('company_ini').not().isEmpty().withMessage('Must not be empty').isLength({
        max: 3
    }).withMessage('Must not be more than 3 digits').custom((value, {
        req
    }) => {
        if (!(/^[A-Z]+$/.test(value))) {
            return Promise.reject('Must be capital letters only');
        }
        return true;
    })

], companySetupController.postCompany);

router.post('/createUser', [
    body('fullname').not().isEmpty().withMessage('Fullname is required').custom((value, { req }) => {
        if (!(/^[a-zA-Z ]+$/.test(value))) {
            return Promise.reject('Fullname must be characters only');
        }
        return true;
    }),
    body('nuseremail').not().isEmpty().withMessage('Email is required').isEmail().withMessage('Email is required and must be a valid email').custom((value, { req }) => {
        return User.findOne({
            where: {
                email: value,
                deleted: 0
            }
        }).then(email => {
            if (email) {
                return Promise.reject('Sorry email already exist.');
            }
            return true;
        });
    }),

    body('nuserpassword').notEmpty().withMessage('Password is required').isLength({
        min: 8
    }).withMessage('Password length must be 8 characters or more'),

    body('ncuserpassword').notEmpty().withMessage('Confirm password is required').isLength({
        min: 8
    }).withMessage('Password length must be 8 characters or more').custom((value, { req }) => {
        if (value !== req.body.nuserpassword) {
            return Promise.reject('Password do not match');
        }
        return true;
    }),

    // body('licensecode').notEmpty().withMessage('Please ensure license code is present, or copy paste the license code here, if it is not showing').custom((value, { req }) => {
    //     return Company.findOne({
    //         where: {
    //             licensecode: value,
    //             deleted: 0
    //         }
    //     }).then(code => {
    //         if (code) {
    //             return Promise.reject('Sorry email already exist.');
    //         }
    //         return true;
    //     });
    // })
], companySetupController.createUser)

router.get('/company', _0aux17c983, companySetupController.getCompany);
router.get('/get-comp-profile', _0aux17c983, su_0x17c983, companySetupController.getCompProfile);
router.get('/company-setup', _0aux17c983, companySetupController.getCompanySetup);
router.get('/setup', companySetupController.setup);
router.get('/create-user', companySetupController.create_user);
router.get('/check-point', _0aux17c983, companySetupController.getCheckPoint);

router.get('/pdf', _0aux17c983, companySetupController.getPDF);

router.get('/call-api', companySetupController.call_api);

router.post('/add-terminal', [
        body('termAPI').notEmpty().withMessage('Sorry provide endpoint').custom((value, { req }) => {
            return Terminal.findOne({
                where: {
                    terminal_api: value,
                    deleted: 0
                }
            }).then(async terminal => {
                if (terminal) {
                    return Promise.reject('Sorry terminal endpoint already exist.');
                }

                const endpointStatus = await genFunc.terminal(value);
                if (endpointStatus.status == 502) {
                    return Promise.reject('Sorry you are not connected to the internet.');
                }

                if (endpointStatus.status == 501) {
                    return Promise.reject('Sorry something went wrong try again or call support team')
                }

                if (endpointStatus.status == 500) {
                    return Promise.reject('Sorry something went wrong check the endpoint input or call support team')
                }
                if (endpointStatus.status == 201) {
                    return Promise.reject('Please register a user on the device and punch again')
                }

                return true
            });
        }),
        body('termNumber').notEmpty().withMessage('Terminal number is required').custom((value, { req }) => {
            return Terminal.findOne({
                where: {
                    terminal_number: value,
                    deleted: 0
                }
            }).then(async terminal => {
                if (terminal) {
                    return Promise.reject('Sorry terminal number already exist.');
                }
                // console.log('termEndpoint => ', req.body.termAPI);
                const endpointStatus = await genFunc.terminal(req.body.termAPI);
                console.log('In => 1', endpointStatus);

                if (endpointStatus.status == 200) {
                    console.log('In => 2', endpointStatus);
                    if (endpointStatus.terminal_number !== value) {
                        console.log('In => 3', endpointStatus.terminal_number, value);
                        return Promise.reject('Sorry terminal number is wrong, please try again')
                    }
                }
                return true
            })
        }),

        body('termName').notEmpty().withMessage('Terminal number is required').custom((value, { req }) => {
            return Terminal.findOne({
                where: {
                    terminal_name: value,
                    deleted: 0
                }
            }).then(async terminal => {
                if (terminal) {
                    return Promise.reject('Sorry terminal name already exist.');
                }
                return true;
            })
        }),

        body('termSerial').notEmpty().withMessage('Terminal number is required').custom((value, { req }) => {
            return Terminal.findOne({
                where: {
                    terminal_serial_number: value,
                    deleted: 0
                }
            }).then(async terminal => {
                if (terminal) {
                    return Promise.reject('Sorry terminal serial number already exist.');
                }
                return true
            })
        }),

        body('termLocation').notEmpty().withMessage('Terminal number is required').custom((value, { req }) => {
            return Terminal.findOne({
                where: {
                    terminal_location: value,
                    deleted: 0
                }
            }).then(async terminal => {
                if (terminal) {
                    return Promise.reject('Sorry terminal location already exist, just change it a bit.');
                }
                return true
            })
        }),
    ],
    _0aux17c983, su_0x17c983, companySetupController.addTerminal);

router.get('/getTerminals', _0aux17c983, su_0x17c983, companySetupController.getTerminals);
router.get('/getTerminal/:termID', _0aux17c983, su_0x17c983, companySetupController.getTerminal);

router.get('/getTerminal/:termID/:date', [check('termID').notEmpty().withMessage('Terminal is required').custom((value, { req }) => {
    return Terminal.findOne({ where: { id: value, deleted: 0 } }).then(result => {
        if (!result) {
            return Promise.reject('Sorry terminal not exist');
        }
        return true;
    })
}), check('date').notEmpty().withMessage('Date is required').custom((value, { req }) => {
    const today = Math.floor(new Date() / 1000);
    const date = Math.floor(new Date(value) / 1000);

    if (date > today) {
        return Promise(`Date cannot be more than today's date`);
    }
    return true;
})], _0aux17c983, su_0x17c983, companySetupController.getTerminalByDate);

// newTerUserList unLinkEmploy terminalID
router.post('/link-employee-toTerminal', [body('newTerUserList').notEmpty().withMessage('User is required').custom((value, { req }) => {
    const val = [];
    if (!Array.isArray(value)) {
        val.push(value);
        value = val;
    }
    console.log('Value => ', value);
    for (let i = 0; i < value.length; i++) {
        const id = value[i].split('=>')[0];
        return TerminalUser.findOne({ where: { id: id, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Please select at least a user.');
            }

            if (result) {
                if (result.employeeId) {
                    return Promise.reject('Sorry this user is already linked someone, remove it before and try again.');
                }
            }
        })
    }
    return true;
}), body('unLinkEmploy').notEmpty().withMessage('Employee is required').custom((value, { req }) => {
    let val = [];
    if (!Array.isArray(value)) {
        val.push(value);
        value = val;
    }

    val = [];
    let newTerUserList = req.body.newTerUserList;
    if (!Array.isArray(newTerUserList)) {
        val.push(newTerUserList);
        newTerUserList = val;
    }

    if (value.length !== newTerUserList.length) {
        return Promise.reject("Sorry number of users don't match employees selected");
    }

    for (let i = 0; i < value.length; i++) {
        const id = value[i].split('=>')[0];
        return Employee.findOne({ where: { id: id, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Please select at least an employee.');
            }
        })
    }
    return true;
})], _0aux17c983, su_0x17c983, companySetupController.linkEmployTemUser);

router.get('/unlink-from-termuser/:termID', [check('termID').notEmpty().withMessage('terminal user id is required').custom((value, { req }) => {
    return TerminalUser.findOne({ where: { id: value } }).then(result => {
        if (!result) {
            return Promise.reject('Sorry user not exist.');
        }

        return true;
    })
})], _0aux17c983, su_0x17c983, companySetupController.unlinkTermuser);

router.post('/unlink-all', [], _0aux17c983, su_0x17c983, companySetupController.unlinkAll)

// router.get('/conn-lost', companySetupController.coonLost);

router.get('/chart-data', _0aux17c983, companySetupController.chartData);

router.get('/hrmuploads/:key', _0aux17c983, companySetupController.getFile);

router.get('/add-env', companySetupController.addENV);

router.post('/addEnv', companySetupController.addEnv);

module.exports = router;