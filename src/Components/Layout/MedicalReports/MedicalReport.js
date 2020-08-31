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
    _isMounted = false;
    _disablePagination = false;
    _limit = 5
    _featureType = "MEDICAL_RECORD_FEATURE"

    constructor(props) {
        super(props);
        this.state= {
            isLoading: true,
            results: [],
            currentPage: 1,
            totalRecords: 0,
            totalPages: 0
        }

        this.handlePaginationChange = this.handlePaginationChange.bind(this);
        this.getUserUploadBy = this.getUserUploadBy.bind(this);
        this.getFileType = this.getFileType.bind(this);
        this.downloadMedicalReport = this.downloadMedicalReport.bind(this);
    }

    getMedicalRecords(page, size) {
        const { uploadToUser, uploadFromUser } = this.props.location.state
        DocumentService.getFiles(size, page, this._featureType, null,
            null, this._disablePagination, [uploadFromUser.userId, uploadToUser.userId], [], [ "createdAt,DESC" ])
            .then(value => {
                if (this._isMounted) {
                    const modifiedState = this.viewPaginatedResponse(value, this._limit, this.state)
                    this.setState(modifiedState)
                }
            }).catch(fail => {
            console.error("Errors to fetch documents", fail)
            this.setState({results: [], isLoading: false,})
        })
    }

    viewPaginatedResponse(response, limit, currentState) {
        let state = {}
        state.results = response.results
        state.isLoading = false

        this.setState({results: response.results, isLoading: false, expanded: false})

        if (response.totalRecords !== currentState.totalRecords) {
            state.totalRecords = response.totalRecords
        }

        if (!currentState.disablePagination) {
            let calculatedTotalPages = Math.ceil(response.totalRecords / limit)
            if (calculatedTotalPages !== currentState.totalPages) {
                state.totalPages = calculatedTotalPages
            }
        }
        return state
    }

    getUserUploadBy(uploadFromUserId) {
        const { uploadToUser, uploadFromUser } = this.props.location.state

        if (uploadToUser && uploadFromUserId && uploadFromUserId == uploadToUser.userId) {
            return `${uploadToUser?.firstName} ${uploadToUser?.lastName} (${uploadToUser.email})`
        }

        if (uploadFromUser && uploadFromUserId && uploadFromUserId == uploadFromUser.userId) {
            return `You (${uploadFromUser.username})`
        }

        return "N/A"
    }

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

    downloadMedicalReport = (documentRecord) => (event) => {
        event.preventDefault();
        console.log(`download file click ${documentRecord.documentId}`)
        DocumentService.onFileDownload(documentRecord.documentId)
            .then(blob => {
                let url = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = `${documentRecord.fileName}.${documentRecord.fileType}`;
                a.click();
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
        const { uploadToUser, uploadFromUser } = this.props.location.state
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
