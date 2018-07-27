const Chatroom = require('./Chatroom')
let chatroomTemplates = require('./config/chatrooms')

module.exports = function () {
  // mapping of all available chatrooms
  let chatrooms = new Map(
    chatroomTemplates.map(c => [
      c.name,
      Chatroom(c)
    ])
  )
  //console.log('rooms', chatrooms)
  function removeClient(client) {
    chatrooms.forEach(c => c.removeUser(client))
  }

  function getChatroomByNameOrCreate(chatroomName) {
      console.log('getroom:', chatroomName)
      const privateIDs = chatroomName.split(':')
      if (privateIDs.length === 2){ //private room between 2 users
          const room1 = chatrooms.get(privateIDs[0] + ":" + privateIDs[1])
          if (room1) {
              console.log('room1',room1)
              return room1
          }
          const room2 = chatrooms.get(privateIDs[1] + ":" + privateIDs[0])
          if (room2) {
              console.log('room2',room1)
              return room2
          }
          console.log('privateIDs:', privateIDs)
          const newRoom = {name:privateIDs[0] + ":" + privateIDs[1],type:"hidden"}
          addRoom(newRoom)
          return chatrooms.get(privateIDs[0] + ":" + privateIDs[1])
      }
      const room3 = chatrooms.get(chatroomName)
      return room3
  }
  function addRoom(room) {
      chatroomTemplates.push(room)
      chatrooms.set(room.name,Chatroom(room))
  }
  function deleteRoom(room) {
      for (let i = 0; i < chatroomTemplates.length; i++){
          if (chatroomTemplates[i].name === room) {
              chatroomTemplates.splice(i,1);
              chatrooms.delete(room);
              break;
          }
      }
  }

  function serializeChatrooms(user) {
      const login = (user) ? user.login : "undefined";
      const arr = Array.from(chatrooms.values())
      console.log('login', login )
      console.log('arr', arr)
      const filtered = arr.filter((c) => (c.type === "public" || c.type === "private" && c.users.indexOf(login) >= 0 || c.type === "hidden" && c.name.split(':').indexOf(login) >= 0))
      //console.log('user', user )
      //console.log('filtered', filtered)
      return filtered.map(c => c.serialize())
  }

  return {
    removeClient,
    getChatroomByNameOrCreate,
    serializeChatrooms,
    addRoom,
    deleteRoom
  }
}
