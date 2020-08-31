import React from 'react';
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import './homepage.css';
import { PrivilegeService } from "../../../Service/PrivilegeService";

class Homepage extends React.Component {
    render() {
        const viewMedicalRecordAccess = PrivilegeService.hasViewMedicalRecordAccess();
        const messageInboxAccess = PrivilegeService.hasMessageInboxAccess();
        return(
            <div>
                <Navbar />
                <div className="row">
                    <div className="col-md-12">
                        <div className="img-home">
                            <img src="/Images/clinic-02.jpg" className="img-banner" alt="banner" />
                            <h3 className="centered-title">Welcome to the Patient-Management-System website</h3>
                        </div><br />
                        <div className="col-md-12">
                            <div className="row d-flex justify-content-center">
                                <div className="col-xs-12 col-md-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="A-title">Access your Profile</h5>
                                            <p>You can access your Personal Profile account by clicking on the profile page button below. In the profile page you will be able to change your password and view your details such as your name and email address.</p>
                                        </div>
                                        <div className="card-footer">
                                            <Link to="/profile" className="home-btn" style={{textDecoration: 'none', color: 'black'}}>Profile Page</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="V-title">View a Document</h5>
                                            <p>Once you have changed your password, you can view your view your medical reports or you can download your the appointment letters that have been lost. If your a doctor you can upload a document to your patient.</p>
                                        </div>
                                        <div className="card-footer">
                                            { viewMedicalRecordAccess ? <Link to="/medicalrecord" className="home-btn" style={{textDecoration: 'none', color: 'black'}}>Medical Records</Link> : 'No Access' }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="S-title">Send a Message</h5>
                                            <p>Access your very own message dashboard where you can view the messages that the other users have sent you. Here you will be able to compose a new message and send your message to an allocated user.</p>
                                        </div>
                                        <div className="card-footer">
                                            { messageInboxAccess ? <Link to="/emaildashboard" className="home-btn" style={{textDecoration: 'none', color: 'black'}}>Send Message</Link> : 'No Access' }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

export default Homepage;