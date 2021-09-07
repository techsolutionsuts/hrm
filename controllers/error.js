const genFunct = require('../general-func/general-func');
const parseurl = require('parseurl');


exports.pathname = async(req) => {
    // For global usage
    return await parseurl(req).pathname;
}

exports.getValidationErrors = async(mesg, errors) => {
    let error = mesg;
    console.log('Error ==> ', errors.array().length);

    for (let i = 0; i < errors.array().length; i++) {
        error += `${errors.array()[i].msg.toString()}\n`;
        console.log('Error ==> ', errors.array()[i].msg);

    }
    return error;
}

exports.get404 = async(req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    await genFunct.log(req, ['Page not found', (await this.pathname(req)).toString()]);

    return res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        globalhex: `/${process.env.MENT}`,
        path: '/',
        user: req.user,
        userDetails: [req.user.id, req.user.name, req.user.email, req.user.image, req.user.role],
    });
}

exports.get500 = async(req, res, next, msg) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    await genFunct.log(req, ['Server error', (await this.pathname(req)).toString()]);

    return res.status(500).render('500', {
        pageTitle: 'Server Error',
        globalhex: `/${process.env.MENT}`,
        path: '/',
        user: req.user,
        errMsg: msg,
        userDetails: [req.user.id, req.user.name, req.user.email, req.user.image, req.user.role],
        dashBoardUser: []
    });
};

// exports.throwError = (err) => {
//     console.log(err);
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
// };