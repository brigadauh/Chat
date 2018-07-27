import React, { Component } from "react";
import $ from 'jquery';
import '../css/SideMenu.css';
import Loader from "./Loader";
import AddRoom from "./AddRoom";
import RoomMenu from "./RoomMenu";

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleMenuRightClick = this.handleMenuRightClick.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);

        this.handleAddRoomClick = this.handleAddRoomClick.bind(this);
        this.handleAddRoomSubmit = this.handleAddRoomSubmit.bind(this);
        this.handleAddRoomCancel = this.handleAddRoomCancel.bind(this);

        this.handleDeleteRoom = this.handleDeleteRoom.bind(this);
        this.state = {
            user:this.props.user,
            chatRooms:null,
            members:null,
            isAddRoom:false,
            isShowRoomMenu:false,
            room:"",
            roomMenuPosition:{top:0,left:0},
            roomMembers:[]
        };
    }
    componentWillReceiveProps(newprops) {
        let propschanged = false;
        if (this.state.user !== newprops.user) {
            propschanged = true;
        }
        if (this.state.chatRooms !== newprops.chatRooms) {
            propschanged = true;
        }
        if (this.state.members !== newprops.members) {
            propschanged = true;
        }
        if (propschanged){
            this.setState({
                user:newprops.user,
                chatRooms:newprops.chatRooms,
                members:newprops.members
            });
        }

    }
    handleMenuClick (event) {
        event.preventDefault();
        const onClick = this.props.onClick;
        $(".SideMenu-item .menu-item").removeClass("font-weight-bold");
        $(event.target).addClass("font-weight-bold");
        if (typeof onClick === 'function') {
            onClick(event);
        }

    }
    handleMenuRightClick(event){
        event.preventDefault();
        const target = event.target;
        const position = $(target).position();
        //const width = $(target).width();
        console.log('$(target).data(roomusers)', $(target).data('roomusers'));
        this.setState({
            room:$(target).data('room'),
            roomMenuPosition:{top:position.top,left:position.left},
            roomMembers:$(target).data('roomusers'),
            isShowRoomMenu:true
        });
        $(".SideMenu-item .menu-item").removeClass("font-weight-bold");
        $(target).addClass("font-weight-bold");

        //console.log('right click', $(target).data('room'));

    }
    handleMenuClose(){
        this.setState({
            isShowRoomMenu:false
        });
    }
    handleAddRoomClick(event) {
        this.setState({
            isAddRoom:true
        });
    }
    handleAddRoomCancel (event){
        this.setState({
            isAddRoom:false
        });
    }
    handleAddRoomSubmit(name,type,users,callback){
        if (users.indexOf(this.state.user) === -1) {
            if (type === 'private') {
                if (users.indexOf(this.state.user.login) === -1){ // add self
                    users.push(this.state.user.login);
                }
            }
        }
        //console.log('name,type,users',name,type,users);
        if (typeof this.props.onSubmit === 'function'){
            this.props.onSubmit(name,type,users, function(err,msg) {
                if (typeof callback === 'function'){
                    callback(err,msg); // displaying error on AddRoom dialog or closing page
                }
            });

        }
    }
    handleDeleteRoom (room) {
        const callback = this.props.onDeleteRoom;
        if (typeof callback === 'function') {
            callback(room);
        }
        this.setState({
            room:"",
            isShowRoomMenu:false
        });
    }
    render () {
        let self = this;
        const chatRooms = this.state.chatRooms;
        const members = this.state.members;
        const user = this.state.user;
        const userid = user ? user.login || "" :"";
        const roomMembers = this.state.roomMembers;
        //console.log ('chatRooms', chatRooms);
        return (
            <React.Fragment>
            <AddRoom isDisplay = {this.state.isAddRoom} onSubmit = {this.handleAddRoomSubmit} onCancel = {this.handleAddRoomCancel} members = {members}/>
            <RoomMenu isDisplay = {this.state.isShowRoomMenu} room = {this.state.room} roomMenuPosition = {this.state.roomMenuPosition} members= {members} roommembers= {roomMembers}
               onDeleteRoom = {this.handleDeleteRoom}  onMenuClose = {this.handleMenuClose} />
            <div id = "sidemenu" className = "SideMenu-box">
                <h5>Rooms<span className = "SideMenu-add-room-bttn" onClick = {this.handleAddRoomClick}>+</span></h5>
                {   chatRooms && chatRooms.length > 0
                    ? chatRooms.map(chatRoom =>
                        chatRoom.type==="hidden"
                        ? ""
                        :
                        <div key = {chatRoom.name} className = "SideMenu-item">
                            <a  onClick={ self.handleMenuClick } onContextMenu={this.handleMenuRightClick} className="menu-item" data-roomusers = {chatRoom.users} data-room = {chatRoom.name} href="/">{chatRoom.name}</a>
                        </div>
                    )
                    : <Loader />
                }
                <div className = "SideMenu-spacer"></div>
                <h5>Members</h5>
                {   members
                    ? members.map(member =>

                        <div key = {member.id} className = "SideMenu-item">
                            <a  onClick={ self.handleMenuClick } className="menu-item" data-name = {member.name} data-id ={member.id} data-room = {userid +':'+ member.login} href="/">{member.name}</a>
                        </div>
                    )
                    : <Loader />
                }
            </div>
            </React.Fragment>
        );
    }
}
export default SideMenu;
