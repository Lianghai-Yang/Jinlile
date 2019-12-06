const data = require("../database/src");
const groups = data.groups;

module.exports = function ({ _id, image, messages }) {
    const members = new Map()
    let chatHistory = []

    // console.log(messages)
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

    function broadcastMessage(message) {
      members.forEach(m => m.emit('message', message))
    }
  
    async function addEntry(entry) {
      console.log('add entry', entry)
      chatHistory = chatHistory.concat(entry)
      if ('message' in entry){
          await groups.addMessageToGroupById(_id, entry.user._id, 
                      entry.user.name, entry.message.text, entry.message.date)
      }
      // console.log(chatHistory)
    }
  
    function getChatHistory() {
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
  