import React, { Component } from 'react';
import $ from 'jquery';
import '../css/Members.css';
// not finished
class Members extends Component {
    constructor() {
        super();
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
        //const target = event.target;

    }

    render() {
        const members = this.props.members;

        return (
            <React.Fragment>
            <div>
                <input id="AddRoom_select_all" type = "checkbox" className = "AddRoom-user-selection mb-2" defaultChecked = {false} onChange = {this.handleSelectAll}/>
                <label htmlFor = "AddRoom_select_all" className = "ml-3 mb-2">Select All</label>
            </div>
            {members ? members.map(member =>
                    <div key = {member.login}>
                        <input id={"AddRoom_user_"+member.login} type = "checkbox" className = "AddRoom-user-to-add" data-name = {member.name} data-id = {member.id} data-login = {member.login}
                        defaultChecked = {false} onChange = {this.props.selectUser}/>
                        <label htmlFor = {"AddRoom_user_"+member.login} className = "ml-3">{member.name} </label>
                    </div>
                )
                : "No members"
            }
            </React.Fragment>
        );
    }
}
export default Members;
