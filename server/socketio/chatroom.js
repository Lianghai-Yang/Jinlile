const data = require("../database/src");
const groups = data.groups;
const users = data.users;

module.exports = function ({ _id, image, messages }) {
    const members = new Map()
    let chatHistory = []
    
    transferHistory(messages)

    function transferHistory(messages){
      chatHistory = []
      for (let i=0; i<messages.length; i++){
        chatHistory.push({
          message: {
              userId: messages[i].userId,
              title: messages[i].userName,
              position: 'left',
              type: 'text',
              text: messages[i].content,
              date: messages[i].time
              }
        })
      }
      console.log(chatHistory)
      return chatHistory
    }
    

    function broadcastMessage(message) {
      members.forEach(m => m.emit('message', message))
    }
  
    async function addEntry(entry) {
      console.log('add entry')
      // chatHistory = chatHistory.concat(entry)
      if ('message' in entry){
          let user = await users.getById(entry.user._id)
          await groups.addMessageToGroupById(_id, user._id, 
                      user.name, entry.message.text, entry.message.date)
      }
      let group = await groups.getById(_id)
      transferHistory(group.messages)
      // console.log(chatHistory)
    }
  
    function getChatHistory() {
      //let group = await groups.getById(_id)
      //transferHistory(group.messages)
      return chatHistory.slice()
    }
  
    function addUser(client) {
      members.set(client.id, client)
    }
  
    function removeUser(client) {
      members.delete(client.id)
    }
  
    function serialize() {
      return {
        _id,
        image,
        numMembers: members.size
      }
    }
  
    return {
      broadcastMessage,
      addEntry,
      getChatHistory,
      addUser,
      removeUser,
      serialize
    }
  }
  