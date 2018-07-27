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

  function ensureValidChatroom(chatroomName) {
    return ensureExists(
      () => chatroomManager.getChatroomByNameOrCreate(chatroomName),
      `invalid chatroom name: ${chatroomName}`
    )
  }

  function ensureValidChatroomAndUserSelected(chatroomName) {
    return Promise.all([
      ensureValidChatroom(chatroomName),
      ensureUserSelected(client.id)
    ])
      .then(([chatroom, user]) => {
          //console.log('room,user', chatroom, user)
          ////Promise.resolve({ chatroom, user })
          return { chatroom, user }
      })
  }

  function handleEvent(chatroomName, createEntry) {


    return ensureValidChatroomAndUserSelected(chatroomName)
      .then(function ({ chatroom, user }) {
        // append event to chat history
        //console.log('room,user 2', chatroom, user)
        const entry = { user, ...createEntry() }
        chatroom.addEntry(entry)

        // notify other clients in chatroom
        chatroom.broadcastMessage({ chat: chatroomName, ...entry })
        return chatroom
      })

  }

  return handleEvent
}

module.exports = function (client, clientManager, chatroomManager) {
  const handleEvent = makeHandleEvent(client, clientManager, chatroomManager)

  function handleRegister(login,password, callback) {
    //if (!clientManager.isUserAvailable(userName))
    //  return callback('user is not available')

    const user = clientManager.authorizeUser(login, password)
    clientManager.registerClient(client, user)
    if (!user) {
        return callback('invalid user credentials', user)
    }
    return callback(null, user)
  }

  function handleJoin(chatroomName, callback) {
    const createEntry = () => ({ event: `joined ${chatroomName}` })

    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
        // add member to chatroom
        chatroom.addUser(client)

        // send chat history to client
        callback(null, chatroom.getChatHistory())
      })
      .catch(callback)

  }

  function handleLeave(chatroomName, callback) {
    const createEntry = () => ({ event: `left ${chatroomName}` })

    handleEvent(chatroomName, createEntry)
      .then(function (chatroom) {
        // remove member from chatroom
        chatroom.removeUser(client.id)

        callback(null)
      })
      .catch(callback)
  }

  function handleMessage({ chatroomName, message } = {}, callback) {
    const createEntry = () => ({ message })

    handleEvent(chatroomName, createEntry)
      .then(() => callback(null))
      .catch(callback)
  }

  function handleGetChatrooms(_, callback) {
    return callback(null, chatroomManager.serializeChatrooms(clientManager.getUserByClientId(client.id)))
  }

  function handleGetAvailableUsers(_, callback) {
      //console.log('users:', clientManager.getAvailableUsers());
    return callback(null, clientManager.getAvailableUsers())
  }

  function handleDisconnect() {
    // remove user profile
    clientManager.removeClient(client)
    // remove member from all chatrooms
    chatroomManager.removeClient(client)
  }
  function handleAddRoom(name,type,users,callback){
      let room
      if (type === 'public' || type === 'private'){
          if (type === 'public') {
              room = {name:name,type:type}
          }
          else {
              room = {name:name,type:type,users:users}
          }
          chatroomManager.addRoom(room)
          return handleGetChatrooms(null, callback)
      }
      return false
  }
  function handleDeleteRoom(room,callback) {
      chatroomManager.deleteRoom(room);
      return handleGetChatrooms(null, callback)
  }
  function handleAddNewUser(user, callback) {
      clientManager.addNewUser(user, callback);
  }

  return {
    handleAddRoom,
    handleDeleteRoom,
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleGetAvailableUsers,
    handleDisconnect,
    handleAddNewUser
  }
}
