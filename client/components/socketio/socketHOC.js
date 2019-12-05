import React, { Component } from 'react'
import socketFunc from './socketFunc'
// import axios from "axios";

var socketState = {
  client: null,
  user: null,
  group: null,
  roomEntered: false,
  chatHistory: []
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
    if (func === null){
      socketState.client.registerHandler(onMessageReceived)
    }
    else{
      socketState.client.registerHandler(func)
    }
    return socketState
}

function addHistory(entry) {
  socketState.chatHistory = socketState.chatHistory.concat(entry)
  return socketState
}

function onMessageReceived(entry) {
  console.log('onMessageReceived:', entry)
  if ('message' in entry){
    entry = entry.message
    entry.date = new Date(entry.date)
    
    addHistory(entry)
  }
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
      if (this.state.socketState.roomEntered === false){
        let client = socketFunc()
        let roomEntered = true
        let user = 'Wang'
        let group = 'Colleagues'
        this.register(client, user)
        socketHandler('user', user)
        socketHandler('group', group)
        socketState = socketHandler('client', client)
        this.setState({
          socketState, socketState
        })

        this.onEnterChatroom(
          group,
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
        socketHandler('roomEntered', roomEntered)
        socketState = addregisterHandler(this.onMessageReceived)
        //socketState = addregisterHandler(null)
        this.setState({
          socketState, socketState
        })
        console.log(socketState)
      }
      else{
        socketState = addregisterHandler(this.onMessageReceived)
        //addregisterHandler(null)
      }
      
    }

    componentWillUnmount() {
      this.state.socketState.client.unregisterHandler()
    }

    getUserGroup(){
      const user = JSON.parse(localStorage.getItem('user'));
      const group = JSON.parse(localStorage.getItem('group'));
      console.log(user)
      return {user: user, group: group}
    }

    onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
      if (!this.state.socketState.user)
        return onNoUserSelected()
      console.log('enter chatroom success ......')
      return this.state.socketState.client.join(chatroomName, (err, chatHistory) => {
        if (err)
          return console.error(err)
        return onEnterSuccess(chatHistory)
      })
    }
    
    onLeaveChatroom(chatroomName, onLeaveSuccess) {
      this.state.socketState.client.leave(chatroomName, (err) => {
        if (err)
          return console.error(err)
        return onLeaveSuccess()
      })
    }

    register(client, name) {
      client.register(name, (err, user) => {
        return null
      })
    }

    onMessageReceived(entry) {
      console.log('onMessageReceived:', entry)
      if ('message' in entry){
        entry = entry.message
        entry.date = new Date(entry.date)
        
        addHistory(entry)
      }
      this.setState({
        socketState: socketHandler(null, null)
      })
    }

    render() {
      return (
        <ComponentToWrap
        onLeave={
          () => this.onLeaveChatroom(
            chatroom.name,
            () => history.push('/')
          )
        }
        onSendMessage={
          (message, cb) => this.state.socketState.client.message(
            this.state.socketState.group,
            message,
            cb
          )
        }
        chatHistory={retSocketState('chatHistory')}
        {...this.props}
        />
      )
    }
  }
}
export default socketWrapper