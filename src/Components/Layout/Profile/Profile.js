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
        this.state = {
            // redirect: "false",
            userInfo: null
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onChange=(e)=>{
        this.setState({[e.target.name]: e.target.value});
    }
    onSubmit (e) {
        e.preventDefault();
    }

    componentDidMount () {
        console.log(authService.currentUser);
        authService.currentUser.subscribe(value => {
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
                            <p id="profile-text">{this.state.userInfo?.fullName}</p><hr/><br/>
                            <p id="profile-text"><b>Email</b></p>
                            <p id="profile-text">{this.state.userInfo?.username}</p><hr/><br/>
                            <p id="profile-text"><b>Password</b></p>
                            <p id="profile-text">xxxxxx</p>
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