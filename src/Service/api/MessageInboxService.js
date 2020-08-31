import { authHeader } from "../../Util/AuthHeaderUtil";
import { errorResponseHandler } from '../../Error/ErrorResponseHandler';
import { authService } from "./AuthService";
import Stomp from 'stompjs';

function onComposeNewMessage(compose){
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] = 'application/json'

    const requestOptions = {
        method: 'POST',
        headers: authorizationHeader,
        body: JSON.stringify(compose)
    };
    let url = new URL(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/api/v1/emails/compose-new`)

    return fetch(url, requestOptions)
        .then(errorResponseHandler)
}

function getEmail(emailId){
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] = 'application/json'

    const requestOptions = {
        method: 'GET',
        headers: authorizationHeader
    };
    let url = new URL(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/api/v1/emails/${emailId}`)

    return fetch(url, requestOptions)
        .then(errorResponseHandler)
}

function getUserContacts(size, page, userId, disablePagination = false, sorts = []) {
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] ='application/json'

    const requestOptions= {
        method: 'GET',
        headers: authorizationHeader,
    };

    let url = new URL(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/api/v1/user-contacts`)

    let searchParams = url.searchParams;

    searchParams.set("disablePagination", disablePagination.toString())

    if (!disablePagination) {
        searchParams.set("page", page.toString());
        searchParams.set("size", size.toString());
    }

    searchParams.set("userId", userId.toString());

    if (sorts != null && sorts.length > 0) {
        sorts.forEach(sort => searchParams.append("sort", sort));
    }

    url.search = searchParams.toString();

    console.log(`getUserContacts url: ${url.toString()}`);

    return fetch (url.toString(), requestOptions)
        .then(errorResponseHandler)
}

function getEmailInboxes(size, page, userId, inboxStatus, disablePagination = false, sorts= ["latestSentAt,desc"]){
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] ='application/json'
    const requestOptions = {
        method: "GET",
        headers: authorizationHeader,
    };
    let url = new URL(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/api/v1/email-inboxes`)

    let searchParams = url.searchParams;

    if (userId != null) {
        searchParams.set("userId", userId.toString());
    }

    if (inboxStatus != null) {
        searchParams.set("inboxStatus", inboxStatus.toString());
    }

    searchParams.set("disablePagination", disablePagination.toString())

    if (!disablePagination) {
        searchParams.set("page", page.toString());
        searchParams.set("size", size.toString());
    }

    if (sorts != null && sorts.length > 0) {
        sorts.forEach(sort => searchParams.append("sort", sort));
    }

    url.search = searchParams.toString();

    console.log(`getEmailInboxes url: ${url.toString()}`);

    return fetch (url.toString(), requestOptions)
        .then(errorResponseHandler);
}

function stompClient() {
    const accessToken = authService.getAccessToken()
    if (accessToken) {
        console.log("setting up sockjs client")
        let SockJS = require('sockjs-client')
        SockJS = new SockJS(`${process.env.REACT_APP_MESSAGE_INBOX_URL}/ws?access_token=${accessToken}`)
        let stompClient = Stomp.over(SockJS);
        stompClient.debug = null

        return stompClient;
    }

    return null;
}

export const MessageInboxService = {
    onComposeNewMessage,
    getEmail,
    getUserContacts,
    getEmailInboxes,
    stompClient
}