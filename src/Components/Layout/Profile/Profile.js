import React, { Component } from 'react';
import Sidebar from './../Sidebar/sideBar';
import Navbar from '../Navbar/Navbar';
import './Profile.css';
import Footer from './../Footer/Footer';
import '../Sidebar/sidebar.css';
import { authService } from "../../../Service/api/AuthService";
import ChangePassword from './ChangePassword';


class Profile extends Component {
    // userData;
    constructor(props) {
        super(props)
        // sets userInfo as a state
        this.state = {
            // redirect: "false",
            userInfo: null
        }
        // binding all the functions
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    onChange=(e) => {
        // code based on https://medium.com/capital-one-tech/how-to-work-with-forms-inputs-and-events-in-react-c337171b923b
        this.setState({[e.target.name]: e.target.value});
    }
    onSubmit (e) {
        e.preventDefault();
    }
    componentDidMount () {
        // logging to the console currentUser from authService
        console.log(authService.currentUser);
        // injecting currentUser from authService and subscribing a value
        authService.currentUser.subscribe(value => {
            // setting the userInfo as the value that has been subscribed to the currentUser
            this.setState({ userInfo: value })
        });
    }
    render() {
        return (
            <div>
                <Navbar />
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-9">
                        <h2 className="profile-title">User Profile</h2>
                        <div className="edit-profile"><br/>
                            <p id="profile-text"><b>Full Name</b></p>
                            {/* displaying the full name of the user */}
                            <p id="profile-text">{this.state.userInfo?.fullName}</p><hr/><br/>
                            <p id="profile-text"><b>Email</b></p>
                            {/* displaying the username of the user */}
                            <p id="profile-text">{this.state.userInfo?.username}</p><hr/><br/>
                            <p id="profile-text"><b>Password</b></p>
                            <p id="profile-text">xxxxxx</p>
                            {/* using the change password component here and passing userId as a prop */}
                            <ChangePassword userId={this.state.userInfo?.userId} />
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
                /* <BackToTop/> */
        );
    }
}

export default Profile;