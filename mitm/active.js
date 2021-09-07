const genFunct = require('../general-func/general-func');
const fileHandler = require('../util/file');
module.exports = async(req, res, next) => {
    // console.log('Auth is-auth => ', req);

  if (req.session.isLoggedIn) {
    const SESSION_ABSOLUTE_TIMEOUT = 1000 * 60 * 60*6;
    const now = Date.now();
    const { createdAt } = req.session;
    console.log('createdAt1 => ', now > createdAt + SESSION_ABSOLUTE_TIMEOUT);
    if (now > createdAt + SESSION_ABSOLUTE_TIMEOUT) {
      const timeleft = now - createdAt;
    console.log('createdAt2 => ', createdAt);

      return res.status(200).json({ data: timeleft });
    }
    // return res.redirect('/');
    }
    next();
}