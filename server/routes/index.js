const users = require('./users')
const groups = require('./groups')

module.exports = app => {
  app.use('/users', users)
  app.use('/groups', groups)
}
