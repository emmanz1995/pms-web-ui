import React, { Component } from 'react';
import './EmailDashboard.css';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/sideBar';
import Footer from '../Footer/Footer';
import Moment from "react-moment";
import Pagination from "@material-ui/lab/Pagination"
import { MessageInboxService } from "../../../Service/api/MessageInboxService";
import { authService } from "../../../Service/api/AuthService";
import ComposeMessage from "./ComposeMessage";
import EllipsisText from "react-ellipsis-text";
import { Link } from "react-router-dom";

let stompClient = null;

class EmailDashboard extends Component {
    _isMounted = false;
    _limit = 20
    _disablePagination = false;
    _inboxStatus = "MAIN_INBOX";

    constructor(props) {
        super(props)
        this.state= {
            isLoading: true,
            currentUserInfo: null,
            results: [],
            currentPage: 1,
            totalRecords: 0,
            totalPages: 0
        }

        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.onConnected = this.onConnected.bind(this);
        this.connect = this.connect.bind(this);
        this.connect();
    }

    componentDidMount() {
        this._isMounted = true;

        const currentUser = authService.currentUserValue;

        this.setState({ currentUserInfo: currentUser })

        currentUser && this.getEmailInbox(this.state.currentPage - 1, this._limit, currentUser?.userId);
    }

    connect = () => {
        try {
            stompClient = MessageInboxService.stompClient();
            stompClient.connect({}, this.onConnected, this.onError);
        } catch (e) {
            console.error("could not connect over stomp");
        }

    }

    onConnected = () => {
        try {
            const { currentUserInfo } = this.state;
            currentUserInfo && stompClient.subscribe(`/user/${currentUserInfo.userId}/queue/main-inbox/notify`, this.onMessageReceived);
        } catch (e) {
            console.error("could not subscribe over stomp");
        }
    }

    onMessageReceived = (payload) => {
        if (this._isMounted) {
            const message = JSON.parse(payload.body);
            const {results} = this.state;
            message && this.setState({results: [message, ...results]})
        }
    }

    getEmailInbox(page, size, userId) {
        MessageInboxService.getEmailInboxes(size, page, userId, this._inboxStatus, this._disablePagination)
            .then(value => {
                if (this._isMounted) {
                    const modifiedState = this.viewPaginatedResponse(value, this._limit, this.state, this._disablePagination)
                    this.setState(modifiedState)
                }
            })
            .catch(errors => {
                console.error("Errors to fetch email inbox data", errors)
                this.setState({results: [], isLoading: false})
            });
    }

    viewPaginatedResponse(response, limit, currentState, disablePagination) {
        let state = {}
        state.results = response.results
        state.isLoading = false

        this.setState({results: response.results, isLoading: false})

        if (response.totalRecords !== currentState.totalRecords) {
            state.totalRecords = response.totalRecords
        }

        if (!disablePagination) {
            let calculatedTotalPages = Math.ceil(response.totalRecords / limit)
            if (calculatedTotalPages !== currentState.totalPages) {
                state.totalPages = calculatedTotalPages
            }
        }
        return state
    }

    handlePaginationChange(event, value) {
        if (value !== this.state.currentPage) {
            this.getEmailInbox(value - 1, this._limit, this.state.currentUserInfo.userId)
            this.setState({ currentPage: value })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { results, isLoading, totalPages, currentPage, currentUserInfo, totalRecords } = this.state;
        return(
            <div className="body">
                <Navbar />
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-7">
                        <h2 className="title">Email Dashboard</h2>
                        <ComposeMessage currentUserId={currentUserInfo?.userId} />
                        {!isLoading ?
                            <div>
                                {results && results.length > 0 ? results?.map((result, key) => {
                                    return (
                                        <div key={key}>
                                            <Link
                                                  to={{
                                                      pathname: "/viewemail",
                                                      state: {
                                                          currentUser: currentUserInfo,
                                                          emailInboxId: result?.emailInboxId,
                                                          emailId: result?.email?.emailId
                                                      }
                                                  }}

                                                  style={{textDecoration: 'none', color: 'black'}}>
                                                <div className="card">
                                                    <div className="card-header">
                                                        <p id="e-text"><strong>ID:</strong>&nbsp;{result?.emailInboxId}</p>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="message-group">
                                                            {/*<input type="checkbox" id="form-control"/>*/}
                                                            <p id="e-text">
                                                                {result.subjectedUserIds.map((subjectedUser, key) => subjectedUser.fullName).join(", ")}
                                                            </p>
                                                            <EllipsisText id="e-text" text={result?.email?.emailTemplate?.subject}
                                                                          length={ 7 }/>
                                                            <Moment format="DD/MM/YY hh:mm a" id="e-text">
                                                                {result?.latestSentAt}
                                                            </Moment>
                                                        </div>

                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                }) :
                                    <div className="card">
                                        <h3>No Content Available</h3>
                                    </div>
                                }
                                {results && results.length > 0 && totalRecords > 0 ? <div className="col-md-12">
                                    <Pagination count={totalPages} page={currentPage}
                                                onChange={this.handlePaginationChange} style={{marginLeft: '35%'}}/>
                                </div> : "" }
                            </div> :
                            <div className="col-md-12">
                                <h3>Loading...</h3>
                            </div>
                        }
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}
export default EmailDashboard;