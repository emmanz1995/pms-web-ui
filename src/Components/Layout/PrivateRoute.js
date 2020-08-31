import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "../../Service/api/AuthService";

// https://tylermcginnis.com/react-router-protected-routes-authentication/
export const PrivateRoute = ({ component: Component, isAuthorised, ...rest }) => (
    <Route {...rest}  render={props => {
        const currentUser = authService.currentUserValue;

        if (!currentUser) {
            return (<Redirect to={{ pathname: "/", state: { from: props.location } }} />);
        }

        if (typeof isAuthorised !== 'undefined' && !isAuthorised) {
            return <Redirect to={{ pathname: '/error'}} />
        }


        return <Component {...props} />;

      }
    }
    />
);
