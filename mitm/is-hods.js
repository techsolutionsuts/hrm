module.exports = (req, res, next) => {
    if (req.user.role !== 'HOD') {
        return res.redirect('/');
    }
    next();
}