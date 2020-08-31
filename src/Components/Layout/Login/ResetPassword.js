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
        this.state = {
            password: '', 
            confirmPassword: '',
            verifyResetError: '',
            passwordResetError: ''
        }
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
        this.onChange = this.onChange.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    componentDidMount () {
        const token = this.props.match.params.passwordResetToken;
        AccountService.onVerifyReset(token)        
        .catch(fail => {
            console.log(fail);
            this.setState({verifyResetError: fail});
        });
    }

    onChange (e) {
        this.setState({[e.target.name]: e.target.value});
    }

    resetPassword (e) {
        e.preventDefault();
        if (this.validator.allValid()) {

            const token = this.props.match.params.passwordResetToken;
            const credential = { password: this.state.password, confirmPassword: this.state.confirmPassword };

            AccountService
            .onResetPassword(credential, token)
            .then(success => {
                this.props.alert.success('You have successfully changed your password');
                this.props.history.push('/login');
            })
            .catch(fail => {
                console.log(fail);
                this.setState({passwordResetError: fail});
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        } 
        
    }
    render() {
        const verifyResetError = this.state.verifyResetError;

        const customConfirmPasswordMessage = { messages: 
            {
                in: 'New Password and Confirm Password does not match',
                min: 'Confirm Password needs to be minimum 6 characters long',
                max: 'Confirm Password should not exceed over 150 characters long'
            }
        };

        const customPasswordMessage = { messages: 
            {
                password: 'New Password must meet the requirements with minimum of 6 characters, atleast 1 capital letter, 1 symbol and 1 number',
                min: 'New Password needs to be minimum 6 characters long',
                max: 'New Password should not exceed over 150 characters long'
            }
        };

        const passwordResetError = this.state.passwordResetError ||
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
 