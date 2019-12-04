const express = require('express');
const path = require('path');
const logger = require('morgan');
const io = require('./socketio')
const cors = require('cors')
const session = require('./session')

const routes = require('./routes')
const app = express();


app.use(cors({
    credentials: true,
    origin: true
}));
app.use(logger('dev'));
app.use(session)
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
// app.use(express.static(path.join(__dirname, 'public')));
routes(app)

module.exports = app;
