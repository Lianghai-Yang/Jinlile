var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const server = require('http').createServer()
const io = require('socket.io')(server)
const ClientManager = require('./socketio/clientManager')
const ChatroomManager = require('./socketio/chatroomManager')
const makeHandlers = require('./socketio/handlers')

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

io.on('connection', function (client) {
    const {
      handleRegister,
      handleJoin,
      handleLeave,
      handleMessage,
      handleGetChatrooms,
      handleGetAvailableUsers,
      handleDisconnect
    } = makeHandlers(client, clientManager, chatroomManager)
  
    console.log('client connected...', client.id)
    clientManager.addClient(client)
    client.on('register', handleRegister)
    client.on('join', handleJoin)
    client.on('leave', handleLeave)
    client.on('message', handleMessage)
    client.on('chatrooms', handleGetChatrooms)
    client.on('availableUsers', handleGetAvailableUsers)
    client.on('disconnect', function () {
      console.log('client disconnect...', client.id)
      handleDisconnect()
    })
    client.on('error', function (err) {
      console.log('received error from client:', client.id)
      console.log(err)
    })
  })
  
  server.listen(8800, function (err) {
    if (err) throw err
    console.log('listening on port 8800')
  })

module.exports = app;
