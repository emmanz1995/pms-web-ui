import { authService } from '../Service/api/AuthService';

// the idea of this service file came from https://auth0.com/blog/role-based-access-control-rbac-and-react-apps/
// defines all of the access privileges that users will have whilst using the system
const UPLOAD_MEDICAL_RECORD_ACCESS = "UPLOAD_ACCESS_MEDICAL_RECORD_DASHBOARD";
const VIEW_MEDICAL_RECORD_ACCESS = "VIEW_ACCESS_MEDICAL_RECORD_DASHBOARD";
const DOWNLOAD_MEDICAL_RECORD_ACCESS = "DOWNLOAD_ACCESS_DOWNLOAD_MEDICAL_RECORD_DASHBOARD";
const ADMIN_ACCESS = "ALL_ACCESS_SITE_ADMIN";
const EMAIL_INBOX_ACCESS = "ALL_ACCESS_EMAIL_INBOX_DASHBOARD";

// defining all of the authority privilege as functions which will be assigned according tp each page
function hasUploadMedicalRecordAccess() {
    return hasAccess(UPLOAD_MEDICAL_RECORD_ACCESS)
}

function hasDownloadMedicalRecordAccess() {
    return hasAccess(DOWNLOAD_MEDICAL_RECORD_ACCESS)
}

function hasViewMedicalRecordAccess() {
    return hasAccess(VIEW_MEDICAL_RECORD_ACCESS)
}

function hasMessageInboxAccess() {
    return hasAccess(EMAIL_INBOX_ACCESS)
}
// setting the conditions for each access
function hasAccess(condition) {
    return authService.currentUserValue?.authorities
        .some(x => x.authority === condition);
}

export const PrivilegeService = {
    hasUploadMedicalRecordAccess,
    hasMessageInboxAccess,
    hasDownloadMedicalRecordAccess,
    hasViewMedicalRecordAccess
}