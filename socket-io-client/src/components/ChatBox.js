import React, { Component } from "react";
import $ from 'jquery';
import * as utils from "../utils";
import '../css/ChatBox.css';
//import socket from '../socket';

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.DEBUG = false;
        this.channel = "";
        this.socket = null;
        this.chatHistory = null;
        this.user = null;
        this.getHistory = this.getHistory.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = {
          response: false
        };
    }
    componentDidMount() {

    }

    componentWillReceiveProps(newprops){
        let self = this;
        let requestHistory = false;
        if (newprops.channel !== this.channel) {
            this.chatHistory = null;
            this.channel = newprops.channel;
            requestHistory = true;
            this.DEBUG && console.log('channel', this.channel);
        }
        if (newprops.socket !== this.socket) {
            this.chatHistory = null;
            this.socket = newprops.socket;
            this.DEBUG && console.log('channel', this.channel);
            this.socket.registerHandler((data) => {self.handleNewMessage(data);});
        }
        if (newprops.user !== this.user) {
            this.chatHistory = null;
            this.user = newprops.user;
            requestHistory = true;
            this.DEBUG && console.log('channel', this.user);
        }
        if (newprops.chatHistory !== this.chatHistory) {
            this.chatHistory = newprops.chatHistory;
            requestHistory = true;
        }
        if (requestHistory) {
            this.DEBUG && console.log("history:",this.chatHistory);
            this.getHistory();

        }
    }


    handleClearHistory() {
        $('#chatHistory').empty();
    }
    handleNewMessage(data){
        const user = data.user ? data.user.name : "N/A";
        const msg = data.message;
        const $chatHistory = $('#chatHistory');
        if (msg) {
            const msgHtml = `
            <span>${user}:</span>
            <p>${msg}</p>
            `;
            $chatHistory.append(msgHtml);
            $('#chatHistoryBox').animate({
                scrollTop: $('#chatHistoryBox')[0].scrollHeight}, 100);
        }
    }
    handleKeyDown(event){

        const target = event.target;
        if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.altKey) {
            event.preventDefault();
            const text = utils.sanitize($(target).val());
            this.DEBUG && console.log('text to send', text);
            $(target).val('');
            //const user = this.user.name || "N/A";
            this.socket.message(this.channel, text, () => {
                //this.handleNewMessage(user, text);
            })
        }
    }
    getHistory(){
        this.handleClearHistory();
        const history = this.chatHistory;
        if (history) {
            history.map((h) => {
                return this.handleNewMessage(h);
            });
        }
        this.DEBUG && console.log('chathistory:',history);
    }
    render() {
        return (
            <React.Fragment>
                <div id = "chatHistoryBox" className = "App-chat-history-box pl-2 pr-2">
                    <table >
                    <tbody>
                    <tr><td id = "chatHistory"></td></tr>
                    </tbody>
                    </table>
                </div>
                <div className = "App-chat-message-box d-flex bd-highlight">
                    <textarea id = "chatMessage" rows = "4" placeholder = "say something nice..." className = "w-100 pl-2" onKeyDown = {this.handleKeyDown} />
                </div>
            </React.Fragment>
        );
    }


}
export default ChatBox;
