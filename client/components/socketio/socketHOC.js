import React, { Component } from 'react'
import socketFunc from './socketFunc'

var socketState = {
  client: null,
  // user: null,
  // group: null,
  roomEntered: false,
  chatHistory: []
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
        let {user, group} = this.getUserGroup()
        user = user
        group = group
        
        let client = socketFunc()
        let roomEntered = true
        this.register(client, user._id)
        // socketHandler('user', user)
        // socketHandler('group', group)
        socketState = socketHandler('client', client)
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
      this.state.socketState.client.unregisterHandler()
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
        onLeave = {
          () => this.onLeaveChatroom(
            JSON.parse(localStorage.getItem('group')).groupId,
            //retSocketState('group').groupId,
            () => null
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
        user={JSON.parse(localStorage.getItem('user'))}
        group={JSON.parse(localStorage.getItem('group'))}
        chatHistory={retSocketState('chatHistory')}
        {...this.props}
        />
      )
    }
  }
}
export default socketWrapper