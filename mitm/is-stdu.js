module.exports = (req, res, next) => {
    if (req.user.role !== 'STDU') {
        return res.redirect('/');
    }
    next();
}