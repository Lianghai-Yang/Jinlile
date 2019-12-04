const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
let client = redis.createClient()
 
var store = new RedisStore({ client })

module.exports = store