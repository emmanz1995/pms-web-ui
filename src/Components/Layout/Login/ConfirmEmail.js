import React, { Component } from 'react';
import LoginHeader from './LoginHeader';
import './login.css';
import Footer from './../Footer/Footer';
import SimpleReactValidator from 'simple-react-validator';
import { AccountService } from "../../../Service/api/AccountService";
import { FormGroup, Form, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

class ConfirmEmail extends Component {
constructor(props) {
    super (props)
    // setting all the states
    this.state = {
        email:''
    }
    // set up based on https://www.npmjs.com/package/simple-react-validator
    this.validator = new SimpleReactValidator();
    // binding all the functions
    this.forgetPassword = this.forgetPassword.bind(this);
    this.onChange = this.onChange.bind(this);
}

    forgetPassword(e) {
        e.preventDefault();
        // this conditional statement is based on https://www.npmjs.com/package/simple-react-validator
        if(this.validator.allValid()) {
            // injecting onForgetPassword function from AccountService with email as an argument
            AccountService
            .onForgetPassword(this.state.email)
            // setting a success promise that will alert out a message if password reset link has been sent to your email
            // code based on https://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example and https://www.npmjs.com/package/react-alert
            .then(success => {
                this.setState({email: ''});
                this.props.alert.success("Password Reset Link has been sent to your email");
            })
            // handles error when there is a error that occurs
            .catch(error => this.props.alert.error("We're sorry. We weren't able to identify you given the information provided!"));
        } else {
            // these codes are based on https://www.npmjs.com/package/simple-react-validator
            this.validator.showMessages();
            this.forceUpdate();
        }
    }
    // code based on https://medium.com/capital-one-tech/how-to-work-with-forms-inputs-and-events-in-react-c337171b923b
    onChange (e) {
        console.log({[e.target.name]: e.target.value});
        this.setState({[e.target.name]: e.target.value});
    };
    render() {
        return (
            <div>
                <LoginHeader />
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-8">
                                <img src="/Images/key-icon.png" className="key-icon" alt="Login Key" height="150" width="150"/>
                                <p id="text">Welcome to Patient Communication Management dashboard where can effectively communication with the allocated user. You will have access to an messaging system to which you can email the user designated to you directly in case you have some problems or enquiry. You will be able to request for your medical records to which the doctor will be able to upload and you can download and view on your device.</p>
                            </div>
                            <div className="col-md-3">
                                <h2 className="text-center">Email</h2>
                                <hr />
                                <Form>
                                    <FormGroup>
                                        <p className="c-e-label2">
                                            <i className="fas fa-user" />&nbsp;
                                            Email Address
                                        </p>
                                        <Input type="text" name="email" id="confirm-email" value={this.state.email} onChange={this.onChange}/>
                                    </FormGroup>
                                    <div className="error-message">
                                        {/* based on https://www.npmjs.com/package/simple-react-validator */}
                                        {this.validator.message('email', this.state.email, 'required|email', {className: 'text-danger'})}
                                    </div>
                                    <div className="btncustom2">
                                        <input id="confirm-email-btn" type="button" value="Submit" onClick={this.forgetPassword} /><Link to="/" id="cancel-btn">Cancel</Link>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                <Footer />
            </div>
        )
    }
}
export default ConfirmEmail;