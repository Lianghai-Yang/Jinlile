const config = require('./jinlile.server.config')
const nodemailer = require('nodemailer')

const mailer = nodemailer.createTransport({
    host: config.SMTP_SERVER,
    port: config.SMTP_PORT,
    secure: true,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
    }
})

module.exports = mailer