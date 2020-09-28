import React, {Component} from 'react';
import './App.css';
import { Switch, Route, Router } from 'react-router-dom';
import LoginForm from './Components/Layout/Login/LoginForm';
import ConfirmEmail from './Components/Layout/Login/ConfirmEmail';
import ResetPassword from './Components/Layout/Login/ResetPassword';
import Homepage from './Components/Layout/Homepage/Homepage';
import Profile from './Components/Layout/Profile/Profile';
import MedicalRecord from './Components/Layout/MedicalReports/MedicalRecord';
import MedicalReport from './Components/Layout/MedicalReports/MedicalReport';
import EmailInbox from './Components/Layout/EmailInbox/EmailDashboard';
import ViewEmail from "./Components/Layout/EmailInbox/ViewEmail";
import UnauthorisedError from "./Components/Layout/Error/UnauthorisedError";
import { PrivateRoute } from './Components/Layout/PrivateRoute';
import { authService } from "./Service/api/AuthService";
import { PrivilegeService } from "./Service/PrivilegeService";
import { history } from "./Util/HistoryUtil";
import { withAlert } from 'react-alert'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    authService.currentUser.subscribe(value =>
      this.setState({ currentUser: value })
    );
  }
// handling the routes of the different pages
  render(){
    return (
      <div className="App">
        <Router history={history}>
          <Switch>            
            <Route exact path="/confirm-email" component={props => <ConfirmEmail {...props} alert={this.props.alert} />} />
            <Route exact path="/password-reset/:passwordResetToken" component={props => <ResetPassword {...props} alert={this.props.alert} />} />
            <PrivateRoute exact path="/home" component={props => <Homepage {...props} alert={this.props.alert} />} />
            <PrivateRoute exact path="/profile" component={props => <Profile {...props} alert={this.props.alert} />} />
            <Route exact path="/" component={props => <LoginForm {...props} alert={this.props.alert} />} />
            <PrivateRoute exact path="/medicalrecord" isAuthorised={PrivilegeService.hasViewMedicalRecordAccess()} component={props => <MedicalRecord {...props} alert={this.props.alert} />} />
            <PrivateRoute exact path="/emaildashboard" isAuthorised={PrivilegeService.hasMessageInboxAccess()} component={props => <EmailInbox {...props} alert={this.props.alert} />} />
            <PrivateRoute exact path="/viewemail" isAuthorised={PrivilegeService.hasMessageInboxAccess()} component={props => <ViewEmail {...props} alert={this.props.alert}/>} />
            <PrivateRoute exact path="/medicalreport" isAuthorised={PrivilegeService.hasViewMedicalRecordAccess()} component={props => <MedicalReport {...props} alert={this.props.alert}/>} />
            <Route path='*' exact={true} component={UnauthorisedError} />
          </Switch>
        </Router>
      </div>
    );
  }
  };
  
export default withAlert()(App)
