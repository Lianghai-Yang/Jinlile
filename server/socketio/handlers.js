function makeHandleEvent(client, clientManager, chatroomManager) {
    function ensureExists(getter, rejectionMessage) {
      return new Promise(function (resolve, reject) {
        const res = getter()
        return res
          ? resolve(res)
          : reject(rejectionMessage)
      })
    }
  
    function ensureUserSelected(clientId) {
      return ensureExists(
        () => clientManager.getUserByClientId(clientId),
        'select user first'
      )
    }
  
    function ensureValidChatroom(chatroomId) {
      return ensureExists(
        () => chatroomManager.getChatroomById(chatroomId),
        `invalid chatroom id: ${chatroomId}`
      )
    }
  
    function ensureValidChatroomAndUserSelected(chatroomId) {
      return Promise.all([
        ensureValidChatroom(chatroomId),
        ensureUserSelected(client.id)
      ])
        .then(([chatroom, user]) => Promise.resolve({ chatroom, user }))
    }
  
    function handleEvent(chatroomId, createEntry) {
      return ensureValidChatroomAndUserSelected(chatroomId)
        .then(function ({ chatroom, user }) {
          // append event to chat history
          const entry = { user, ...createEntry() }
          chatroom.addEntry(entry)
          console.log('entry added...', chatroomId)
          // notify other clients in chatroom
          chatroom.broadcastMessage({ chat: chatroomId, ...entry })
          return chatroom
        })
    }
  
    return handleEvent
  }
  
module.exports = function (client, clientManager, chatroomManager) {
    const handleEvent = makeHandleEvent(client, clientManager, chatroomManager)
  
    function handleRegister(userId, callback) {
      if (!clientManager.isUserAvailable(userId))
        return callback('user is not available')
  
      const user = clientManager.getUserById(userId)
      clientManager.registerClient(client, user)
  
      return callback(null, user)
    }
  
    function handleJoin(chatroomId, callback) {
      chatroomManager.addRoom(chatroomId)
      const createEntry = () => ({ event: `joined ${chatroomId}` })
      handleEvent(chatroomId, createEntry)
        .then(function (chatroom) {
          // add member to chatroom
          chatroom.addUser(client)
          
          // send chat history to client
          callback(null, chatroom.getChatHistory())
        })
        .catch(callback)
    }
  
    function handleLeave(chatroomId, callback) {
      const createEntry = () => ({ event: `left ${chatroomId}` })
  
      handleEvent(chatroomId, createEntry)
        .then(function (chatroom) {
          // remove member from chatroom
          chatroom.removeUser(client.id)
          callback(null)
        })
        .catch(callback)
    }
  
    function handleMessage({ chatroomId, message } = {}, callback) {
      console.log("handle messages", chatroomId, message)
      const createEntry = () => ({ message })
      // ecfa6afe-4e1e-43f9-9e16-d5c2d0823006
      handleEvent(chatroomId, createEntry)
        .then(() => callback(null))
        .catch(callback)
    }
  
    function handleGetChatrooms(_, callback) {
      return callback(null, chatroomManager.serializeChatrooms())
    }
  
    // function handleGetAvailableUsers(_, callback) {
    //   return callback(null, clientManager.getAvailableUsers())
    // }
  
    function handleDisconnect() {
      // remove user profile
      clientManager.removeClient(client)
      // remove member from all chatrooms
      chatroomManager.removeClient(client)
    }
  
    return {
      handleRegister,
      handleJoin,
      handleLeave,
      handleMessage,
      handleGetChatrooms,
      handleDisconnect
    }
  }
  