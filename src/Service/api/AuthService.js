import { errorResponseHandler } from "../../Error/ErrorResponseHandler";
import queryString from "querystring";
import { BehaviorSubject } from "rxjs";
import { authHeader } from "../../Util/AuthHeaderUtil";

// creating the accessTokenSubject for storing the token in the local storage
// code based on https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example
const accessTokenSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem("token")) ?
        JSON.parse(localStorage.getItem("token")).access_token :
        null
);

// creating the currentUserSubject for storing the token in the local storage
const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem("token")) ? 
    JSON.parse(localStorage.getItem("token")).userInfo :
    null
  );

// code based on https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example
// handling the login function
function onLogin(credentials) {
    const requestOptions = {
        // making a POST request
        method: "POST",
        // setting the headers
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${process.env.REACT_APP_CLIENT_AUTH}`
        },
        // setting the request body for oauth
        body: queryString.stringify({
          "grant_type": "password",
          "username": credentials.username,
          "password": credentials.password
        })
      };
  // fetching the url for oauth token stored in an env variable and requestOptions
  return fetch(`${process.env.REACT_APP_AUTH_URL}/oauth/token`, requestOptions)
     // handles error of the fetch request
    .then(errorResponseHandler)
    .then(token => getUserInfo(token));
}

// handling the log out function
function onLogout() {
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting the authHeader with a content-type of application json
    authorizationHeader['content-type'] = 'application/json'
    const requestOptions = {
        // making a POST request
        method: "POST",
        // defining the header as authorizationHeader
        headers: authorizationHeader
    };
    // clearing token details from local storage
    localStorage.clear();
    currentUserSubject.next(null);
    // fetching the url stored in an env variable and requestOptions
    return fetch(`${process.env.REACT_APP_AUTH_URL}/api/v1/auth/logout`, requestOptions)
        // handles error of the fetch request
        .then(errorResponseHandler)
        .then(token => token);

}
// adding user's info to local storage through token
// code based on https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example
function getUserInfo(token) {
    console.log({token })
    // adding the token to the local storage
    localStorage.setItem("token", JSON.stringify(token));
    // setting userInfo variable to token userInfo
    const userInfo = token.userInfo;
    // adding userInfo to currentUserSubject
    currentUserSubject.next(userInfo);
    
    return userInfo;
}

// storing the token in the local storage
function getAccessToken() {
    const token = localStorage.getItem("token");
    if (token) {
        let data = JSON.parse(token);
        return data?.access_token;
    }

    return null;
}

// exporting all the functions of AuthService.js
// based on https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example
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
