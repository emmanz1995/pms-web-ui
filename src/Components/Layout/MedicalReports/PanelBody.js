import React, { Component } from 'react';
import Upload from "./Upload";
import { authService } from "../../../Service/api/AuthService";
import './MedicalReports.css';
import EllipsisText from 'react-ellipsis-text';

class PanelBody extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUserInfo: null
        }
    }
    componentDidMount() {
        // this._isMounted = true;

        const currentUserInfo = authService.currentUserValue;

        if (currentUserInfo) {
            this.setState({currentUserInfo: currentUserInfo})
            // this.getAssignUser(this.state.currentPage - 1, this._limit, currentUserInfo?.userId);
        }
    }
    render() {
        const {currentUserInfo} = this.state;
        return(
            <div className="main-panel">
                {/*<Upload uploadFromUserId={currentUserInfo?.userId} uploadToUserId={this.props.response?.assignedTo.userId} />*/}
                {/*<div className="row">*/}
                {/*    <a className="btn-document" href="#" style={{textDecoration: 'none', color: '#000'}}>*/}
                {/*        <div className="document-frame">*/}
                {/*            <a href="" title="Doctor Report"><EllipsisText text={"Doctor Report"} length={"7"}/></a>*/}
                {/*        </div>*/}
                {/*    </a>*/}
                {/*    <a className="btn-document" href="#" style={{textDecoration: 'none', color: '#000'}}>*/}
                {/*        <div className="document-frame">*/}
                {/*            <a href="" title="Document"><EllipsisText text={"Document"} length={"7"}/></a>*/}
                {/*        </div>*/}
                {/*    </a>*/}
                {/*    <a className="btn-document" href="#" style={{textDecoration: 'none', color: '#000'}}>*/}
                {/*        <div className="document-frame">*/}
                {/*            <a href="" title="Document"><EllipsisText text={"Document"} length={"7"}/></a>*/}
                {/*        </div>*/}
                {/*    </a>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export default PanelBody;