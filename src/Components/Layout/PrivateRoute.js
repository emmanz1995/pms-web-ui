import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "../../Service/api/AuthService";

// https://tylermcginnis.com/react-router-protected-routes-authentication/ and https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example
// this class sets up a private route for restricted pages
export const PrivateRoute = ({ component: Component, isAuthorised, ...rest }) => (
    <Route {...rest}  render={props => {
        const currentUser = authService.currentUserValue;
        // directs user back to the login page if not signed in
        if (!currentUser) {
            return (<Redirect to={{ pathname: "/", state: { from: props.location } }} />);
        }
        // directs user to error page
        if (typeof isAuthorised !== 'undefined' && !isAuthorised) {
            return <Redirect to={{ pathname: '/error'}} />
        }


        return <Component {...props} />;

      }
    }
    />
);
