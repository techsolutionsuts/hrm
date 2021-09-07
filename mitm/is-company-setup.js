const Company = require("../models/company-model");
const User = require("../models/user-model");
const genFunct = require('../general-func/general-func');
const parseurl = require('parseurl');


exports.pathname = async(req) => {
    // For global usage
    return await parseurl(req).pathname;
}

exports.getValidationErrors = async(mesg, errors) => {
    let error = mesg;
    // console.log('Error ==> ', errors.array().length);

    for (let i = 0; i < errors.array().length; i++) {
        error += `${errors.array()[i].msg.toString()}\n`;
        // console.log('Error ==> ', errors.array()[i].msg);

    }
    return error;
}

module.exports = async(req, res, next) => {
    const company = await Company.findOne({ where: { deleted: 0 } });
    const user = await User.findOne({ where: { deleted: 0 } });

    if (!req.session.isLoggedIn) {
        // console.log('Here => ');
        if (!company && !user) {
            // console.log('Here1 => ', company);

            return res.render('company-setup', {
                pageTitle: 'Setup Company',
                path: `/${process.env.MENT}/index`,
                user: [],
                userDetails: [],
            });
        } else {
            // return res.redirect('/');
            if (req.body.email) {
                // console.log('In loged => ', req.body);
                return next();
            }

            // console.log('Auth is-company => ', );

            // const message = null;
            // return res.render('auth/login', {
            //     path: '/',
            //     pageTitle: 'Login',
            //     errorMessage: message,
            //     oldInput: {
            //         email: '',
            //         password: ''
            //     },
            //     // csrfToken: req.csrfToken(),
            //     validationErrors: [] // or [{param: 'email', param: 'password'}]
            // });
        }
    }

    if (!company) {
        console.log('Here now ======> ');
        if (req.user.role !== 'Admin') {
            // Send a mail if there is internet conn.
            await genFunct.log(req, ['Company setup has been tampered', (await this.pathname(req)).toString()]);

            return res.status(404).render('404', {
                pageTitle: 'Page Not Found',
                path: '/auth/login',
                user: req.user,
                userDetails: [req.user.id, req.user.name, req.user.email],
            });
        }

        await genFunct.log(req, ['Company setup has been tampered', (await this.pathname(req)).toString()]);

        return res.render('company-setup', {
            pageTitle: 'Setup Company',
            path: `/${process.env.MENT}/index`,
            user: req.user,
            userDetails: [req.user.id, req.user.name, req.user.email],
        });
    }
    next();
}