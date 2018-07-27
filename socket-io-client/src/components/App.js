import React, { Component } from "react";
//import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import $ from 'jquery';

import 'bootstrap/dist/css/bootstrap.min.css';
//import * as utils from "../utils";
import SideMenu from "./SideMenu";
import ChatBox from "./ChatBox";
//import Loader from "./Loader";
import socket from "../socket";
import Login from "./Login";
import '../css/App.css';
class App extends Component {
    constructor() {
        super();
        this.DEBUG = false;
        this.handleSideMenuClick = this.handleSideMenuClick.bind(this);

        this.onEnterChatroom = this.onEnterChatroom.bind(this);
        this.onLeaveChatroom = this.onLeaveChatroom.bind(this);
        this.getChatrooms = this.getChatrooms.bind(this);
        this.getMembers = this.getMembers.bind(this);
        this.register = this.register.bind(this);
        this.addChatRoom = this.addChatRoom.bind(this);
        this.deleteChatRoom = this.deleteChatRoom.bind(this);
        this.manageChatRoomsCallBack = this.manageChatRoomsCallBack.bind(this);
        this.socket = socket();

        this.state = {
            user: null,
            room:null,
            chatHistory:null,
            showLogin: true,
            //client: this.socket,
            chatrooms: null,
            members: null
        }
    }
    componentDidMount() {
    }
    onEnterChatroom(chatroomName, cbNoUser, cbSuccess) {
        if (!this.state.user){
            return cbNoUser();
        }

        return this.socket.join(chatroomName, (err, chatHistory) => {
            this.DEBUG && console.log('err, chatHistory', err, chatHistory);
            if (err && err.length > 0){
                return console.log(err);
            }
            return cbSuccess(chatHistory);
        });
     }

     onLeaveChatroom(chatroomName, onLeaveSuccess) {
        this.socket.leave(chatroomName, (err) => {
            if (err) {
                return console.error(err);
            }
            return onLeaveSuccess();
        });
     }

     getChatrooms() {
       this.socket.getChatrooms((err, chatrooms) => {
           this.setState({ chatrooms: chatrooms });
       });
     }
     getMembers() {
       this.socket.getAvailableUsers((err, members) => {
           this.DEBUG && console.log('err, members', err, members);
           this.setState({ members: members });
       });
     }
     addChatRoom(name,type,users, callback) {
         const self = this;
         this.socket.addChatRoom(name,type,users,(err, chatrooms) => {
             self.manageChatRoomsCallBack(err,chatrooms,callback);
         });
     }
     deleteChatRoom(room) {
         const self = this;
         this.socket.deleteChatRoom(room,function (err,chatrooms){
             //console.log('deleted');
             self.manageChatRoomsCallBack(err,chatrooms,null);
         });

     }
     manageChatRoomsCallBack(err, chatrooms,callback){
         let isError = false;
         let msg = "";
         if (!err) {
             this.setState({ chatrooms: chatrooms });

         }
         else {
             isError = true;
             msg = err;
         }
         if (typeof callback === 'function'){
             callback(isError,msg);
         }
     }
     register(user) {
         this.getChatrooms();
         //this.addChatRoom('Weather', 'public',[]);
         this.getMembers();
         this.setState({
             user:user,
             showLogin:false
         });

     }



    handleAddNewUser(user) {
         this.socket.addNewUser(user,(users) => {
             this.DEBUG && console.log('users', users)}
         );
    }
    /*
    handleNewMessage(data) {
        console.log(data);
        const {time, msg} = data;
        this.DEBUG && console.log('received message:', msg);
    }
    */
    handleSideMenuClick(event) {
        const target = event.target;
        const room = $(target).data('room');
        this.DEBUG && console.log('current room:', room);
        this.onEnterChatroom(room, (err) =>{
            this.DEBUG && console.log("no user",err);
        },
        (chatHistory) => {
            this.DEBUG && console.log("room, chatHistory",room, chatHistory);

            this.setState({
                room:room,
                chatHistory:chatHistory || []
            })
        });

    }
    render() {
        let loginClassName = this.state.showLogin ? "App-login-layout" : "App-login-layout d-none";
        this.DEBUG && console.log('loginClassName',loginClassName);
        return (
            <React.Fragment>
                <div id = "App_login"  className = {loginClassName}>
                    <Login socket = {this.socket} showcontent = {this.state.showLogin ? '1' : '0'} onSignIn = {this.register}/>
                </div>
                <aside className = "App-menu-left">
                    <SideMenu chatRooms = {this.state.chatrooms} members = {this.state.members} user = {this.state.user} onClick = {this.handleSideMenuClick}
                     onSubmit = {this.addChatRoom} onDeleteRoom = {this.deleteChatRoom}/>
                </aside>
                <main id = "main" className = "App-main">
                    <ChatBox channel = {this.state.room} socket = {this.socket} chatHistory = {this.state.chatHistory} user = {this.state.user}/>
                </main>
            </React.Fragment>
        );
    }
}
export default App;
