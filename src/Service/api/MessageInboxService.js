import { authHeader } from "../../Util/AuthHeaderUtil";
import { errorResponseHandler } from '../../Error/ErrorResponseHandler';
import { authService } from "./AuthService";
import Stomp from 'stompjs';

function onComposeNewMessage(compose){
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting the authHeader with a content-type of application json
    authorizationHeader['content-type'] = 'application/json'
    const requestOptions = {
        // making a POST request
        method: 'POST',
        // defining the header as authorizationHeader
        headers: authorizationHeader,
        // adding compose as a body request parameter
        body: JSON.stringify(compose)
    };
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/api/v1/emails/compose-new`)
    // fetching url and requestOptions
    return fetch(url, requestOptions)
        // handling error
        .then(errorResponseHandler)
}

function getEmail(emailId){
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting the authHeader with a content-type of application json
    authorizationHeader['content-type'] = 'application/json'
    const requestOptions = {
        // making a GET request
        method: 'GET',
        // defining the header as authorizationHeader
        headers: authorizationHeader
    };

    // define url as a let variable and adding the url for the client to connect to the api and fetch emailId
    let url = new URL(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/api/v1/emails/${emailId}`)

    // fetching url and requestOptions
    return fetch(url, requestOptions)
        // handling error
        .then(errorResponseHandler)
}

function getUserContacts(size, page, userId, disablePagination = false, sorts = []) {
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting the authHeader with a content-type of application json
    authorizationHeader['content-type'] ='application/json'
    const requestOptions= {
        // making a GET request
        method: 'GET',
        // defining the header as authorizationHeader
        headers: authorizationHeader,
    };
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/api/v1/user-contacts`)

    // this code is based on https://stackoverflow.com/questions/42236837/how-to-perform-a-search-with-conditional-where-parameters-using-sequelize
    // writing conditional statements to be able to dynamically append parameters into the url and setting them inside the searchParam object for the url
    // these param fields are only sorted into conditional
    let searchParams = url.searchParams;

    searchParams.set("disablePagination", disablePagination.toString()) // converts disablePagination into a string value

    if (!disablePagination) {
        searchParams.set("page", page.toString()); // converts page into a string value
        searchParams.set("size", size.toString()); // converts size into a string value
    }

    searchParams.set("userId", userId.toString()); // converts user is into a string value

    if (sorts != null && sorts.length > 0) {
        sorts.forEach(sort => searchParams.append("sort", sort));
    }
    // sets up the url params search for the fetch url and is also converted into a string value
    url.search = searchParams.toString();
    // logging to the console the get email inbox url once user has accessed the message inbox dashboard
    console.log(`getUserContacts url: ${url.toString()}`);
    // fetching url and requestOptions
    return fetch (url.toString(), requestOptions)
        .then(errorResponseHandler)
}

function getEmailInboxes(size, page, userId, inboxStatus, disablePagination = false, sorts= ["latestSentAt,desc"]){
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting the authHeader with a content-type of application json
    authorizationHeader['content-type'] ='application/json'
    const requestOptions = {
        // making a GET request
        method: "GET",
        // defining the header as authorizationHeader
        headers: authorizationHeader,
    };
    // writing the url for email inbox using the message inbox env variable from the environments
    let url = new URL(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/api/v1/email-inboxes`)

    let searchParams = url.searchParams;

    // this code is based on https://stackoverflow.com/questions/42236837/how-to-perform-a-search-with-conditional-where-parameters-using-sequelize
    // writing conditional statements to be able to dynamically append parameters into the url and setting them inside the searchParam object for the url
    // these param fields are only sorted into conditional
    if (userId != null) {
        searchParams.set("userId", userId.toString()); // converts userId into a string value
    }

    if (inboxStatus != null) {
        searchParams.set("inboxStatus", inboxStatus.toString()); // converts inboxStatus into a string value
    }

    searchParams.set("disablePagination", disablePagination.toString()) // converts disablePagination into a string value

    if (!disablePagination) {
        searchParams.set("page", page.toString()); // converts page into a string value
        searchParams.set("size", size.toString()); // converts size into a string value
    }

    if (sorts != null && sorts.length > 0) {
        sorts.forEach(sort => searchParams.append("sort", sort)); // mapping sorts in a foreach
    }

    url.search = searchParams.toString();
    // logging to the console the get email inbox url once user has accessed the message inbox dashboard
    console.log(`getEmailInboxes url: ${url.toString()}`);
    // fetching url and requestOptions
    return fetch (url.toString(), requestOptions)
        // handling error
        .then(errorResponseHandler);
}
// sock.js and stompClient set up
// idea of code based on https://stomp-js.github.io/stomp-websocket/codo/extra/docs-src/Usage.md.html
function stompClient() {
    // getting access to the access token
    const accessToken = authService.getAccessToken()
    // if token is active then the sockjs client will set up
    if (accessToken) {
        console.log("setting up sockjs client")
        // sockjs variable needs sockjs-client which is dependency
        let SockJS = require('sockjs-client')
        // sockjs connecting to url
        SockJS = new SockJS(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/ws?access_token=${accessToken}`)
        // this code based on https://www.dariawan.com/tutorials/spring/create-spring-boot-websocket-app-using-stomp-and-sockjs/
        let stompClient = Stomp.over(SockJS);
        // disable debug messages using for sockjs
        // code based on https://stackoverflow.com/questions/25683022/how-to-disable-debug-messages-on-sockjs-stomp
        stompClient.debug = null

        return stompClient;
    }

    return null;
}
// exporting MessageInboxService functions created
export const MessageInboxService = {
    onComposeNewMessage,
    getEmail,
    getUserContacts,
    getEmailInboxes,
    stompClient
}