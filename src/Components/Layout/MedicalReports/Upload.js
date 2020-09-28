import React, { Component } from 'react';
import './MedicalReports.css';
import SimpleReactValidator from 'simple-react-validator';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { withAlert } from 'react-alert'
import { DocumentService } from "../../../Service/api/DocumentService";

class Upload extends Component {
    // setting the file types inside _fileTypes variable
    _fileTypes = ".doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.pdf,.txt,.jpeg"
    // defining _featureType as MEDICAL_RECORD_FEATURE
    _featureType = "MEDICAL_RECORD_FEATURE"

    constructor(props) {
        super(props);
        // setting all the states here
        this.state = {
            modal: false,
            selectedFile: null,
            uploadToUser: null,
            uploadFromUserId: null,
            validationErrors: []
        }
        // binding all the functions created for medical report
        this.toggle = this.toggle.bind(this);
        this.submit = this.submit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        // set up based on https://www.npmjs.com/package/simple-react-validator
        this.validator = new SimpleReactValidator();
    }
    // creating the toggle function
    toggle(e) {
        e.preventDefault();
        // hides validator messages once the upload button is pressed
        this.validator.hideMessages();
        // clears all of the values once the file is uploaded after hitting the upload button
        this.setState({
            modal: !this.state.modal,
            selectedFile: null,
            uploadToUser: null,
            uploadFromUserId: null,
            validationErrors: []
        })
    }
    // creates the submit function
    submit(e) {
        e.preventDefault();
        // logs upload to user id, upload from user id and selected file onto the console
        console.log(
            `Upload to user id: ${this.props.uploadToUser},
            Upload from user id: ${this.props.uploadFromUserId},
            Selected file: ${this.state.selectedFile}`
        );
        // sets validationErrors as an array
        let validationErrors = [];
        // sets validation error when there is no file select
        if (!this.state.selectedFile) {
            validationErrors.push("File is required")
        }
        // sets validation error when there is a problem retrieving uploadToUser userId
        if (!this.props.uploadToUser?.userId) {
            validationErrors.push("uploadToUser is required")
        }
        // sets validation error when there is a problem retrieving uploadFromUser userId
        if (!this.props.uploadFromUserId) {
            validationErrors.push("UploadFromUserId is required")
        }

        // pass this back to medical report.js
        validationErrors.length <= 0 && DocumentService
            // injected onFileUpload from DocumentService
            .onFileUpload(this.state.selectedFile, this.props.uploadToUser.userId, this.props.uploadFromUserId, this._featureType)
            // setting a success promise that will alert out a message if file was successfully uploaded
            // code based on https://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example and https://www.npmjs.com/package/react-alert
            .then(success => {
                this.props.alert.success(`File has been uploaded for user with email: ${this.props.uploadToUser.email}`);
                this.setState({modal: !this.state.modal})
            })
            // handles error when there is a error that occurs
            .catch(fail => {
                console.log(fail);
                this.setState({validationErrors: [fail]});
            })
        // sets length for validationErrors and sets
        validationErrors.length > 0 && this.setState({validationErrors: validationErrors});

    }
    // code based on https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
    onFileChange(e) {
        const selectedFile = e.target.files[0];

        let validationErrors = [];

        if (selectedFile && !selectedFile.name) {
            validationErrors.push("File is required")
        }

        if (selectedFile.size > 2e6) {
            validationErrors.push("File size limit exceeded, uploading file size should be below 2MB");
        }

        if (!this._fileTypes.includes(selectedFile.name.split('.').pop())) {
            validationErrors.push("Supported file types are doc,docx,ppt,pptx,xls,xlsx,png,jpg,pdf,txt and jpeg");
        }

        if (!selectedFile.name.split('.').slice(0, -1).join('.').match("^[0-9a-zA-Z_\\-. ]+\$")) {
            validationErrors.push("File name must only contain letters(a-z, A-Z), numbers (0-9), spaces and symbols (_-.)");
        }

        if (validationErrors.length > 0) {
            this.setState({ fileErrors:  validationErrors });
            return false;
        }

        this.setState({ selectedFile: selectedFile })
    }

    render() {
        return (
            <div>
                <button id="btn-upload" value="" onClick={this.toggle}>Upload File</button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className="main-modal" style={{height:'550px'}}>
                    <ModalHeader className="modal-header" toggle={this.toggle}>Upload Patient Documents</ModalHeader>
                    <ModalBody className="modal-background">
                        <div className="alert alert-danger" role="alert" style={{ display: (this.state.validationErrors?.length > 0 ? 'block' : 'none'), width:'100%' }} >
                            {this.state.validationErrors?.join(", ")}
                        </div>
                        <input type="file" name="files" id="file" accept={this._fileTypes} onChange={this.onFileChange} />
                    </ModalBody>
                    <ModalFooter className="modal-footer">
                        <Button color="primary" onClick={this.submit}><b>Upload</b></Button>{' '}
                        <Button color="secondary" onClick={this.toggle}><b>Cancel</b></Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default withAlert()(Upload);