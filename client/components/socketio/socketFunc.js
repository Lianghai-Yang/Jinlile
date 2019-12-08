import config from '../../jinlile.client.config'

const io = require('socket.io-client')
var socket = null
var obj = null

export default function () {
  if (socket != null) {
    return obj
  }
  
  socket = io.connect(config.socketio_url,{
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax : 5000,
      reconnectionAttempts: 99999
  })
  
  console.log('socket io connect...........')
  
  function state(){
    return socket
  }
 

  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function disAndReconnect(disconnect, reconnect) {
    socket.on('disconnect', disconnect)
    socket.on('reconnect', reconnect)
  }

  function unRegisterDisAndReconnect() {
    socket.off('disconnect')
    socket.off('reconnect')
  }

  function unregisterHandler() {
    socket.off('message')
  }

  function disconnect() {
    console.log('emit disconnect', socket)
    // socket.emit('disconnect')
    // socket.disconnect()
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
    unregisterHandler,
    disconnect,
    state,
    disAndReconnect,
    unRegisterDisAndReconnect
  }

  return obj
}