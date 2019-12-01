const Chatroom = require('./chatroom')
const chatroomTemplates = require('./config/chatrooms')

const data = require("../database/src");
// const users = data.users;
const groups = data.groups;

module.exports = function () {
  // mapping of all available chatrooms
  
  const chatrooms = new Map()
  // const chatrooms = new Map(
  //   chatroomTemplates.map(c => [
  //     c.name,
  //     Chatroom(c)
  //   ])
  // )
  async function addRoom(chatroomName) {
    let group = await groups.getByGroupName(chatroomName)
    console.log(group)
    if (chatrooms.get(group.name) === undefined){
      chatrooms.set(group.name, Chatroom(group))
    }
  }

  function removeClient(client) {
    chatrooms.forEach(c => c.removeUser(client))
  }

  async function getChatroomByName(chatroomName) {
    await addRoom(chatroomName)
    //return await groups.getByGroupName(chatroomName)
    return chatrooms.get(chatroomName)
  }

  function serializeChatrooms() {
    return Array.from(chatrooms.values()).map(c => c.serialize())
  }

  return {
    addRoom,
    removeClient,
    getChatroomByName,
    serializeChatrooms
  }
}
