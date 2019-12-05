module.exports = (req, res, next) => {
    if (!req.session.user || !req.session.user.loggedIn) {
        return res.status(401).send({ errCode: 401, msg: 'Please Login' })
    }
    next()
}