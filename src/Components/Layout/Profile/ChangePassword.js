import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AccountService } from "../../../Service/api/AccountService";
import SimpleReactValidator from 'simple-react-validator';
import { withAlert } from 'react-alert'
import './Profile.css';
// import { passwordResetError,  } from './../Login/ResetPassword';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
            // setting all the states
            this.state = {
                modal: false,
                password: '',
                confirmPassword: '',
                passwordResetError: '',
                passwordServerError: ''
            }
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
        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    // event to open the modal
    // code based on https://bit.dev/reactstrap/reactstrap/modal
    toggle(e) {
        e.preventDefault();
        // hide error messages when the change password button was clicked
        this.validator.hideMessages();
        // clears all the fields when the change password button was clicked
        this.setState({ modal: !this.state.modal, password: '', confirmPassword: '', passwordResetError: '', passwordServerError: ''});
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    submit(e) {
        e.preventDefault();
        // this conditional statement is based on https://www.npmjs.com/package/simple-react-validator
        if(this.validator.allValid()) {
            // setting password and confirmPassword variables from AccountService with states
            // defining credentials as a variable with both the password and confirmPassword variable from AccountService
            const credential = { password: this.state.password, confirmPassword: this.state.confirmPassword };
            // logging userId into the console
            console.log(`UserId = ${this.props.userId}`);
            // injecting onChangePassword function from AccountService with credentials and userId as arguments
            AccountService
            .onChangePassword(credential,this.props.userId)
            // setting a success promise that will alert out a message if the message was successfully composed
            // code based on https://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example and https://www.npmjs.com/package/react-alert
            .then((success) => {
                this.props.alert.success('You have successfully changed your password');
                this.setState({modal: !this.state.modal})
              // handles error when there is a error that occurs
            }).catch((fail) => {
                console.log(fail);
                this.setState({passwordResetError: fail, passwordServerError: fail});
            });
        } else {
            // these codes are based on https://www.npmjs.com/package/simple-react-validator
            this.validator.showMessages();
            this.forceUpdate();
        } 
    }

    render() {
        const passwordServerError = this.state.passwordServerError;

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
                passwordValidator: 'New Password must meet the requirements with minimum of 6 characters, atleast 1 capital letter, 1 symbol and 1 number',
                min: 'New Password needs to be minimum 6 characters long',
                max: 'New Password should not exceed over 150 characters long'
            }
        };

        const passwordResetError = this.state.passwordResetError ||
        {/*based on https://www.npmjs.com/package/simple-react-validator*/}
        this.validator.message('newPassword', this.state.password, 'required|min:6|max:150|password', customPasswordMessage) ||
        this.validator.message('confirmPassword', this.state.confirmPassword, `required|min:6|max:150|in:${this.state.password}`, customConfirmPasswordMessage);
        // returned jsx code
        return (
            <div className="model">
                <Button id="btn-edit" value="" onClick={this.toggle}>Edit</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="main-modal">
                    <ModalHeader className="modal-header" toggle={this.toggle}>Change Password</ModalHeader>
                    <ModalBody className="modal-background">
                        <p><b>Create new password</b></p>
                        {/* creating the alert message in jsx using bootstrap 4 class component */}
                        {/* code based on https://getbootstrap.com/docs/4.0/components/alerts/ */}
                        <div className="alert alert-danger" role="alert" style={{ display: (passwordResetError || passwordServerError ? 'block':'none'), width: '73%' }} >
                             {passwordResetError || passwordServerError}
                        </div>
                        <input 
                            type="password" 
                            name="password" 
                            id="password-input" 
                            onChange={this.onChange}
                            value={this.state.password}
                        /><br/><br/>
                        <p><b>Confirm new password</b></p>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            id="password-input" 
                            onChange={this.onChange}
                            value={this.state.confirmPassword}
                        /><br/><br/>
                    </ModalBody>
                    <ModalFooter className="modal-footer">
                        <Button color="primary" onClick={this.submit}>Submit</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withAlert()(ChangePassword);