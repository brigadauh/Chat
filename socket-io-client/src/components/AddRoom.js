import React, { Component } from "react";
import $ from 'jquery';
//import * as utils from "../utils";
import '../css/AddRoom.css';

class AddRoom extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.state = {
            isDisplay:false
        }
    }
    componentWillReceiveProps(newprops){
        if (this.state.isDisplay !== (newprops.isDisplay)) {
            this.setState({
                isDisplay: newprops.isDisplay
            })
        }
    }


    handleChangeType(event){
        const target = event.target;
        if (target.checked) {
            $('#AddRoom_user_list').addClass('d-none');
        }
        else {
            $('#AddRoom_user_list').removeClass('d-none');
        }
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
            $('#AddRoom_select_all').prop('checked',false);
        }
    }
    handleCancelClick(event){
        const onCancel = this.props.onCancel;
        if (typeof onCancel === "function") {
            onCancel(event);
        }
    }
    handleSubmitClick(event){
        $('#AddRoom_err').addClass('d-none')
        const onSubmit = this.props.onSubmit;
        const name = $('#AddRoom_name').val();
        const type = document.getElementById('AddRoom_type').checked ? "public" : "private";
        if (name.trim() === '') {
            $('#AddRoom_err').html('Please enter room name');
            $('#AddRoom_err').removeClass('d-none')
        }
        let users = [];
        $('.AddRoom-user-to-add').each(function() {
            if ($(this).is(":checked")) {
                users.push($(this).data('login')) ;
            }
        }) ;
        if (typeof onSubmit === 'function'){
            onSubmit(name.trim(),type,users, (err,msg) => {
                if (err) {
                    $('#AddRoom_err').html(msg); $('#AddRoom_err').removeClass('d-none');
                }
                else {
                    this.handleCancelClick(event);
                }
                return true;
            });
        }
    }

    render() {
        if (!this.state.isDisplay) {
            return ("");
        }
        const members = this.props.members;
        return (
            <React.Fragment>
                <div id = "AddRoomBox" className = "AddRoom-box">
                    <h5 className = "AddRoom-header text-center mb-3">Add Room</h5>
                    <input id = "AddRoom_name" className = "AddRoom-name w-100 mb-3" type = "text" placeholder = "name" />
                    <div>
                        <input id="AddRoom_type" type = "checkbox" className = "AddRoom-type" defaultChecked = {true} onChange = {this.handleChangeType}/>
                        <label htmlFor = "AddRoom_type" className = "ml-3">Public </label>
                    </div>
                    <div id = "AddRoom_user_list" className = "AddRoom-user-list d-none">
                        <h5 className = "AddRoom-header text-center mb-2">Add Users</h5>
                        <div>
                            <input id="AddRoom_select_all" type = "checkbox" className = "AddRoom-user-selection mb-2" defaultChecked = {false} onChange = {this.handleSelectAll}/>
                            <label htmlFor = "AddRoom_select_all" className = "ml-3 mb-2">Select All</label>
                        </div>
                        {
                            members
                            ? members.map(member =>
                                <div key = {member.login}>
                                    <input id={"AddRoom_user_"+member.login} type = "checkbox" className = "AddRoom-user-to-add" data-name = {member.name} data-id = {member.id} data-login = {member.login} defaultChecked = {false} onChange = {this.handleUserCheck}/>
                                    <label htmlFor = {"AddRoom_user_"+member.login} className = "ml-3">{member.name} </label>
                                </div>
                            )
                            : "No members"
                        }
                    </div>
                    <div id = "AddRoom_err" className = "text-danger d-none"></div>
                    <button id = "AddRoom_submit" className = "AddRoom-bttn-submit" onClick = {this.handleSubmitClick}>Add</button>
                    <button id = "AddRoom_close" className = "AddRoom-bttn-close" onClick = {this.handleCancelClick}>Cancel</button>
                </div>
            </React.Fragment>
        );
    }

}
export default AddRoom;
