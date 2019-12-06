const Chatroom = require('./chatroom')

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
  async function addRoom(chatroomId) {
    let group = await groups.getById(chatroomId)
    console.log('add room', group)
    if (chatrooms.get(group._id) === undefined){
      chatrooms.set(group._id, Chatroom(group))
    }
  }

  function removeClient(client) {
    chatrooms.forEach(c => c.removeUser(client))
  }

  async function getChatroomById(chatroomId) {
    await addRoom(chatroomId)
    //return await groups.getByGroupName(chatroomName)
    return chatrooms.get(chatroomId)
  }

  function getAllChatrooms() {
    return chatrooms.values()
  }

  function serializeChatrooms() {
    return Array.from(chatrooms.values()).map(c => c.serialize())
  }

  return {
    addRoom,
    removeClient,
    getChatroomById,
    getAllChatrooms,
    serializeChatrooms
  }
}
