import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { AsyncPaginate } from 'react-select-async-paginate';
import { MessageInboxService } from "../../../Service/api/MessageInboxService";
import SimpleReactValidator from 'simple-react-validator';
import { withAlert } from 'react-alert'
import './EmailDashboard.css';

class ComposeMessage extends React.Component {
    _isMounted = false;
    _limit = 10
    _disablePagination = false;
    _defaultAdditional = {
        page: 0
    };

    constructor(props) {
        super(props);
        // setting all the states
        this.state= {
            selectedPage: 0,
            selectedContact: null,
            subject: null,
            message: null,
            serverError: null,
            hasMorePages: true
        }
        // binding all the functions
        this.validator = new SimpleReactValidator();
        this.toggle = this.toggle.bind(this);
        this.getContacts = this.getContacts.bind(this);
        this.handleContactOptions = this.handleContactOptions.bind(this);
        this.onComposeMessage = this.onComposeMessage.bind(this);
    }
    // event to open the modal
    // code based on https://bit.dev/reactstrap/reactstrap/modal
    toggle(event) {
        event.preventDefault();
        this.validator = new SimpleReactValidator();
        this.setState({modal: !this.state.modal, selectedPage: 0, selectedContact: null,
            subject: null, message: null, serverError: null,  hasMorePages: true });
    }

    componentDidMount() {
        this._isMounted = true;
    }
    // connects MessageInboxService.js to the frontend logic
    async getContacts() {
        let page =  this.state.selectedPage;
        // defining currentUserId as a prop
        const { currentUserId } = this.props
        if (this.state.hasMorePages) {
            const response = await MessageInboxService.getUserContacts(this._limit, page, currentUserId, this._disablePagination, [ "assignedTo.fullName,DESC" ])
                // the idea of this code was based on https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
                .then(value => value)
                // sets errors for the composeMessage and logs error into the console
                .catch(errors => {
                    console.error("Errors to fetch user contact data", errors)
                });
            // mapping response in a variable in order to display the name and userId of the contact that user wants to send a message to
            const options = response?.results.map(x => { return { value: x.userId, label: x.fullName } });
            // this is to set up the pagination for the contact when the user wants to select a contact
            const hasMore = (response?.totalRecords > this._limit * (page + 1));

            this.setState({ selectedPage: page + 1, hasMorePages: hasMore})

            return {
                options: options,
                hasMore: hasMore,
                additional : {
                    page: page
                }
            }
        }
    }

    handleContactOptions(event) {
        this.setState({ selectedContact: event });
    }

    onComposeMessage(e) {
        e.preventDefault();
        if (this.validator.allValid()) {
            // setting the message variables with the states and prop deifned earlier
            const composeMessage = {
                toUserId: this.state.selectedContact.value,
                fromUserId: this.props.currentUserId,
                subject: this.state.subject,
                message: this.state.message
            }
            // logs compose message into the console
            console.log(composeMessage);
            // calling the onComposeNewMessage function from MessageInboxService.js file
            MessageInboxService.onComposeNewMessage(composeMessage)
                // setting a success promise that will alert out a message if the message was successfully composed
                // code based on https://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example and https://www.npmjs.com/package/react-alert
                .then((success) => {
                    this.props.alert.success(`You have successfully sent message to ${this.state.selectedContact.label}`);
                    this.setState({modal: !this.state.modal})
                   // handles error when there is a error that occurs
                }).catch((fail) => {
                console.log(fail);
                this.setState({serverError: fail});
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render(){
        // return jsx code, this is for the visual look of the website
        return (
            <div className="modal-button">
                <button className="btn-compose" onClick={this.toggle}>Compose Message</button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader>
                        Compose Message
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-body">
                            {/* creating the alert message in jsx using bootstrap 4 class component */}
                            {/* code based on https://getbootstrap.com/docs/4.0/components/alerts/ */}
                            <div className="alert alert-danger" role="alert" style={{ display: ( this.state.serverError ? 'block':'none'), width: '73%' }}>
                                {this.state.serverError}
                            </div>
                            <div className="form-group">
                                <AsyncPaginate
                                    id="contact"
                                    name="contact"
                                    value={this.state.selectedContact}
                                    loadOptions={this.getContacts}
                                    onChange={this.handleContactOptions}
                                    additional={this._defaultAdditional}
                                />
                                <div className="error-message">
                                    {/*based on https://www.npmjs.com/package/simple-react-validator*/}
                                    {this.validator.message('contact', this.state.selectedContact, 'required')}
                                </div>
                            </div>
                            <div className="form-group">
                            <input type="text" id="subject" name="subject" placeholder="Subject" onChange={e => this.setState({ subject: e.target.value }) } />
                                <div className="error-message">
                                    {/*based on https://www.npmjs.com/package/simple-react-validator*/}
                                    {this.validator.message('subject', this.state.subject, 'required', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="form-group">
                            <textarea id="message-area" name="message" placeholder="Your Message" onChange={e => this.setState({ message: e.target.value }) }>
                            </textarea>
                                <div className="error-message">
                                    {this.validator.message('message', this.state.message, 'required', { className: 'text-danger' })}
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.toggle}>Close</Button>
                        <Button onClick={this.onComposeMessage}>Send</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withAlert()(ComposeMessage);