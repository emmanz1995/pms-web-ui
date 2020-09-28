import { authHeader } from "../../Util/AuthHeaderUtil";
import { errorResponseHandler } from '../../Error/ErrorResponseHandler';

function onFileUpload(fileInput, uploadToUserId, uploadFromUserId, featureType) {
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting up formData variable
    // code based on https://aboutreact.com/file-uploading-in-react-native/
    const formData = new FormData();
    // appending field names to formData
    formData.append('file', fileInput);
    formData.append('uploadToUserId', uploadToUserId);
    formData.append('uploadFromUserId', uploadFromUserId);
    formData.append('feature', featureType);
    const requestOptions = {
        // makeing a POST request
        method: "POST",
        // defining the header as authorizationHeader
        headers: authorizationHeader,
        // setting formData as a request body
        body: formData
    };
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_DOCUMENT_URL}/api/v1/documents/upload`)
    // fetching url which has been converted to string and also the variables from requestOptions
    return fetch (url, requestOptions)
        // handling errors
        .then(errorResponseHandler)
}

function onFileDownload(documentId) {
    // adding authorizationHeader variable to be able to utilize the authHeader function
    const authorizationHeader = authHeader();
    // setting the authHeader with a content-type of application json
    authorizationHeader['content-type'] = "application/octet-stream"
    const requestOptions = {
        // making a GET request
        method: "GET",
        // defining the header as authorizationHeader
        headers: authorizationHeader,
    };
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_DOCUMENT_URL}/api/v1/documents/download/${documentId}`)
    // fetching url which has been converted to string and also the variables from requestOptions
    return fetch (url, requestOptions)
        // handling errors
        .then(errorResponseHandler)
}

function getFiles(size, page, featureType, uploadFromUserId, uploadToUserId, disablePagination = false, fileUserIds = [], documentIds =[], sorts= []){
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
    // define url as a let variable and adding the url for the client to connect to the api
    let url = new URL(`${process.env.REACT_APP_DOCUMENT_URL}/api/v1/documents`)
    // this code is based on https://stackoverflow.com/questions/42236837/how-to-perform-a-search-with-conditional-where-parameters-using-sequelize
    // writing conditional statements to be able to dynamically append parameters into the url and setting them inside the searchParam object for the url
    // these param fields are only sorted into conditional
    let searchParams = url.searchParams;

    if (documentIds != null && documentIds.length > 0) {
        searchParams.set("documentIds", documentIds.join(",")) // joins separate documentsIds together in the same line
    }

    if (fileUserIds != null && fileUserIds.length > 0) {
        searchParams.set("fileUserIds", fileUserIds.join(",")) // joins separate fileUserIds together in the same line
    }

    if (uploadFromUserId != null) {
        searchParams.set("uploadFromUserId", uploadFromUserId.toString()) // converts uploadFromUserId into a string value
    }

    if (uploadToUserId != null) {
        searchParams.set("uploadToUserId", uploadToUserId.toString()) // converts uploadToUserId into a string value
    }

    if (featureType != null) {
        searchParams.set("feature", featureType) // converts feature into a string value
    }

    searchParams.set("disablePagination", disablePagination.toString()) // converts disablePagination into a string value

    if (!disablePagination) {
        searchParams.set("page", page.toString()); // converts page into a string value
        searchParams.set("size", size.toString()) // converts size into a string value
    }

    if (sorts != null && sorts.length > 0) {
        sorts.forEach(sort => searchParams.append("sort", sort)); // appends searchParams to sort
    }
    // converts searchParams into a string value
    url.search = searchParams.toString();
    // logging get Documents url into the console which has been converted to string
    console.log(`getDocuments url: ${url.toString()}`);
    // fetching url which has been converted to string and also the variables from requestOptions
    return fetch (url.toString(), requestOptions)
        // handles errors
        .then(errorResponseHandler);
}
// exporting all the functions created within document service js file
export const DocumentService = {
    onFileUpload,
    onFileDownload,
    getFiles
}