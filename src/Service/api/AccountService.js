// import queryString from "querystring";
import { authHeader } from "../../Util/AuthHeaderUtil";
import { errorResponseHandler } from '../../Error/ErrorResponseHandler'
// setting up the main url variable
const API_VERSION_URL = "/api/v1"

// code based on https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example
function onForgetPassword(email) {
    const requestOptions = {
        // makeing a POST request
        method: 'POST',
        // setting the headers
        headers: {
            'accept':'application/json',
            'content-type':'application/json'
        }
    };
    // variable for the url that will be fetched
    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}/account/forgotPassword`)
    // creating email field as a parameter
    const params = {email: email} 
    url.search = new URLSearchParams(params).toString();
    // fetching the url and requestOptions
    return fetch(url, requestOptions)
    // handles error
    .then(errorResponseHandler)
}

function onVerifyReset(token) {
    const requestOptions = {
        // making a GET request
        method: 'GET',
        // defining the headers
        headers: {
            'content-type':'application/json',
            'accept': 'application/json'
        }
    };
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}/account/verifyResetToken`)
    // defining token as a parameter
    const params = {token: token}
    // converts search params into a string value
    url.search = new URLSearchParams(params).toString();
    // fetching url which has been converted to string and also the variables from requestOptions
    return fetch(url, requestOptions)
    // handling error
    .then(errorResponseHandler)
}

function onResetPassword(credential, token) {
    // logging to the console the reset password api url
    console.log(`${process.env.REACT_APP_ACCOUNT_URL}/account/resetPassword`)
    const requestOptions = {
        // making a POST request
        method: 'POST',
        // defining the headers
        headers: {
            'accept':'application/json',
            'content-type':'application/json'
        },
        // defining the request body
        body: JSON.stringify(credential)
    };
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}/account/resetPassword`)
    // defining token as a parameter
    const params = {token: token}
    // converts search params into a string value
    url.search = new URLSearchParams(params).toString();
    // fetching url which has been converted to string and also the variables from requestOptions
    return fetch(url, requestOptions)
    // handling errors
    .then(errorResponseHandler)
}

function onChangePassword (credential, userId){
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting the authHeader with a content-type of application json
    authorizationHeader['content-type'] = 'application/json'
    // logging to the console the authorizationHeader value
    console.log(authorizationHeader);
    const requestOptions = {
        // making a GET request
        method: 'POST',
        // defining the header as authorizationHeader
        headers: authorizationHeader,
        // defining the request body
        body: JSON.stringify({
            "password": credential.password,
            "confirmPassword": credential.confirmPassword
        })
    };
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}/api/v1/users/${userId}/resetPassword`)
    // fetching url which has been converted to string and also the variables from requestOptions
    return fetch(url, requestOptions)
    // handling errors
    .then(errorResponseHandler)
}

// sort = [ "${propertyname},${direction}",   ] NOTE: direction is ASC, DESC
// code based on https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example
function getAssignUsers(page, size, userId, featureType, disablePagination = false, sorts = []) {
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting the authHeader with a content-type of application json
    authorizationHeader['content-type'] ='application/json'
    const requestOptions = {
        // making a GET request
        method: 'GET',
        // defining the header as authorizationHeader
        headers: authorizationHeader,
    };
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_ACCOUNT_URL}${API_VERSION_URL}/assign-users`)

    // this code is based on https://stackoverflow.com/questions/42236837/how-to-perform-a-search-with-conditional-where-parameters-using-sequelize
    // writing conditional statements to be able to dynamically append parameters into the url and setting them inside the searchParam object for the url
    // these param fields are only sorted into conditional
    let searchParams = url.searchParams;

    // code based on https://developers.google.com/web/updates/2016/01/urlsearchparams
    searchParams.set("disablePagination", disablePagination.toString()) // converts disable pagination into a string value

    if (!disablePagination) {
        searchParams.set("page", page.toString());// converts page into a string value
        searchParams.set("size", size.toString());// converts size into a string value
    }

    if (userId != null) {
        searchParams.set("assigneeUserId", userId.toString()) // converts userId into a string value
    }

    if (featureType != null) {
        searchParams.set("featureTypes", featureType.toString()) // converts featureType into a string value
    }

    if (sorts != null && sorts.length > 0) {
        sorts.forEach(sort => searchParams.append("sort", sort));
    }

    url.search = searchParams.toString();// converts search params into a string value

    // logging get assigned users url into the console which has been converted to string
    console.log(`getAssignedUsers url: ${url.toString()}`);
    // fetching url which has been converted to string and also the variables from requestOptions
    return fetch (url.toString(), requestOptions)
        // handling errors
        .then(errorResponseHandler)
}
// exporting all the functions created within account service js file
export const AccountService = {
    onForgetPassword,
    onVerifyReset,
    onResetPassword,
    onChangePassword,
    getAssignUsers,
}