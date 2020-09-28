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
    // setting isMounted to false
    _isMounted = false;
    // setting _limit for pagination to 5
    _limit = 5

    constructor(props) {
        super(props);
        // setting all the states here
        this.state= {
            isLoading: true,
            disablePagination: false,
            currentUserInfo: null,
            results: [],
            currentPage: 1,
            totalRecords: 0,
            totalPages: 0
        }
        // binding the handlePaginationChange function
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        // idea of this code was based here https://www.9lessons.info/2017/10/reactjs-php-restful-api-token.html
        // created the currentUserInfo as a constable and attached it to currentUserValue
        const currentUserInfo = authService.currentUserValue;

        if (currentUserInfo) {
            // set the currentUserInfo state to currentUserInfo which is currentUserValue
            this.setState({currentUserInfo: currentUserInfo })
            // setting getAssignUser with currentPage, _limit and userId
            this.getAssignUser(this.state.currentPage - 1, this._limit, currentUserInfo?.userId);
        }
    }
    // creating getAssignUser function with page, size, userId as its arguments
    getAssignUser(page, size, userId) {
        // injecting getAssignUsers function from AccountService with all its url params
        AccountService.getAssignUsers(page, size, userId, "MEDICAL_RECORD_FEATURE", this.state.disablePagination)
            // https://www.valentinog.com/blog/await-react/
            .then(value => {
                if (this._isMounted) {
                    const modifiedState = this.viewPaginatedResponse(value.assignedToPaginatedResponse, this._limit, this.state)
                    this.setState(modifiedState)
                }
            })
            // handles error when there is a error that occurs
            .catch(errors => {
                // logs error onto the console
                console.error("Errors to fetch assigned users", errors)
                this.setState({results: [], isLoading: false})
            });
    }
    // function handles paginated response for medical records page
    // https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react
    viewPaginatedResponse(response, limit, currentState) {
            // sets the state as an object
            let state = {}
            state.results = response.results
            state.isLoading = false
            // sets results to response.results and sets isLoading to false
            this.setState({results: response.results, isLoading: false})
            // code based on https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react
            if (response.totalRecords !== currentState.totalRecords) {
                state.totalRecords = response.totalRecords
                // this.setState({totalRecords: response.totalRecords});
            }

            if (!currentState.disablePagination) {
                // code based on https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react
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
        // sets _isMounted to false once component has unmounted
        this._isMounted = false;
    }

    render() {
        const { results, currentPage, totalPages, isLoading, currentUserInfo, totalRecords } = this.state;
        // injects hasUploadMedicalRecordAccess from PrivilegeService and sets up uploadMedicalRecordAccess to be used
        const uploadMedicalRecordAccess = PrivilegeService.hasUploadMedicalRecordAccess();
        // logs to the console the uploadMedicalRecordAccess result
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
                                {/* maps results from documentService */}
                                {/* code based on https://www.valentinog.com/blog/await-react/ */}
                                {results && results.length > 0 ? results.map((response, key ) => (
                                    // sets up the path name that will be used to navigate through the app
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
                                {/* displays the pagination */}
                                {/* https://medium.com/how-to-react/create-pagination-in-reactjs-e4326c1b9855 */}
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