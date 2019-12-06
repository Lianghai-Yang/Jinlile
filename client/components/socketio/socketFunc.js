import config from '../../jinlile.client.config'

const io = require('socket.io-client')
var socket = null
var obj = null

export default function () {
  if (socket != null) {
    return obj
  }
  
  socket = io.connect(config.socketio_url)

  console.log('socket io connect...........')
  
  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  socket.on('error', function (err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(chatroomId, cb) {
    socket.emit('join', chatroomId, cb)
  }

  function leave(chatroomId, cb) {
    socket.emit('leave', chatroomId, cb)
  }

  function message(chatroomId, msg, cb) {
    socket.emit('message', { chatroomId, message: msg }, cb)
  }

  function getChatrooms(cb) {
    socket.emit('chatrooms', null, cb)
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  obj = {
    register,
    join,
    leave,
    message,
    getChatrooms,
    getAvailableUsers,
    registerHandler,
    unregisterHandler
  }

  return obj
}