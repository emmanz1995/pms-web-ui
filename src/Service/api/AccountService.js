// import queryString from "querystring";
import { authHeader } from "../../Util/AuthHeaderUtil";
import { errorResponseHandler } from '../../Error/ErrorResponseHandler'

const API_VERSION_URL = "/api/v1"

function onForgetPassword(email) {
    const requestOptions = {
        method: 'POST',
        headers: {
            'accept':'application/json',
            'content-type':'application/json'
        }
    };

    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}/account/forgotPassword`)
    const params = {email: email} 
    url.search = new URLSearchParams(params).toString();

    return fetch(url, requestOptions)
    .then(errorResponseHandler)
}

function onVerifyReset(token) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'content-type':'application/json',
            'accept': 'application/json'
        }
    };
    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}/account/verifyResetToken`)
    const params = {token: token}
    url.search = new URLSearchParams(params).toString();
    return fetch(url, requestOptions)
    .then(errorResponseHandler)
}

function onResetPassword(credential, token) {
    console.log(`${process.env.REACT_APP_ACCOUNT_URL}/account/resetPassword`)
    const requestOptions = {
        method: 'POST',
        headers: {
            'accept':'application/json',
            'content-type':'application/json'
        },
        body: JSON.stringify(credential)
    };

    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}/account/resetPassword`)
    const params = {token: token}
    url.search = new URLSearchParams(params).toString();

    return fetch(url, requestOptions)
    .then(errorResponseHandler)
}

function onChangePassword (credential, userId){
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] = 'application/json'
    console.log(authorizationHeader);
    const requestOptions = {
        method: 'POST',
        headers: authorizationHeader,        
        body: JSON.stringify({
            "password": credential.password,
            "confirmPassword": credential.confirmPassword
        })
    };
    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}/api/v1/users/${userId}/resetPassword`)
    
    return fetch(url, requestOptions)
    .then(errorResponseHandler)
}

// sort = [ "${propertyname},${direction}",   ] NOTE: direction is ASC, DESC
function getAssignUsers(page, size, userId, featureType, disablePagination = false, sorts = []) {
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] ='application/json'

    const requestOptions= {
        method: 'GET',
        headers: authorizationHeader,
    };

    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}${API_VERSION_URL}/assign-users`)

    let searchParams = url.searchParams;

    searchParams.set("disablePagination", disablePagination.toString())

    if (!disablePagination) {
        searchParams.set("page", page.toString());
        searchParams.set("size", size.toString());
    }

    if (userId != null) {
        searchParams.set("assigneeUserId", userId.toString())
    }

    if (featureType != null) {
        searchParams.set("featureTypes", featureType.toString())
    }

    if (sorts != null && sorts.length > 0) {
        sorts.forEach(sort => searchParams.append("sort", sort));
    }

    url.search = searchParams.toString();

    console.log(`getAssignedUsers url: ${url.toString()}`);

    return fetch (url.toString(), requestOptions)
        .then(errorResponseHandler)
}

export const AccountService = {
    onForgetPassword,
    onVerifyReset,
    onResetPassword,
    onChangePassword,
    getAssignUsers,
}