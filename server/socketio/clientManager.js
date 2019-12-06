// const userTemplates = require('./config/users')

const data = require("../database/src");
const users = data.users;
// const groups = data.groups;

module.exports = function () {
  // mapping of all connected clients
  const clients = new Map()

  function addClient(client) {
    clients.set(client.id, { client })
  }

  function registerClient(client, user) {
    clients.set(client.id, { client, user })
  }

  function removeClient(client) {
    clients.delete(client.id)
  }

  // function getAvailableUsers() {
  //   const usersTaken = new Set(
  //     Array.from(clients.values())
  //       .filter(c => c.user)
  //       .map(c => c.user._id)
  //   )
  //   return userTemplates
  //     .filter(u => !usersTaken.has(u._id))
  // }

  function isUserAvailable(userId) {
    const usersTaken = new Set(
      Array.from(clients.values())
        .filter(c => c.user)
        .map(c => c.user._id)
    )
    return !usersTaken.has(userId)

    // return getAvailableUsers().some(u => u.name === userName)
  }

  async function getUserById(userId) {
    // return await users.getByUserName(userName)
    return await users.getById(userId)
    // return userTemplates.find(u => u.name === userName)
  }

  function getUserByClientId(clientId) {
    return (clients.get(clientId) || {}).user
  }

  return {
    addClient,
    registerClient,
    removeClient,
    isUserAvailable,
    getUserById,
    getUserByClientId
  }
}
