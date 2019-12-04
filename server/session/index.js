const session = require('express-session')
 
const store = require('./redisStore')

module.exports = session({
    store: store,
    secret: 'Jinlile Tech',
    resave: false,
    saveUninitialized: false,
})