import React, { Component } from "react";
import $ from 'jquery';
import '../css/Rooms.css';
import Loader from "./Loader";

class ChatRooms extends Component {

    render() {
        const self = this;
        const rooms = this.props.chatRooms;
        if (!rooms){
            return <Loader />;
        }
        return (
            <h5>Rooms</h5>
            {rooms.map( (chatRoom) =>
                    <div key = {chatRoom.name} className = "Rooms-item">
                        <a  onClick={ self.handleMenuClick } className="menu-item" data-room = {chatRoom.name} href="/">{chatRoom.name}</a>
                    </div>
                )
            }

        )
    }
}
export default ChatRooms;
