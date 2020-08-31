import React, { Component } from 'react';
import './MedicalReports.css';
import SimpleReactValidator from 'simple-react-validator';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { withAlert } from 'react-alert'
import { DocumentService } from "../../../Service/api/DocumentService";

class Upload extends Component {

    _fileTypes = ".doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.pdf,.txt,.jpeg"
    _featureType = "MEDICAL_RECORD_FEATURE"

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            selectedFile: null,
            uploadToUser: null,
            uploadFromUserId: null,
            validationErrors: []
        }
        this.toggle = this.toggle.bind(this);
        this.submit = this.submit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.validator = new SimpleReactValidator();
    }

    toggle(e) {
        e.preventDefault();
        this.validator.hideMessages();
        this.setState({
            modal: !this.state.modal,
            selectedFile: null,
            uploadToUser: null,
            uploadFromUserId: null,
            validationErrors: []
        })
    }

    submit(e) {
        e.preventDefault();

        console.log(
            `Upload to user id: ${this.props.uploadToUser},
            Upload from user id: ${this.props.uploadFromUserId},
            Selected file: ${this.state.selectedFile}`
        );

        let validationErrors = [];

        if (!this.state.selectedFile) {
            validationErrors.push("File is required")
        }

        if (!this.props.uploadToUser?.userId) {
            validationErrors.push("uploadToUser is required")
        }

        if (!this.props.uploadFromUserId) {
            validationErrors.push("UploadFromUserId is required")
        }

        // pass this back to medical report.js
        validationErrors.length <= 0 && DocumentService
            .onFileUpload(this.state.selectedFile, this.props.uploadToUser.userId, this.props.uploadFromUserId, this._featureType)
            .then(success => {
                this.props.alert.success(`File has been uploaded for user with email: ${this.props.uploadToUser.email}`);
                this.setState({modal: !this.state.modal})
            })
            .catch(fail => {
                console.log(fail);
                this.setState({validationErrors: [fail]});
            })

        validationErrors.length > 0 && this.setState({validationErrors: validationErrors});

    }

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