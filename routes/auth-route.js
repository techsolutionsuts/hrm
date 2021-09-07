const express = require('express');
const {
    check,
    body
} = require('express-validator/check');
const bcrypt = require('bcryptjs');

const authController = require('../controllers/auth-controller');

const User = require('../models/user-model');
const isCompany = require('../mitm/is-company-setup');

const a10_0aux53219d = require('../mitm/is-auth');
const a90_0xsu2e2eed = require('../mitm/is-sudo');
const Employee = require('../models/employee-model');
const Department = require('../models/department-model');
const csrf = require('csurf');
const { checkImage } = require('../general-func/general-func');

const router = express.Router();
// const csrfProtection = csrf();

// To the auth-controller which render the loginform
router.get('/', authController.getLogin);
router.get('/timeout', authController.getTimeout);

// To the auth-controller which render the loginform
router.post('/login', [
    check('email', 'Please enter valid credentials email').isEmail(),
    body('password', 'Please enter valid credentials password').trim()
], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/timeout/:id', authController.autoLogout);

router.get('/getUser/:userId', [
    check('userId').not().isEmpty().withMessage('Invalid user').isNumeric().custom((value, { req }) => {
        return User.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Your account does not exist, please contact system administrator.');
            } else {
                if (!result.currentUserEmployeeId) {
                    return Promise.reject('null');
                }
            }
            if (req.params.userId != req.user.id) {
                return Promise.reject('Sorry not allowed, since you are not the logged in user. Ensure you are the logged in user to view your profile.');
            }
            return true;
        });
    })
], a10_0aux53219d, authController.getUser);


router.post('/linkUser', [body('user_empl').not().isEmpty().withMessage('Please select employee').custom((value, { req }) => {
        return Employee.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('Employee does not exist, please contact system administrator.');
            }
            return true;
        });
    }),

    body('userId').not().isEmpty().withMessage('Please ensure you are login').custom((value, { req }) => {
        return User.findOne({ where: { id: value, deleted: 0 } }).then(result => {
            if (!result) {
                return Promise.reject('User does not exist, please contact system administrator.');
            } else {
                if (result.currentUserEmployeeId) {
                    return Promise.reject('This account is already linked to an employee');
                }
            }
            if (req.body.userId != req.user.id) {
                return Promise.reject('Sorry not allowed, since you are not the logged in user. Ensure you are the logged in user to view your profile.');
            }
            return true;
        });
    })
], a10_0aux53219d, authController.linkUser);

router.post('/changepassword', [body('old_pass').not().isEmpty().withMessage('Plaese enter old password').custom((value, { req }) => {
        return User.findOne({ where: { id: req.body.userId_pass, deleted: 0 } }).then(async result => {
            if (!result) {
                return Promise.reject('User does not exist, please contact system administrator.');
            }
            if (result) {
                const doMatch = await bcrypt.compare(value, result.password);
                // console.log('doMatch ====> ', doMatch);
                if (!doMatch) {
                    return Promise.reject('Old password is not correct !!');
                }
            }
            return true;
        });
    }),
    body('new_pass').not().isEmpty().withMessage('Password is required').isLength({
        min: 8
    }).withMessage('Password length must be 8 characters or more').custom((value, { req }) => {
        if (value !== req.body.conf_pass) {
            return Promise.reject('Password do not match');
        }
        return true;
    })
], a10_0aux53219d, authController.changepassword);

router.get('/changeIdleTimeout/:time', a10_0aux53219d, authController.changeIdleTimeout)

router.get('/getSystemUser', a10_0aux53219d, a90_0xsu2e2eed, authController.getSystemUser);

router.get('/getEmplyToAdd/:emplyID/:role', [check('emplyID').not().isEmpty().withMessage('Please select employee').custom((value, { req }) => {
        return Employee.findOne({ where: { id: value, deleted: 0 } }).then(async result => {
            if (!result) {
                return Promise.reject('Employee does not exist, please contact system administrator.');
            }
            if (result) {
                return await User.findOne({ where: { currentUserEmployeeId: result.id, deleted: 0 } }).then(async result => {
                    if (result) {
                        console.log('On =====> value', value, result.id);

                        return Promise.reject('Sorry this employee is already a system user !!');
                    }
                });
            }
            console.log('On =====> value', value, result.id);

            if (result) {
                console.log('On =====> value', value);
                return await Department.findOne({ where: { headByEmployeeId: result.id, deleted: 0 } }).then(async result => {
                    console.log('On =====> value1', value);

                    if (!result) {
                        console.log('On =====> value2', value);

                        if (req.params.role === 'HOD') {
                            console.log('On =====> value3', value);

                            return Promise.reject('Sorry this employee is not HOD or supervisor, make him/her HOD or Supervisor before you can asigned this role.');
                        }
                    }
                });
            }
            return true;
        });
    }),
    check('role').not().isEmpty().withMessage('Please select role').custom((value, { req }) => {
        const roles = ['STDU', 'Admin', 'HOD']
        if (!roles.includes(value)) {
            return Promise.reject('Sorry wrong value for role');
        }
        return true;
    })
], a10_0aux53219d, a90_0xsu2e2eed, authController.getEmplyToAdd);

router.get('/getNonUserEmply', a10_0aux53219d, a90_0xsu2e2eed, authController.getNonUserEmply);

router.post('/createSystUser', [body('emplytoadd').not().isEmpty().withMessage('Please select employee').custom((value, { req }) => {
        return Employee.findOne({ where: { id: value, deleted: 0 } }).then(async result => {
            if (!result) {
                return Promise.reject('Employee does not exist, please contact system administrator.');
            }
            if (result) {
                const user = await User.findOne({ where: { currentUserEmployeeId: result.id, deleted: 0 } });
                if (user) {
                    return Promise.reject('Sorry this employee is already a system user !!');
                }
            }

            if (result) {                
                return Department.findOne({ where: { headByEmployeeId: result.id, deleted: 0 } }).then(async result2 => {
                    if (!result2) {
                        if (req.body.user_role === 'HOD' || req.body.user_role === 'Admin') {
                            return Promise.reject('Sorry this employee is not HOD or supervisor, make him/her HOD or Supervisor before you can asigned this role.');
                        }
                    }
                });
            }
            return true;
        });
    }),
    body('user_role').not().isEmpty().withMessage('Please select role').custom((value, { req }) => {
        const roles = ['STDU', 'Admin', 'HOD']
        if (!roles.includes(value)) {
            return Promise.reject('Sorry wrong value for role');
        }
        return true;
    })
], a10_0aux53219d, a90_0xsu2e2eed, authController.createSystUser);

router.post('/createpassword', [body('user_id').not().isEmpty().custom((value, { req }) => {
        return User.findOne({ where: { id: value, deleted: 0 } }).then(async result => {
            if (!result) {
                return Promise.reject('No account exist, kindly contact system administrator.');
            }
            if (result) {
                if (!result.firstTime) {
                    return Promise.reject('Your account is setup, kindly request for password reset or contact system administrator.');
                }
            }
            return true;
        });
    }),

    body('cremail').not().isEmpty().withMessage('Wrong email').custom((value, { req }) => {
        return User.findOne({ where: { email: value, id: req.body.user_id, deleted: 0 } }).then(async result => {
            if (!result) {
                return Promise.reject('Wrong email kindly contact system administrator.');
            }

            return true;
        });
    }),
    body('crpassword').notEmpty().withMessage('Password is required').isLength({
        min: 8
    }).withMessage('Password length must be 8 characters or more'),

    body('crconpassword').notEmpty().withMessage('Confirm password is required').isLength({
        min: 8
    }).withMessage('Password length must be 8 characters or more').custom((value, { req }) => {
        if (value !== req.body.crpassword) {
            return Promise.reject('Password do not match');
        }
        return true
    }),
], authController.createpassword);

router.post('/editUserRoleStatus', [body('user_ID').not().isEmpty().custom((value, { req }) => {
        return User.findOne({ where: { id: value, deleted: 0 } }).then(async result => {
            if (!result) {
                return Promise.reject('User not exist');
            }
            if (result) {
                if (result.id == req.user.id) {
                    return Promise.reject('Sorry you cannot change your role or status.');
                }
            }
            if (result) {
                return Department.findOne({ where: { headByEmployeeId: result.currentUserEmployeeId, deleted: 0 } }).then(async result => {
                    if (!result) {
                        if (req.body.edit_user_role === 'HOD' || req.body.edit_user_role === 'Admin') {
                            return Promise.reject('Sorry this employee is not HOD or supervisor, make him/her HOD or Supervisor before you can asigned this role.');
                        }
                    }
                });
            }
            return true
        })
    }),
    body('edit_user_role').not().isEmpty().custom((value, { req }) => {
        const roles = ['STDU', 'Admin', 'HOD']
            // if (!(value === undefined || value === null || value === "")) {

        if (!roles.includes(value)) {
            return Promise.reject('Sorry wrong value for role');
        }
        // }
        return true;
    }),

    body('active').not().isEmpty().custom((value, { req }) => {
        const actives = [0, 1]
        if (!actives.includes(+value)) {
            return Promise.reject('Sorry wrong value for status');
        }
        return true;
    }),
], a10_0aux53219d, a90_0xsu2e2eed, authController.editUserRoleStatus);

router.post('/forceResetUserPass', [body('force_resetpass').isNumeric().withMessage('Wrong system password').custom((value, { req }) => {
    return User.findOne({ where: { id: req.body.ussaid, deleted: 0 } }).then(result => {
        if (!result) {
            return Promise.reject('User not found on the system');
        }
        if (value !== req.body.dcheck) {
            return Promise.reject('Wrong system password');
        }

        return true

    });
}), body('adminpass').not().isEmpty().withMessage('Please enter your password.').custom((value, { req }) => {
    return User.findOne({ where: { id: req.user.id, deleted: 0 } }).then(async result => {
        if (!result) {
            return Promise.reject('Sorry you are not the logged in person to perform this action.');
        }
        if (result) {
            const matchPass = await bcrypt.compare(value, result.password);
            // console.log('MatchPaword ======> ', matchPass);
            if (!matchPass) {
                return Promise.reject('Your password is wrong.');
            }
        }
        return true;
    });
})], a10_0aux53219d, a90_0xsu2e2eed, authController.forceResetUserPass)

router.post('/forceLogUserOut', [body('expiredAt').custom((value, { req }) => {
    return User.findOne({ where: { uuid: req.body.usuuid, deleted: 0 } }).then(result => {
        if (!result) {
            return Promise.reject('User not found on the system');
        }
        return true

    });
}), body('adminpwd').not().isEmpty().withMessage('Please enter your password.').custom((value, { req }) => {
    return User.findOne({ where: { id: req.user.id, deleted: 0 } }).then(async result => {
        if (!result) {
            return Promise.reject('Sorry you are not the logged in person to perform this action.');
        }
        if (result) {
            const matchPass = await bcrypt.compare(value, result.password);
            // console.log('MatchPaword ======> ', matchPass);
            if (!matchPass) {
                return Promise.reject('Your password is wrong.');
            }
        }
        return true;
    });
})], a10_0aux53219d, a90_0xsu2e2eed, authController.forceLogUserOut)


router.get('/requestPassResetForm', authController.requestPassResetForm);

router.post('/forgotpassword', [body('forgemail').custom((value, { req }) => {

    return User.findOne({ where: { email: value, deleted: 0 } }).then(async result => {
        if (!result) {
            return Promise.reject('Sorry this email does not exist, contact the admin.');
        }
    });
})], authController.forgotpassword);

router.post('/log', a10_0aux53219d, authController.log);

router.get('/getUserLogs/:userId', a10_0aux53219d, authController.getUerLogs);

router.post('/uploadImage', [body('image').custom(async (value, { req }) => {
    
    if (req.files.image !== undefined) {
        
        const result = await User.findOne({ where: { uuid: req.body.uuid_image, deleted: 0 } });
        if (!result) {
            return Promise.reject('Sorry account does not exist for this imge');
        }
        const file = req.files.image[0];
        // console.log('File => ', req.files.fillform[0]);
        const checkFile = (await checkImage(file)).toString();
        if (checkFile == 'type') {
            // console.log('Type => ', checkFile);
            return Promise.reject('Sorry file must be image type');
        }

        if (checkFile == 'size') {
            // console.log('size => ', checkFile);
            return Promise.reject('Sorry file size exceeds 1mb.');
        }
    }
    return true
})], a10_0aux53219d, authController.upload);

// router.get('/setup', authController.setup);

module.exports = router;