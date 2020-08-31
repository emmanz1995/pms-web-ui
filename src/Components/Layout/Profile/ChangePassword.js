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
            this.state = {
                modal: false,
                password: '',
                confirmPassword: '',
                passwordResetError: '',
                passwordServerError: ''
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
        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    toggle(e) {
        e.preventDefault();
        this.validator.hideMessages();
        this.setState({ modal: !this.state.modal, password: '', confirmPassword: '', passwordResetError: '', passwordServerError: ''});
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
        // console.log({[e.target.name]:e.target.value});
    }

    submit(e) {
        e.preventDefault();
        if(this.validator.allValid()) {
        
            const credential = { password: this.state.password, confirmPassword: this.state.confirmPassword };

            console.log(`UserId = ${this.props.userId}`);
            AccountService
            .onChangePassword(credential,this.props.userId)
            .then((success) => {
                this.props.alert.success('You have successfully changed your password');
                this.setState({modal: !this.state.modal})
            })
            .catch((fail) => {
                console.log(fail);
                this.setState({passwordResetError: fail, passwordServerError: fail});
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        } 
    }

    render() {
        const passwordServerError = this.state.passwordServerError;
        const customConfirmPasswordMessage = { messages: 
            {
                in: 'New Password and Confirm Password does not match',
                min: 'Confirm Password needs to be minimum 6 characters long',
                max: 'Confirm Password should not exceed over 150 characters long'
            }
        };

        const customPasswordMessage = { messages: 
            {
                passwordValidator: 'New Password must meet the requirements with minimum of 6 characters, atleast 1 capital letter, 1 symbol and 1 number',
                min: 'New Password needs to be minimum 6 characters long',
                max: 'New Password should not exceed over 150 characters long'
            }
        };

        const passwordResetError = this.state.passwordResetError || 
        this.validator.message('newPassword', this.state.password, 'required|min:6|max:150|password', customPasswordMessage) ||
        this.validator.message('confirmPassword', this.state.confirmPassword, `required|min:6|max:150|in:${this.state.password}`, customConfirmPasswordMessage);
        return (
            <div className="model">
                <Button id="btn-edit" value="" onClick={this.toggle}>Edit</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="main-modal">
                    <ModalHeader className="modal-header" toggle={this.toggle}>Change Password</ModalHeader>
                    <ModalBody className="modal-background">
                        <p><b>Create new password</b></p>
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