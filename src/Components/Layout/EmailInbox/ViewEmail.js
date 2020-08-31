import React, { Component } from 'react';
// import ViewEmailData from "./ViewEmailData";
import Sidebar from "../Sidebar/sideBar";
import Navbar from '../Navbar/Navbar';
import Footer from "../Footer/Footer";
import { MessageInboxService } from "../../../Service/api/MessageInboxService";
import { BreadcrumbItem, Breadcrumb } from "reactstrap";
import { Link } from "react-router-dom";
import './EmailDashboard.css';

class ViewEmail extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            emailData: {}
        }
    }
    componentDidMount() {
        this._isMounted = true;

        const { emailId } = this.props.location.state

        MessageInboxService.getEmail(emailId)
            .then(value => {
                    this._isMounted && this.setState({emailData: value})
            })
            .catch(errors => console.error(`Errors to fetch email for ${emailId}`, errors))

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { emailData } = this.state;
        const { emailInboxId } = this.props.location.state
        return(
            <div>
                <Navbar />
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <h2 className="view-title">View Email</h2>
                        <Breadcrumb className="mess-bread">
                            <BreadcrumbItem><Link to="/emaildashboard">EmailDashboard</Link></BreadcrumbItem>
                            <BreadcrumbItem>View message</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="panel panel-default">
                            <div className="panel-body2">
                                <p style={{marginLeft:'14px'}}><b>ID no:</b>&nbsp;{emailInboxId}&nbsp;&nbsp;<b>From:&nbsp;</b>{emailData?.fromUser?.fullName}</p>
                                <p style={{marginLeft:'14px'}}>{emailData?.emailTemplate?.subject}</p>
                                <p style={{marginLeft:'14px'}}>{emailData?.message}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

export default ViewEmail;