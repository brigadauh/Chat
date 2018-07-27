let userTemplates = require('./config/users')

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

  function getAvailableUsers() {
      /*
    const usersTaken = new Set(
      Array.from(clients.values())
        .filter(c => c.user)
        .map(c => c.user.name)
    )
    return userTemplates
      .filter(u => !usersTaken.has(u.name))
    */
    //console.log('users',userTemplates );
    return userTemplates;
  }

  function isUserAvailable(userName) {
    return getAvailableUsers().some(u => u.name === userName)
  }

  function getUserByName(userName) {
    return userTemplates.find(u => u.name === userName)
  }
  function authorizeUser(login, pwd) {
    return userTemplates.find(u => u.login === login && u.password === pwd)
  }

  function getUserByClientId(clientId) {
    return (clients.get(clientId) || {}).user
  }
  function addNewUser(user, callback) {
      userTemplates.push(user);
      if (typeof callback === 'function'){
          callback(userTemplates);
      }
  }

  return {
    addClient,
    registerClient,
    removeClient,
    getAvailableUsers,
    isUserAvailable,
    getUserByName,
    getUserByClientId,
    addNewUser,
    authorizeUser
  }
}
