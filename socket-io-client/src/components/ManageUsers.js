import React, { Component } from 'react';
import $ from 'jquery';
//import Members from './Members';
import '../css/ManageUsers.css';
//not finished, no data fom server about room members
class ManageUsers extends Component {
    constructor(props){
        super(props);
        this.handleUserCheck = this.handleUserCheck.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
    }
    handleSelectAll(event){
        const target = event.target;
        if (target.checked){
            $('.AddRoom-user-to-add').prop('checked',true);
        }
        else {
            $('.AddRoom-user-to-add').prop('checked',false);
        }
    }

    handleUserCheck(event){
        const target = event.target;
        if (!target.checked){
            $('#ManageUsers_select_all').prop('checked',false);
        }
    }
    handleSubmitClick(event){
        const callback = this.props.onSubmit;
        if (typeof callback === 'function'){
            callback(event);
        }
    }
    handleCancelClick(event){
        const callback = this.props.onSubmit;
        if (typeof callback === 'function'){
            callback(event);
        }
    }
    render() {
        const members = this.props.members;
        const roomMembers = this.props.roommembers;
        return (
            <div id = "ManageUsers_user_list" className = "ManageUsers-box">
                <h5 className = "ManageUsers-header text-center mb-2">Manage Users</h5>
                <div>
                    <input id="ManageUsers_select_all" type = "checkbox" className = "ManageUsers-user-selection mb-2" defaultChecked = {false} onChange = {this.handleSelectAll}/>
                    <label htmlFor = "ManageUsers_select_all" className = "ml-3 mb-2">Select All</label>
                </div>

                {
                    members
                    ? members.map(member =>
                        <div key = {member.login}>
                            <input id={"ManageUsers_user_"+member.login} type = "checkbox" className = "ManageUsers-user-to-add" data-name = {member.name} data-id = {member.id} data-login = {member.login} defaultChecked = {roomMembers.indexOf(member.login) >=0} onChange = {this.handleUserCheck}/>
                            <label htmlFor = {"ManageUsers_user_"+member.login} className = "ml-3">{member.name} </label>
                        </div>
                    )
                    : "No members"
                }
                <button id = "AddRoom_submit" className = "AddRoom-bttn-submit" onClick = {this.handleSubmitClick}>Add</button>
                <button id = "AddRoom_close" className = "AddRoom-bttn-close" onClick = {this.handleCancelClick}>Cancel</button>
            </div>
        );
    }
}
export default ManageUsers;
