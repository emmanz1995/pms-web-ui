import React from 'react';
import EllipsisText from 'react-ellipsis-text';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/sideBar';
import { Link } from 'react-router-dom';
import { DocumentService } from "../../../Service/api/DocumentService"
import { PrivilegeService } from "../../../Service/PrivilegeService";
import './MedicalReports.css'
import Pagination from "@material-ui/lab/Pagination"
import Moment from "react-moment";
import {Breadcrumb, BreadcrumbItem} from "reactstrap";

class MedicalReport extends React.Component {
    // setting isMounted to false
    _isMounted = false;
    // setting _disablePagination for pagination to false
    _disablePagination = false;
    // setting _limit for pagination to 5
    _limit = 5
    // defining _featureType as MEDICAL_RECORD_FEATURE
    _featureType = "MEDICAL_RECORD_FEATURE"

    constructor(props) {
        super(props);
        // setting all the states here
        this.state= {
            isLoading: true,
            results: [],
            currentPage: 1,
            totalRecords: 0,
            totalPages: 0
        }
        // binding all the functions created for medical report
        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.getUserUploadBy = this.getUserUploadBy.bind(this);
        this.getFileType = this.getFileType.bind(this);
        // set up based on https://www.npmjs.com/package/simple-react-validator
        this.downloadMedicalReport = this.downloadMedicalReport.bind(this);
    }
    // creating getMedicalRecords function with page and size as arguments
    getMedicalRecords(page, size) {
        // defining uploadToUser, uploadFromUser as props in this function
        const { uploadToUser, uploadFromUser } = this.props.location.state
        // injecting getFiles function from DocumentService with all it url params passed as arguments
        DocumentService.getFiles(size, page, this._featureType, null,
            null, this._disablePagination, [uploadFromUser.userId, uploadToUser.userId], [], [ "createdAt,DESC" ])
            // https://www.valentinog.com/blog/await-react/
            .then(value => {
                if (this._isMounted) {
                    const modifiedState = this.viewPaginatedResponse(value, this._limit, this.state)
                    this.setState(modifiedState)
                }
            // handles error when there is a error that occurs
            }).catch(fail => {
            // logs error onto the console
            console.error("Errors to fetch documents", fail)
            this.setState({results: [], isLoading: false,})
        })
    }
    // function handles paginated response for medical records page
    // https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react
    viewPaginatedResponse(response, limit, currentState) {
        // sets the state as an object
        let state = {}
        state.results = response.results
        state.isLoading = false
        // sets results to response.results and sets isLoading to false
        this.setState({results: response.results, isLoading: false, expanded: false})
        // code based on https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react
        if (response.totalRecords !== currentState.totalRecords) {
            state.totalRecords = response.totalRecords
        }

        if (!currentState.disablePagination) {
            // code based on https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react
            // calculates the pages total with math ceil
            let calculatedTotalPages = Math.ceil(response.totalRecords / limit)
            if (calculatedTotalPages !== currentState.totalPages) {
                state.totalPages = calculatedTotalPages
            }
        }
        return state
    }

    getUserUploadBy(uploadFromUserId) {
        // defining uploadToUser, uploadFromUser as props in this function
        const { uploadToUser, uploadFromUser } = this.props.location.state
        // returns uploadToUser, firstName and uploadToUser, lastName and uploadToUser, email if uploadToUser and uploadFromUserId and uploadFromUserId are equal to uploadToUser.userId
        if (uploadToUser && uploadFromUserId && uploadFromUserId == uploadToUser.userId) {
            return `${uploadToUser?.firstName} ${uploadToUser?.lastName} (${uploadToUser.email})`
        }
        // returns the uploadFromUser username if uploadToUser and uploadFromUserId and uploadFromUserId are equal to uploadToUser.userId this will be displayed at the top of the page
        if (uploadFromUser && uploadFromUserId && uploadFromUserId == uploadFromUser.userId) {
            return `You (${uploadFromUser.username})`
        }

        return "N/A"
    }
    // switch statement which will switch the icons of the file type depending on the type of file being displayed
    // code based on https://www.w3schools.com/js/js_switch.asp
    getFileType(fileType) {
        switch (fileType) {
            case "txt":
            case "doc":
            case "docx":
                return "fas fa-file-word"
            case "ppt":
            case "pptx":
                return "fas fa-file-powerpoint"
            case "xls":
            case "xlsx":
                return "fas fa-file-excel"
            case "pdf":
                return "fas fa-file-pdf"
            case "png":
            case "jpg":
            case "jpeg":
                return "fas fa-file-image"
            default:
                return "fas fa-file"
        }
    }

    handlePaginationChange(event, value) {
        if (value !== this.state.currentPage) {
            this.getMedicalRecords(value - 1, this._limit)
            this.setState({ currentPage: value })
        }
    }
    // creates the downloadMedicalReport function with event and documentRecord
    downloadMedicalReport = (documentRecord) => (event) => {
        event.preventDefault();
        // logs the documentId to the console
        console.log(`download file click ${documentRecord.documentId}`)
        // injects onFileDownload from DocumentService with documentId
        DocumentService.onFileDownload(documentRecord.documentId)
            // code based on https://stackoverflow.com/questions/46700166/how-to-display-image-blob-for-react-native
            .then(blob => {
                let url = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = `${documentRecord.fileName}.${documentRecord.fileType}`;
                a.click();
            // handles error when there is a error that occurs
            }).catch(fail => {
            console.error("Error to download document", fail)
        });
    }

    componentDidMount() {
        this._isMounted = true;
        this.getMedicalRecords(this.state.currentPage - 1, this._limit);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        // defining uploadToUser, uploadFromUser as props to be used in the return method
        const { uploadToUser, uploadFromUser } = this.props.location.state
        // defining results, currentPage, totalPages, isLoading, totalRecords as states to be used in the return method
        const { results, currentPage, totalPages, isLoading, totalRecords } = this.state;

        return(
            <div>
                <Navbar />
                <div className="row">
                    <div className="col-md-3">
                        <Sidebar />
                    </div>
                    <div className="col-md-7">
                        <h1 style={{textAlign: 'left'}}>Medical Reports</h1>
                        <Breadcrumb className="med-bread">
                            <BreadcrumbItem><Link to="/medicalrecord">Medical Records</Link></BreadcrumbItem>
                            <BreadcrumbItem>Medical Reports</BreadcrumbItem>
                        </Breadcrumb>
                {!isLoading ?
                    <div className="col-md-12">
                        <table className="table" style={{width: '40%'}}>
                            <thead>
                            <tr>
                                <th colspan="5" style={{textAlign: 'left'}}>Reports between <p className="badge badge-primary">{this.getUserUploadBy(uploadFromUser?.userId)}</p> and <p className="badge badge-secondary">{this.getUserUploadBy(uploadToUser?.userId)}</p></th>
                            </tr>
                            <tr>
                                <th>File Name</th>
                                <th>Create At</th>
                                <th>File Type</th>
                                <th>Uploaded By</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* code based on https://www.valentinog.com/blog/await-react/ */}
                            {results.map((response, key ) => (
                            <tr key={key}>
                                <td><p title={response.fileName}><EllipsisText text={response.fileName} length={7}/></p></td>
                                <td>
                                <Moment format="DD/MM/YY hh:mm a">
                                    {response?.createdAt}
                                </Moment>
                                </td>
                                <td><p><i className={this.getFileType(response.fileType)}/></p></td>
                                <td>{this.getUserUploadBy(response.uploadFromUserId)}</td>
                                <td>{PrivilegeService.hasDownloadMedicalRecordAccess && <Link to="" onClick={this.downloadMedicalReport(response)}>Download</Link>}</td>
                            </tr>
                             ))}
                            </tbody>
                        </table>
                        {/* displays the pagination */}
                        {/* https://medium.com/how-to-react/create-pagination-in-reactjs-e4326c1b9855 */}
                        {results && results.length > 0 && totalRecords > 0 ?<div className="col-md-12">
                            <Pagination count={totalPages} page={currentPage} shape="rounded" onChange={this.handlePaginationChange} />
                        </div>: "" }
                    </div> :
                    <div className="col-md-12">
                        <h3>Loading...</h3>
                    </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default MedicalReport;
