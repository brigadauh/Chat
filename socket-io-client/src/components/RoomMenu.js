import React, { Component } from 'react';
//import $ from 'jquery';
import '../css/RoomMenu.css';

import ManageUsers from './ManageUsers';

class RoomMenu extends Component {
    constructor(props) {
        super(props);
        this.onDeleteRoom = null;
        this.handleManageUsers = this.handleManageUsers.bind(this);
        this.handleDeleteRoom = this.handleDeleteRoom.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
        this.state = {
            room:"",
            position:{top:0,left:0},
            isDisplayMenu:false,
            showManageUsers:false
        };
    }
    componentWillReceiveProps(newprops){
        if (this.state.room !== newprops.room || this.state.isDisplayMenu !== newprops.isDisplay) {
            this.setState({
                room:newprops.room,
                position:newprops.roomMenuPosition,
                isDisplayMenu:newprops.isDisplay
            });
        }
        this.onDeleteRoom = newprops.onDeleteRoom;
    }
    handleManageUsers(event){
        //const target = event.target;
        this.setState({
            showManageUsers:true
        });
        this.handleMenuClose(event);
        //console.log('manage users:', this.state.room);
    }
    handleDeleteRoom(event){
        //const target = event.target;
        //console.log('delete:', this.state.room);
        const callback = this.onDeleteRoom;
        if (typeof callback === 'function') {
            callback(this.state.room);
        }
    }
    handleMenuClose(event){
        const callback = this.props.onMenuClose;
        if (typeof callback === "function"){
            callback();
        }
    }
    render() {
        /*Finish Manage Users - (ManageUsers.js)*/
        const members = this.props.members;
        const roomMembers = this.props.roommembers;
        return (
            <React.Fragment>
            {
                this.state.isDisplayMenu
                ?
                <div className = "RoomMenu-box" style = {{top:this.state.position.top, left:this.state.position.left+100}}>
                    <span id = "RoomMenu_close" className = "RoomMenu-close" onClick = {this.handleMenuClose}>x</span>
                    <div className = "RoomMenu-item d-none" onClick = {this.handleManageUsers}>Manage Users</div>
                    <div className = "RoomMenu-divider d-none"></div>
                    <div className = "RoomMenu-item" onClick = {this.handleDeleteRoom}>Delete Room</div>
                </div>
                : ""
            }
            {
                this.state.showManageUsers
                ? <ManageUsers members = {members} roommembers = {roomMembers}/>
                : ""
            }
            </React.Fragment>
        );
    }
}
export default RoomMenu;
