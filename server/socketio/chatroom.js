const data = require("../database/src");
const groups = data.groups;

module.exports = function ({ name, image, messages }) {
    const members = new Map()
    let chatHistory = []

    // console.log(messages)
    for (let i=0; i<messages.length; i++){
      chatHistory.push({
        message: {
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
      chatHistory = chatHistory.concat(entry)
      if ('message' in entry){
          await groups.addMessageToGroup(name, entry.user._id, 
                      entry.user.name, entry.message.text, entry.message.date)
      }
      console.log(chatHistory)
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
        name,
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
  