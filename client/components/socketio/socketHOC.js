import React, { Component } from 'react'
import socketFunc from './socketFunc'


const socketWrapper = (ComponentToWrap) => {
  return class chatComponent extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            client: socketFunc(),
            user: '....',
            isRegisterInProcess: false,
            chatroom: 'Colleagues',
            chatHistory: []
        }
        this.nextgroup = ''
        this.nextname = ''    
        this.onEnterChatroom = this.onEnterChatroom.bind(this)
        this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
        this.register = this.register.bind(this)
        //this.getChatrooms = this.getChatrooms.bind(this)
        //this.getChatrooms()

    }

    componentDidMount(){
      this.nextname = localStorage.getItem('nextname')
      if (this.nextname == 'Yang'){
          localStorage.setItem('nextname', 'Wang')
      }
      else{
          localStorage.setItem('nextname', 'Yang')
      }
      this.nextname = localStorage.getItem('nextname')
      
      // this.nextgroup = localStorage.getItem('group')
      // if (this.nextgroup == 'Hiking Team'){
      //     localStorage.setItem('group', 'Colleagues')
      // }
      // else{
      //     localStorage.setItem('group', 'Hiking Team')
      // }
      // this.nextgroup = localStorage.getItem('group')
      this.nextgroup = 'Colleagues'
      
      console.log(this.nextname)
      console.log(this.nextgroup)

      this.register(this.nextname)
      this.onEnterChatroom(
          this.nextgroup,
          () => null,
          chatHistory => {
            console.log('on enter chat room and get history:')
            console.log(chatHistory)
            let filter_chatHistory = []
            for (let i=0; i<chatHistory.length; i++){
                if ('message' in chatHistory[i]){
                    let message = chatHistory[i].message
                    message.date = new Date(message.date)
                    filter_chatHistory.push(message)
                }
            }
            this.setState({chatHistory: filter_chatHistory})
          }
        )
    }

    onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
      if (!this.state.user)
        return onNoUserSelected()
      console.log('enter chatroom success ......')
      return this.state.client.join(chatroomName, (err, chatHistory) => {
        if (err)
          return console.error(err)
        return onEnterSuccess(chatHistory)
      })
    }
    
    onLeaveChatroom(chatroomName, onLeaveSuccess) {
      this.state.client.leave(chatroomName, (err) => {
        if (err)
          return console.error(err)
        return onLeaveSuccess()
      })
    }
  
    getChatrooms() {
      this.state.client.getChatrooms((err, chatrooms) => {
        this.setState({ chatrooms })
      })
    }
    
    register(name) {
      //const onRegisterResponse = user => this.setState({ isRegisterInProcess: false, user })
      //this.setState({ isRegisterInProcess: true })
      this.state.client.register(name, (err, user) => {
        return null
        //if (err) return onRegisterResponse(null)
        //return onRegisterResponse(user)
      })
    }

    render() {
      return (
        <ComponentToWrap
        chatroom={this.nextgroup}
        chatHistory={this.state.chatHistory}
        user={this.nextname}
        onLeave={
          () => this.onLeaveChatroom(
            chatroom.name,
            () => history.push('/')
          )
        }
        onSendMessage={
          (message, cb) => this.state.client.message(
            this.nextgroup,
            message,
            cb
          )
        }
        registerHandler={this.state.client.registerHandler}
        unregisterHandler={this.state.client.unregisterHandler}
        {...props}
        />
      )
    }
  }
}
export default socketWrapper