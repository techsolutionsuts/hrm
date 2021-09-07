const { systemState } = require("../general-func/general-func");

module.exports = async(req, res, next) => {
    const stds = await systemState(req);
    if (stds[0]) {  
        if (req.xhr) {
            return res.status(500).json({ error: stds[1] });
        } else {
        return res.redirect('/');
        }
    }
    next();
}