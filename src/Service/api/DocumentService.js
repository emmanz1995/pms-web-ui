import { authHeader } from "../../Util/AuthHeaderUtil";
import { errorResponseHandler } from '../../Error/ErrorResponseHandler';

function onFileUpload(fileInput, uploadToUserId, uploadFromUserId, featureType) {
    const authorizationHeader = authHeader();
    const formData = new FormData();

    formData.append('file', fileInput);
    formData.append('uploadToUserId', uploadToUserId);
    formData.append('uploadFromUserId', uploadFromUserId);
    formData.append('feature', featureType);

    const requestOptions = {
        method: "POST",
        headers: authorizationHeader,
        body: formData
    };

    let url = new URL(`${process.env.REACT_APP_DOCUMENT_URL}/api/v1/documents/upload`)
    return fetch (url, requestOptions)
        .then(errorResponseHandler)
}

function onFileDownload(documentId) {
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] = "application/octet-stream"
    const requestOptions = {
        method: "GET",
        headers: authorizationHeader,
    };
    let url = new URL(`${process.env.REACT_APP_DOCUMENT_URL}/api/v1/documents/download/${documentId}`)

    return fetch (url, requestOptions)
        .then(errorResponseHandler)
}

function getFiles(size, page, featureType, uploadFromUserId, uploadToUserId, disablePagination = false, fileUserIds = [], documentIds =[], sorts= []){
    const authorizationHeader = authHeader();
    authorizationHeader['content-type'] ='application/json'
    const requestOptions = {
        method: "GET",
        headers: authorizationHeader,
    };
    let url = new URL(`${process.env.REACT_APP_DOCUMENT_URL}/api/v1/documents`)

    let searchParams = url.searchParams;

    if (documentIds != null && documentIds.length > 0) {
        searchParams.set("documentIds", documentIds.join(","))
    }

    if (fileUserIds != null && fileUserIds.length > 0) {
        searchParams.set("fileUserIds", fileUserIds.join(","))
    }

    if (uploadFromUserId != null) {
        searchParams.set("uploadFromUserId", uploadFromUserId.toString())
    }

    if (uploadToUserId != null) {
        searchParams.set("uploadToUserId", uploadToUserId.toString())
    }

    if (featureType != null) {
        searchParams.set("feature", featureType)
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

    console.log(`getDocuments url: ${url.toString()}`);

    return fetch (url.toString(), requestOptions)
        .then(errorResponseHandler);
}

export const DocumentService = {
    onFileUpload,
    onFileDownload,
    getFiles
}