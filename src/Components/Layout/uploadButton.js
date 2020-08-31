import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const uploadButton = (props) => {
    const {
        buttonLabel,
        className
    } = props;

const [modal, setModal] = useState(false);

const toggle = () => setModal (!modal);

return (
    <div>
        <Button color="danger" onClick={toggle}>Upload a Document</Button>
        <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>Upload your file</ModalHeader>
            <ModalBody>
                <input type="file" name="file"/>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>Upload</Button>
            </ModalFooter>
        </Modal>
    </div>
);

};

export default uploadButton;