import React, { Component } from 'react';
import './MedicalReports.css';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/sideBar';
import Upload from './Upload';
import Footer from '../Footer/Footer';
import { AccountService } from "../../../Service/api/AccountService";
import { authService } from "../../../Service/api/AuthService";
import Pagination from "@material-ui/lab/Pagination"
import { Link } from 'react-router-dom';
import { PrivilegeService } from "../../../Service/PrivilegeService";

class MedicalRecord extends Component {
    _isMounted = false;
    _limit = 5

    constructor(props) {
        super(props);
        this.state= {
            isLoading: true,
            disablePagination: false,
            currentUserInfo: null,
            results: [],
            currentPage: 1,
            totalRecords: 0,
            totalPages: 0
        }

        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;

        const currentUserInfo = authService.currentUserValue;

        if (currentUserInfo) {
            this.setState({currentUserInfo: currentUserInfo })
            this.getAssignUser(this.state.currentPage - 1, this._limit, currentUserInfo?.userId);
        }
    }

    getAssignUser(page, size, userId) {
        AccountService.getAssignUsers(page, size, userId, "MEDICAL_RECORD_FEATURE", this.state.disablePagination)
            .then(value => {
                if (this._isMounted) {
                    const modifiedState = this.viewPaginatedResponse(value.assignedToPaginatedResponse, this._limit, this.state)
                    this.setState(modifiedState)
                }
            })
            .catch(errors => {
                console.error("Errors to fetch assigned users", errors)
                this.setState({results: [], isLoading: false})
            });
    }

    viewPaginatedResponse(response, limit, currentState) {
            let state = {}
            state.results = response.results
            state.isLoading = false

            this.setState({results: response.results, isLoading: false})

            if (response.totalRecords !== currentState.totalRecords) {
                state.totalRecords = response.totalRecords
                // this.setState({totalRecords: response.totalRecords});
            }

            if (!currentState.disablePagination) {
                let calculatedTotalPages = Math.ceil(response.totalRecords / limit)
                if (calculatedTotalPages !== currentState.totalPages) {
                    state.totalPages = calculatedTotalPages
                    // this.setState({totalPages: calculatedTotalPages})
                }
            }
            return state
    }

    handlePaginationChange(event, value) {
        if (value !== this.state.currentPage) {
            this.getAssignUser(value - 1, this._limit, this.state.currentUserInfo.userId, false)
            this.setState({ currentPage: value })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { results, currentPage, totalPages, isLoading, currentUserInfo, totalRecords } = this.state;
        const uploadMedicalRecordAccess = PrivilegeService.hasUploadMedicalRecordAccess();
        console.log(uploadMedicalRecordAccess);
        return (
            <div>
                <Navbar/>
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-7">
                        <div className="medical-report-title">
                            <h2>Medical Records</h2>
                        </div>
                        {!isLoading ?
                            <div className="panel-section">
                                {results && results.length > 0 ? results.map((response, key ) => (
                                    <Link key={key} to={{
                                        pathname: "/medicalreport",
                                        state: {
                                            uploadFromUser: currentUserInfo,
                                            uploadToUser: response?.assignedTo
                                        }
                                    }} style={{textDecoration: 'none', color: 'black'}}>
                                        <div className="card" key={key}>
                                            <div className="card-body" key={response?.assignedTo.userId}>
                                                <p id="medical-text">Records between You and {response?.assignedTo.firstName} {response?.assignedTo.lastName} ({response?.assignedTo.email})</p>
                                            </div>
                                            {uploadMedicalRecordAccess && <div className="card-footer">
                                                <Upload uploadFromUserId={currentUserInfo?.userId} uploadToUser={response?.assignedTo} />
                                            </div>}
                                        </div>
                                    </Link>
                                )):
                                    <div className="card">
                                        <h3>No Content Available</h3>
                                    </div>
                                }
                                {results && results.length > 0 && totalRecords > 0 ? <div>
                                    <Pagination count={totalPages} page={currentPage} onChange={this.handlePaginationChange} style={{marginLeft: '35%'}}/>
                                </div> : "" }
                            </div> :
                            <div className="panel-section"> <h3>Loading...</h3> </div>
                        }
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default MedicalRecord;