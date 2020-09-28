import React, { Component } from 'react';
import { Form, FormGroup, Input } from 'reactstrap';
import { authService } from "../../../Service/api/AuthService";
import { Redirect } from "react-router";
import './login.css';
import LoginHeader from './LoginHeader';
import Footer from './../Footer/Footer';
import { Link } from "react-router-dom";
import SimpleReactValidator from 'simple-react-validator';

class LoginForm extends Component {

    constructor (props) {
        super (props);
        // setting all the states
        this.state = {
            email: "",
            password: ""
        };

        // set up based on https://www.npmjs.com/package/simple-react-validator
        this.validator = new SimpleReactValidator();
        // binding all the functions
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    login(e) {
        e.preventDefault();
        // this conditional statement is based on https://www.npmjs.com/package/simple-react-validator
        if (this.validator.allValid()) {
            // injecting onLogin function from AccountService with email and password as arguments
            authService
            .onLogin({ username: this.state.email, password: this.state.password })
            // handles error when there is a error that occurs
            .catch(error => this.props.alert.error(error));
        } else {
            // these codes are based on https://www.npmjs.com/package/simple-react-validator
            this.validator.showMessages();
            this.forceUpdate();
        } 
    }
    // code based on https://medium.com/capital-one-tech/how-to-work-with-forms-inputs-and-events-in-react-c337171b923b
    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    };
    render(){
        // this code will redirect the user to the homepage once they are logged in
        // code based on https://www.9lessons.info/2017/10/reactjs-php-restful-api-token.html
        if (authService.currentUserValue) {
            return <Redirect to={{ pathname: "/home" }} />;
        }
        // returns jsx code
        // bootstrap 4 is heavily used here
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