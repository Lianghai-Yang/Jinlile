import React, { Component } from 'react'
import socketFunc from './socketFunc'
const io = require('socket.io-client')

var socketState = {
  client: null,
  roomEntered: false,
  chatHistory: []
}

function disconnectSocket(){
  console.log('on client disconnectSocket')
  socketState.client.disconnect()
  socketState.client = null
  socketState.roomEntered = false
  socketState.chatHistory = []
}

function resetSocket(){
  socketState.client.unregisterHandler()
  socketState.roomEntered = false
  socketState.chatHistory = []
}

function changeName(id, newName){
  for (let i=0; i<socketState.chatHistory.length; i++){
    if (socketState.chatHistory[i].userId == id){
      socketState.chatHistory[i].title = newName
    }
  }
}

function retSocketState(k){
  return socketState[k]
}

function socketHandler(k, v) {
  if (k===null){
    return socketState
  }
  else{
    socketState[k] = v
    return socketState
  }
}

function addregisterHandler(func) {
    socketState.client.registerHandler(func)
    return socketState
}

function addHistory(entry) {
  socketState.chatHistory = socketState.chatHistory.concat(entry)
  return socketState
}

const socketWrapper = (ComponentToWrap) => {
  return class chatComponent extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            socketState: socketHandler(null, null),
            chatHistory: []
        }
        this.onEnterChatroom = this.onEnterChatroom.bind(this)
        this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
        this.register = this.register.bind(this)
        this.onLogOut = this.onLogOut.bind(this)
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.getUserGroup = this.getUserGroup.bind(this)
    }

    componentDidUpdate(_, prevState) {
      if (this.state.chatHistory !== prevState.chatHistory){
        socketState = socketHandler('chatHistory', this.state.chatHistory)
        this.setState({socketState, socketState})
      }
    }

    componentDidMount(){
      socketState = socketHandler(null, null)
      this.setState({
        socketState, socketState
      })
      console.log('HOC did mount', this.state.socketState)
      if (this.state.socketState.roomEntered === false){
        let {user, group} = this.getUserGroup()
        user = user
        group = group
        console.log('hoc did mount enter, user and group',user, group)
        let client = retSocketState('client')
        console.log(client)
        if (client === null){
          client = socketFunc()
          this.register(client, user._id)
          socketState = socketHandler('client', client)
        }
        let roomEntered = true
        this.setState({
          socketState, socketState
        })

        this.onEnterChatroom(
          group.groupId,
          () => null,
          chatHistoryServer => {
            console.log('on enter chat room and get history:')
            let filtedChatHistory = []
            for (let i=0; i<chatHistoryServer.length; i++){
                if ('message' in chatHistoryServer[i]){
                    let message = chatHistoryServer[i].message
                    message.date = new Date(message.date)
                    filtedChatHistory.push(message)
                }
            }
            this.setState({chatHistory: filtedChatHistory}) 
          }
        )
        socketState = socketHandler('roomEntered', roomEntered)
        this.setState({
          socketState, socketState
        })
        console.log('socketState:', socketState)
      }
      addregisterHandler(this.onMessageReceived)
      console.log('HOC state', this.state)
      //console.log('ret group', retSocketState('group').groupId)
    }

    componentWillUnmount() {
      let client = retSocketState('client')
      if (client){
        client.unregisterHandler()
      }
    }

    getUserGroup(){
      const user = JSON.parse(localStorage.getItem('user'));
      const group = JSON.parse(localStorage.getItem('group'));
      console.log('user and group:')
      console.log(user, group)
      return {user: user, group: group}
    }

    onEnterChatroom(chatroomId, onNoUserSelected, onEnterSuccess) {
      //if (!this.state.socketState.user)
      //  return onNoUserSelected()
      console.log('enter chatroom success ......')
      return this.state.socketState.client.join(chatroomId, (err, chatHistory) => {
        if (err)
          return console.error(err)
        return onEnterSuccess(chatHistory)
      })
    }
    
    onLeaveChatroom(chatroomId, onLeaveSuccess) {
      this.state.socketState.client.leave(chatroomId, (err) => {
        if (err)
          return console.error(err)
        return onLeaveSuccess()
      })
    }

    onLogOut() {
      disconnectSocket()
    }

    register(client, name) {
      if (client){
        client.register(name, (err, user) => {
          return null
        })
      }
    }

    onMessageReceived(entry) {
      console.log('onMessageReceived:', entry)
      if ('message' in entry){
        entry = entry.message
        entry.date = new Date(entry.date)
        changeName(entry.userId, entry.title)
        addHistory(entry)
      }
      this.setState({
        socketState: socketHandler(null, null)
      })
    }

    render() {
      return (
        <ComponentToWrap
        onLogOut = {
          () => this.onLogOut()
        }
        onLeave = {
          () => this.onLeaveChatroom(
            JSON.parse(localStorage.getItem('group')).groupId,
            () => resetSocket()
          )
        }
        onSendMessage = {
          (message, cb) => this.state.socketState.client.message(
            JSON.parse(localStorage.getItem('group')).groupId,
            //retSocketState('group').groupId,
            message,
            cb
          )
        }
        //user={JSON.parse(localStorage.getItem('user'))}
        //group={JSON.parse(localStorage.getItem('group'))}
        chatHistory={retSocketState('chatHistory')}
        {...this.props}
        />
      )
    }
  }
}
export default socketWrapper