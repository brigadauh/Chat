const io = require('socket.io-client')

export default function () {
    const endpoint = "http://127.0.0.1:4001";
    const socket = io.connect(endpoint);

    function registerHandler(onMessageReceived) {
        socket.on('message', onMessageReceived);
    }

    function unregisterHandler() {
        socket.off('message');
    }

    socket.on('error', function (err) {
        console.log('received socket error:');
        console.log(err);
    })

    function register(login,password, cb) {
        socket.emit('register', login, password, cb);
    }

    function join(chatroomName, cb) {
        socket.emit('join', chatroomName, cb);
    }

    function leave(chatroomName, cb) {
        socket.emit('leave', chatroomName, cb);
    }

    function message(chatroomName, msg, cb) {
        socket.emit('message', { chatroomName, message: msg }, cb);
    }

    function getChatrooms(cb) {
        socket.emit('chatrooms', null, cb);
    }
    function addChatRoom(name,type,users,cb) {
        socket.emit('addroom', name,type,users, cb);
    }
    function deleteChatRoom(name,cb) {
        socket.emit('deleteroom', name, cb);
    }

    function getAvailableUsers(cb) {
        socket.emit('availableUsers', null, cb);
    }
    function addNewUser(user,cb){
        socket.emit('addNewUser', user, cb);
    }

    return {
        register,
        join,
        leave,
        message,
        getChatrooms,
        getAvailableUsers,
        registerHandler,
        unregisterHandler,
        addNewUser,
        addChatRoom,
        deleteChatRoom
    };
}
