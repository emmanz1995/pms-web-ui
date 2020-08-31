import { errorResponseHandler } from "../../Error/ErrorResponseHandler";
import queryString from "querystring";
import { BehaviorSubject } from "rxjs";
import { authHeader } from "../../Util/AuthHeaderUtil";

const accessTokenSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem("token")) ?
        JSON.parse(localStorage.getItem("token")).access_token :
        null
);

const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem("token")) ? 
    JSON.parse(localStorage.getItem("token")).userInfo :
    null
  );

function onLogin(credentials) {
    const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${process.env.REACT_APP_CLIENT_AUTH}`
        },
        body: queryString.stringify({
          "grant_type": "password",
          "username": credentials.username,
          "password": credentials.password
        })
      };

  return fetch(`${process.env.REACT_APP_AUTH_URL}/oauth/token`, requestOptions)
    .then(errorResponseHandler)
    .then(token => getUserInfo(token));
}

function onLogout() {
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] = 'application/json'
    const requestOptions = {
        method: "POST",
        headers: authorizationHeader
    };

    localStorage.clear();
    currentUserSubject.next(null);

    return fetch(`${process.env.REACT_APP_AUTH_URL}/api/v1/auth/logout`, requestOptions)
        .then(errorResponseHandler)
        .then(token => token);

}

function getUserInfo(token) {
    console.log({token })
    localStorage.setItem("token", JSON.stringify(token));
    const userInfo = token.userInfo;
    currentUserSubject.next(userInfo);
    
    return userInfo;
}

function getAccessToken() {
    const token = localStorage.getItem("token");
    if (token) {
        let data = JSON.parse(token);
        return data?.access_token;
    }

    return null;
}

export const authService = {
    onLogin,
    onLogout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
    get accessTokenValue() {
        return accessTokenSubject.value
    },
    getAccessToken
}
