import React, { Component } from 'react';
import { AccountService } from "../../../Service/api/AccountService";
import { Form, FormGroup, Input } from "reactstrap";
import LoginHeader from "./LoginHeader";
import SimpleReactValidator from 'simple-react-validator';
import { Link } from 'react-router-dom';
import Footer from "../Footer/Footer";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        // setting all the states
        this.state = {
            password: '', 
            confirmPassword: '',
            verifyResetError: '',
            passwordResetError: ''
        }
        // set up based on https://www.npmjs.com/package/simple-react-validator
        // this sets up the custom message for error message and creates the regex needed to validate password
        this.validator = new SimpleReactValidator({
            validators: {
              password: {
                message: 'The :attribute must meet the requirements with minimum of 6 characters, atleast 1 capital letter, 1 symbol and 1 number',
                rule: (val, params, validator) => {
                  return validator.helpers.testRegex(val,/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,150}$/g);
                },
                required: true
              }
            }
          });
        // binding all the functions
        this.onChange = this.onChange.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    componentDidMount () {
        // defines token in this class after being injected from another class as a prop
        const token = this.props.match.params.passwordResetToken;
        // injecting onResetPassword function from AccountService with credentials and userId as arguments
        AccountService.onVerifyReset(token)
        // handles error when there is a error that occurs
        .catch(fail => {
            console.log(fail);
            this.setState({verifyResetError: fail});
        });
    }
    // function allows the user to type something on the input fields
    onChange (e) {
        this.setState({[e.target.name]: e.target.value});
    }

    resetPassword (e) {
        e.preventDefault();
        // this conditional statement is based on https://www.npmjs.com/package/simple-react-validator
        if (this.validator.allValid()) {
            const token = this.props.match.params.passwordResetToken;
            // setting password and confirmPassword variables from AccountService with states
            // defining credentials as a variable with both the password and confirmPassword variable from AccountService
            const credential = { password: this.state.password, confirmPassword: this.state.confirmPassword };
            // injecting onResetPassword function from AccountService with credentials and userId as arguments
            AccountService
            .onResetPassword(credential, token)
            // setting a success promise that will alert out a message if the password was reset successfully
            // code based on https://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example and https://www.npmjs.com/package/react-alert
            .then(success => {
                this.props.alert.success('You have successfully changed your password');
                // redirects user to the login page once they have successfully changed their password
                this.props.history.push('/');
            })
            // handles error when there is a error that occurs
            .catch(fail => {
                console.log(fail);
                this.setState({passwordResetError: fail});
            });
        } else {
            // these codes are based on https://www.npmjs.com/package/simple-react-validator
            this.validator.showMessages();
            this.forceUpdate();
        } 
        
    }
    render() {
        const verifyResetError = this.state.verifyResetError;

        // custom error messages for confirm password
        const customConfirmPasswordMessage = { messages: 
            {
                in: 'New Password and Confirm Password does not match',
                min: 'Confirm Password needs to be minimum 6 characters long',
                max: 'Confirm Password should not exceed over 150 characters long'
            }
        };

        // custom error messages for password
        const customPasswordMessage = { messages: 
            {
                password: 'New Password must meet the requirements with minimum of 6 characters, atleast 1 capital letter, 1 symbol and 1 number',
                min: 'New Password needs to be minimum 6 characters long',
                max: 'New Password should not exceed over 150 characters long'
            }
        };

        const passwordResetError = this.state.passwordResetError ||
        {/*based on https://www.npmjs.com/package/simple-react-validator*/}
        this.validator.message('newPassword', this.state.password, `required|min:6|max:150|password`, customPasswordMessage) ||
        this.validator.message('confirmPassword', this.state.confirmPassword, `required|min:6|max:150|in:${this.state.password}`, customConfirmPasswordMessage);

        return (
            <div>
            <LoginHeader />
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="info-reset">
                                <img src="/Images/key-icon.png" className="key-icon" alt="Login Key" height="150" width="150" />
                                <p id="text">Welcome to Patient Communication Management dashboard where can effectively communication with the allocated user. You will have access to an messaging system to which you can email the user designated to you directly in case you have some problems or enquiry. You will be able to request for your medical records to which the doctor will be able to upload and you can download and view on your device.</p>
                            </div> 
                        </div>
                        <div className="col-md-3">
                            <Form className="reset-password-form">
                            <h2>Reset your Password</h2>
                            <div className="requirements-container">
                                    <p id="requirements-title">
                                        <i className="fas fa-info-circle" />&nbsp;
                                        <b>Password Requirements:</b>
                                    </p>
                                    <p><li>Password must be 6 characters long</li></p>
                                    <p><li>Password must contain at least 1 capital letter</li></p>
                                    <p><li>Password must contain at least 1 symbol and 1 number</li></p>
                                </div>
                            {/* creating the alert message in jsx using bootstrap 4 class component */}
                            {/* code based on https://getbootstrap.com/docs/4.0/components/alerts/ */}
                            <div className="alert alert-danger" role="alert" style={{ display: (verifyResetError || passwordResetError ? 'block' : 'none'), width:'73%' }} >
                                {verifyResetError || passwordResetError}
                            </div>
                            <hr />
                                <FormGroup>
                                    <p id="reset-label">New Password</p>
                                    {/*<br/>*/}
                                    <Input 
                                        type="password" 
                                        name="password" 
                                        id="passwords"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <p id="reset-label">Confirm Password</p>
                                    <Input 
                                        type="password" 
                                        name="confirmPassword" 
                                        id="confirm-passwords"
                                        value={this.state.confirmPassword}
                                        onChange={this.onChange}
                                    /> 
                                </FormGroup>
                                <div className="custom-reset-btn">
                                    <input type="submit" value="Reset password" id="reset-link-btn" onClick={this.resetPassword} disabled={verifyResetError} />
                                </div>
                            </Form>    
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default ResetPassword;
 