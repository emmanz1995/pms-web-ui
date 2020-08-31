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
    this.state = {
        email:''
    }
    this.validator = new SimpleReactValidator();
    this.forgetPassword = this.forgetPassword.bind(this);
    this.onChange = this.onChange.bind(this);
}

forgetPassword(e) {
    e.preventDefault();

    if(this.validator.allValid()) {
        AccountService
        .onForgetPassword(this.state.email)
        .then(success => {
            this.setState({email: ''});
            this.props.alert.success("Password Reset Link has been sent to your email");            
        })
        .catch(error => this.props.alert.error("We're sorry. We weren't able to identify you given the information provided!"));
    } else {
        this.validator.showMessages();
        this.forceUpdate();
    }
}

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
                                        {this.validator.message('email', this.state.email, 'required|email')}
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