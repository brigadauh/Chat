module.exports = function ({ name, type, users }) {
  const members = new Map()
  let chatHistory = []
  if (!users) {
      users = []
  }
  function broadcastMessage(message) {
    members.forEach(m => m.emit('message', message))
  }

  function addEntry(entry) {
    chatHistory = chatHistory.concat(entry)
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
      console.log('serialize',name)
    return {
      name,
      type,
      numMembers: members.size
    }
  }

  return {
    name,
    type,
    users,
    broadcastMessage,
    addEntry,
    getChatHistory,
    addUser,
    removeUser,
    serialize
  }
}
