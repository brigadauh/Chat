import React, { Component } from 'react';
import $ from 'jquery';
import * as actions from '../actions/LoginActions';
import '../css/Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.DEBUG = false; // set to true to force console.log to display debug info
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLoginFocus = this.handleLoginFocus.bind(this);
        this.handleLoginFocusLost = this.handleLoginFocusLost.bind(this);
        this.handlePwdFocus = this.handlePwdFocus.bind(this);
        this.handlePwdFocusLost = this.handlePwdFocusLost.bind(this);
        this.handleKeyUpPwd = this.handleKeyUpPwd.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.user = "";
        this.socket = this.props.socket;
        this.state = {
            show:true
        }
        this.loginText = "User name";
        this.pwdText = "Password";
    }
    componentWillReceiveProps(newProps) {
        if (this.state.show !== (newProps.showcontent === '1') ) {
            this.setState({show:newProps.showcontent === '1'});
        }
    }
    handleLoginFocus(event){
        const target = $(event.target);
        $('#LoginApp_cred1_lbl').removeClass('d-none');
        target.removeAttr("placeholder");
        target.addClass('LoginApp-cred-editing');
    }
    handleLoginFocusLost(event){
        const target = $(event.target);
        target.attr('placeholder', this.loginText);
        if (target.val() === ""){
            $('#LoginApp_cred1_lbl').addClass('d-none');
            target.removeClass('LoginApp-cred-editing');
        }
    }
    handlePwdFocus(event){
        const target = $(event.target);
        $('#LoginApp_cred2_lbl').removeClass('d-none');
        target.removeAttr("placeholder");
        target.addClass('LoginApp-cred-editing');
    }
    handlePwdFocusLost(event){
        const target = $(event.target);
        target.attr('placeholder', this.pwdText);
        if (target.val() === ""){
            $('#LoginApp_cred2_lbl').addClass('d-none');
            target.removeClass('LoginApp-cred-editing');
        }
    }
    handleKeyUpPwd(event) {
        const code = event.keyCode;
        if (code === 13){
            this.handleLoginClick(event);
        }
    }
    handleLoginClick(event) {
        let cred1 = $('#LoginApp_cred1').val();
        let cred2 = $('#LoginApp_cred2').val();
        $('#LoginApp_err').addClass('invisible');
        $('#LoginApp_credBtn').attr('disabled','disabled');
        actions.signin(this.socket,cred1,cred2,this.handleSuccess, this.handleFailure);
    }
    handleSuccess(user) {
        const cb = this.props.onSignIn;
        this.setState({show:false});
        if (typeof cb === "function"){
            cb(user);
        }

    }
    handleFailure(error) {
        $('#LoginApp_err').removeClass('invisible');
        $('#LoginApp_err').html(error);
        $('#LoginApp_credBtn').removeAttr('disabled');
    }
    render() {

        if (!this.state.show) {
            return ('');
        }
        return (
            <div className = "Login-dialog">
                <span className = "Login-title">Log In</span>
                <span id = "LoginApp_cred1_lbl" className = {this.user ? "LoginApp-cred-1-lbl" : "LoginApp-cred-1-lbl d-none"}>{this.loginText}</span>
                <input defaultValue ="negan" id = "LoginApp_cred1" type = "text" maxLength="255"  className = {this.user ? "LoginApp-cred-1 LoginApp-cred-editing" : "LoginApp-cred-1"}  placeholder = {this.loginText} onFocus = {this.handleLoginFocus} onBlur = {this.handleLoginFocusLost}/>
                <span  id = "LoginApp_cred2_lbl" className = "LoginApp-cred-2-lbl d-none">{this.pwdText}</span>
                <input defaultValue = "qwerty123" id = "LoginApp_cred2" type = "password" className = "LoginApp-cred-2" maxLength="64"  placeholder = {this.pwdText} onKeyUp = {this.handleKeyUpPwd} onFocus = {this.handlePwdFocus} onBlur = {this.handlePwdFocusLost}/>
                <div id = "LoginApp_err" className = "text-danger invisible">Invalid credentials</div>
                <button id = "LoginApp_credBtn" className = "LoginApp-cred-bttn" onClick = {this.handleLoginClick}> LOGIN </button>

            </div>
        );
    }
}
export default Login;
