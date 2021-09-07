const genFunct = require('../general-func/general-func');
const fileHandler = require('../util/file');
module.exports = async(req, res, next) => {
    // console.log('Auth is-auth => ', req);

    if (!req.session.isLoggedIn) {
        // console.log('Auth is-auth => ', req);

        return res.redirect('/');
    }

    // let getIDD = await genFunct.getIDD();
    // getIDD = getIDD[0];

    // console.log('getIDD => ', getIDD);

    // if (getIDD <= 1) {
    //     await fileHandler.writeLog(`\n${new Date() } => Sorry software lincese have ended, kindly contact sales for a renewal. violation.`);

    //     return res.status(422).render('auth/login', {
    //         path: '/login',
    //         pageTitle: 'Login',
    //         errorMessage: 'Sorry software lincese have ended, kindly contact sales for a renewal.',
    //         oldInput: {
    //             email: email,
    //             password: password
    //         },
    //         validationErrors: [] // or [{param: 'email', param: 'password'}]
    //     });
    // }

    next();
}