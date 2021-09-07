process.on('Unhandled Rejection', (error, promise) => {
    console.log('promise me =>', promise);
    console.log('error me => ', error);
});

require('dotenv/config');
const moment = require('moment')

const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const rootDir = require('./util/file');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const morgan = require('morgan');
const winston = require('./config/winston');
const sequelize = require('./util/database');
const {modelRelations} = require('./util/model-relation');
const isCompanySetup = require('./mitm/is-company-setup');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const User = require('./models/user-model');
const active = require('./mitm/active');

const app = express();

const csrfProtection = csrf();

rootDir.createDir();

const images = ['image', 'ssnitimage', 'spImage', 'noKImage', 'emergImage', 'depdImage', 'benfImage', 'company_logo', 'attFile', 'supportDocument', 'supportDocumentIN', 'fillform'];
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (images.includes(file.fieldname)) {
            cb(null, 'images');
        }
    },
    filename: (req, file, cb) => {
        $time = Math.floor(new Date() / 1000);
        if (file.fieldname === 'company_logo') {
            cb(null, 'companyLogo_' +$time+ file.originalname);
        } else if (file.fieldname === 'attFile') {
            cb(null, 'leaveAttFile_' +$time+ file.originalname);
        } else if (file.fieldname === 'supportDocument' || file.fieldname === 'supportDocumentIN') {
            cb(null, 'headappointment' +$time+ file.originalname);
        } else if (file.fieldname === 'fillform') {
            cb(null, `manualclockingfile_${$time}_${file.originalname}`);
        } else {
            cb(null, 'Emply_' +$time+ file.originalname);
        }
    },
});

app.set('view engine', 'ejs');
app.set('views', 'views');
// app.use(expressLayouts);
const ment = require('./routes/ment');
const auth = require('./routes/auth-route');
const dist = require('./routes/stdu-route');
const mun = require('./routes/hods-route');

const {alterTables} = require('./models/alterTable')

const companySetup = require('./routes/company-setup-route');
const errorController = require('./controllers/error');
const Employee = require('./models/employee-model');
const ONE_HOUR = 1000 * 60 * 60;
// const THIRTY_MINUTES = ONE_HOUR / 60;
const SIX_HOURS = ONE_HOUR * 6;

const SESSION_IDLE_TIMEOUT = SIX_HOURS;
// const SESSION_ABSOLUTE_TIMEOUT = SIX_HOURS;

app.use(
    bodyparser.urlencoded({
        extended: false,
    })
);

const fileFilter = (req, file, cd) => {
    if (images.includes(file.fieldname)) {
        if ( //file.originalname.match(/\.(jpg|png|jpeg|gif|pdf)$/)
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/gif' ||
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'image/jfif'
        ) {
            cd(null, true);
        } else {
            cd(null, false);
        }
    }
};

// app.use(
//   morgan('combined', {
//     stream: winston.stream,
//   })
// );
app.use(
    multer({
        storage: fileStorage,
        limits: { fileSize: '1mb' },
        fileFilter: fileFilter,
    }).fields(
        [{ name: `${images[0]}`, maxCount: 1 }, { name: `${images[1]}`, maxCount: 10 }, { name: `${images[2]}`, maxCount: 1 }, { name: `${images[3]}`, maxCount: 1 }, { name: `${images[4]}`, maxCount: 10 }, { name: `${images[5]}`, maxCount: 10 }, { name: `${images[6]}`, maxCount: 10 }, { name: `${images[7]}`, maxCount: 10 }, { name: `${images[8]}`, maxCount: 10 }, { name: `${images[9]}`, maxCount: 10 }, { name: `${images[10]}`, maxCount: 10 }, { name: `${images[11]}`, maxCount: 10 }]
    )
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: new SequelizeStore({
            db: sequelize,
            checkExpirationInterval: 2 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
            expiration: 300 * 60 * 1000, //24 * 60 * 60 * 1000 // The maximum age (in milliseconds) of a valid session.
        }),
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: SESSION_IDLE_TIMEOUT,//300 * 60 * 1000,
            signed: false,
            sameSite: true
        },
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        proxy: true, // if you do SSL outside of node.
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    try {
        res.locals.isAuthenticated = req.session.isLoggedIn;
        res.locals.csrfToken = req.csrfToken();
        next();
    } catch (err) {
        if (err.code == 'EBADCSRFTOKEN') return next(err)
        // throwError.throwError(err);
    }

});

app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
    // pullData(req);
    if (!req.session.user) {
        return next();
    }
    User.findByPk(req.session.user.id)
        .then(async(user) => {
            if (!user) {
                return next();
            }
            let deptDDT = 0;
            const emply = await Employee.findOne({ where: { id: user.currentUserEmployeeId, deleted: 0 } });
            if (emply) {
                deptDDT = await emply.departmentId;
            }

            const user_details = { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image, userId: user.userId, currentUserEmployeeId: user.currentUserEmployeeId, createdAt: user.createdAt, uuid: user.uuid, timeoutsec: user.sessiontimeout, deptID:deptDDT};
            req.user = user_details;
            // pullData(req);
            next();
        })
        .catch((err) => {
            next(new Error(err));
        });
});
app.use(active);
app.use(companySetup);
app.use(isCompanySetup, auth);
app.use(`/${process.env.MENT}`, isCompanySetup, ment);
app.use(`/${process.env.DIST}`, isCompanySetup, dist);
app.use(`/${process.env.MUN}`, isCompanySetup, mun);
app.use(errorController.get404);

// All relations
modelRelations();
// alterTables();
// Only use force in Development but not in Production {
//force: true}
let user;
// console.log('User=>', user);
sequelize
    .sync({
        // force: true,
        // alter: true
        // })
    })
    .then((server) => {
        app.listen(process.env.PORT || 3088);
        console.log('Date: ', moment().format('YYYY-MM-DD HH:m:s'));
    })
    .catch((err) => {
        console.log(err);
    });