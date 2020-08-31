import { authService } from '../Service/api/AuthService';

const UPLOAD_MEDICAL_RECORD_ACCESS = "UPLOAD_ACCESS_MEDICAL_RECORD_DASHBOARD";
const VIEW_MEDICAL_RECORD_ACCESS = "VIEW_ACCESS_MEDICAL_RECORD_DASHBOARD";
const DOWNLOAD_MEDICAL_RECORD_ACCESS = "DOWNLOAD_ACCESS_DOWNLOAD_MEDICAL_RECORD_DASHBOARD";
const ADMIN_ACCESS = "ALL_ACCESS_SITE_ADMIN";
const EMAIL_INBOX_ACCESS = "ALL_ACCESS_EMAIL_INBOX_DASHBOARD";

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