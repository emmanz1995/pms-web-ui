import React, { Component } from 'react';
import { Form, FormGroup, Input } from 'reactstrap';
import { authService } from "../../../Service/api/AuthService";
import { Redirect } from "react-router";
import './login.css';
import LoginHeader from './LoginHeader';
import Footer from './../Footer/Footer';
import { Link } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';
import Grid from '@material-ui/core/Grid';

class LoginForm extends Component {

    constructor (props) {
        super (props);
        this.state = {
            email: "",
            password: ""
        };
        
        this.validator = new SimpleReactValidator();
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    login(e) {
        e.preventDefault();
        if (this.validator.allValid()) {      
            authService
            .onLogin({ username: this.state.email, password: this.state.password })            
            .catch(error => this.props.alert.error(error));
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        } 
    }
    

    onChange(e) {
        // console.log({[e.target.name]: e.target.value});
        this.setState({[e.target.name]: e.target.value});
    };

    render(){
        if (authService.currentUserValue) {
            return <Redirect to={{ pathname: "/home" }} />;
        }
        return(
            <div>
                <LoginHeader/>
                    <div className="row">
                        <div className="col-md-9">
                            <div className="info">
                                <img src="/Images/key-icon.png" className="key-icon" alt="Login Key" height="150" width="150" />
                                <p id="text">Welcome to Patient Communication Management dashboard where can effectively communication with the allocated user. You will have access to an messaging system to which you can email the user designated to you directly in case you have some problems or enquiry. You will be able to request for your medical records to which the doctor will be able to upload and you can download and view on your device.</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <Form className="login-form">
                                <strong><p className="subtitle">Login</p></strong><hr/>
                                <FormGroup>
                                    <p className="label">
                                         <i className="fas fa-user" />
                                        Email
                                    </p>
                                    <Input 
                                        type="text" 
                                        name="email" 
                                        id="emails"
                                        value={this.state.email} 
                                        onChange={this.onChange}
                                    />
                                    <div className="error-message">
                                        {this.validator.message('email', this.state.email, 'required|email', { className: 'text-danger' })}
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <p className="label">
                                        <i className="fas fa-key" />&nbsp;
                                        Password
                                    </p>
                                    <Input 
                                        type="password" 
                                        name="password" 
                                        id="passwords"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                    />
                                    <div className="error-message">
                                        {this.validator.message('password', this.state.password, 'required|min:4', { className: 'text-danger' })}
                                    </div>
                                </FormGroup>
                                    <div className="btncustom">
                                        <input id="login-btn" type="button" value="Login" onClick={this.login} />
                                    </div><br/>
                                    <div className="forgot-password-btn">
                                        <Link to="/confirm-email">Forgot PASSWORD?</Link>
                                    </div>
                            </Form>
                        </div>
                    </div>
                <Footer/>
            </div>
        );
    }
}

export default LoginForm;