import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { AsyncPaginate } from 'react-select-async-paginate';
import { MessageInboxService } from "../../../Service/api/MessageInboxService";
import SimpleReactValidator from 'simple-react-validator';
import { withAlert } from 'react-alert'

class ComposeMessage extends React.Component {
    _isMounted = false;
    _limit = 10
    _disablePagination = false;
    _defaultAdditional = {
        page: 0
    };

    constructor(props) {
        super(props);
        this.state= {
            selectedPage: 0,
            selectedContact: null,
            subject: null,
            message: null,
            serverError: null,
            hasMorePages: true
        }
        this.validator = new SimpleReactValidator();
        this.toggle = this.toggle.bind(this);
        this.getContacts = this.getContacts.bind(this);
        this.handleContactOptions = this.handleContactOptions.bind(this);
        this.onComposeMessage = this.onComposeMessage.bind(this);
    }

    toggle(event) {
        event.preventDefault();
        this.validator = new SimpleReactValidator();
        this.setState({modal: !this.state.modal, selectedPage: 0, selectedContact: null,
            subject: null, message: null, serverError: null,  hasMorePages: true });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    async getContacts() {
        let page =  this.state.selectedPage;
        const { currentUserId } = this.props
        if (this.state.hasMorePages) {
            const response = await MessageInboxService.getUserContacts(this._limit, page, currentUserId, this._disablePagination, [ "assignedTo.fullName,DESC" ])
                .then(value => value)
                .catch(errors => {
                    console.error("Errors to fetch user contact data", errors)
                });

            const options = response?.results.map(x => { return { value: x.userId, label: x.fullName } });
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
            const composeMessage = {
                toUserId: this.state.selectedContact.value,
                fromUserId: this.props.currentUserId,
                subject: this.state.subject,
                message: this.state.message
            }

            console.log(composeMessage);

            MessageInboxService.onComposeNewMessage(composeMessage)
                .then((success) => {
                    this.props.alert.success(`You have successfully sent message to ${this.state.selectedContact.label}`);
                    this.setState({modal: !this.state.modal})
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
        return (
            <div className="modal-button">
                <button className="btn-compose" onClick={this.toggle}>Compose Message</button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader>
                        Compose Message
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-body">
                            <div className="alert alert-danger" role="alert" style={{ display: ( this.state.serverError ? 'block':'none'), width: '73%' }} >
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
                                    {this.validator.message('contact', this.state.selectedContact, 'required')}
                                </div>
                            </div>
                            <div className="form-group">
                            <input type="text" id="subject" name="subject" placeholder="Subject" onChange={e => this.setState({ subject: e.target.value }) } />
                                <div className="error-message">
                                    {this.validator.message('subject', this.state.subject, 'required')}
                                </div>
                            </div>
                            <div className="form-group">
                            <textarea id="message-area" name="message" placeholder="Your Message" onChange={e => this.setState({ message: e.target.value }) }>
                            </textarea>
                                <div className="error-message">
                                    {this.validator.message('message', this.state.message, 'required')}
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