const server = require('http').createServer()
const io = require('socket.io')(server)

const ClientManager = require('./ClientManager')
const ChatroomManager = require('./ChatroomManager')
const makeHandlers = require('./handlers')

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()
const port = process.env.PORT || 4001

io.on('connection', function (client) {
  const {
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
  } = makeHandlers(client, clientManager, chatroomManager)

  console.log('client connected...', client.id)
  clientManager.addClient(client)

  client.on('register', handleRegister)

  client.on('join', handleJoin)

  client.on('leave', handleLeave)

  client.on('message', handleMessage)

  client.on('chatrooms', handleGetChatrooms)

  client.on('availableUsers', handleGetAvailableUsers)

  client.on('addNewUser', handleAddNewUser)

  client.on('addroom', handleAddRoom)

  client.on('deleteroom', handleDeleteRoom)

  client.on('disconnect', function () {
    console.log('client disconnected...', client.id)
    handleDisconnect()
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

server.listen(port, (err) => {
  if (err) throw err
  console.log(`Listening on port ${port}`)
})
