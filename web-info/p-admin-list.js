/**
 * Global Permanent Non-Removable Master Admin Configuration
 * Add your actual Firebase Auth UIDs to this array to guarantee master admin access.
 */
export const PERMANENT_MASTER_ADMIN_UIDS = [
    "1Qf7HPxg5qgpMpkEsCv689yo0eF3"
];

// Default primary master admin UID
export const PERMANENT_MASTER_ADMIN_UID = PERMANENT_MASTER_ADMIN_UIDS[0];

/**
 * Check whether a given user UID is a permanent master admin
 * @param {string} uid - Firebase Auth User UID
 * @returns {boolean}
 */
export function isPermanentAdmin(uid) {
    if (!uid) return false;
    return PERMANENT_MASTER_ADMIN_UIDS.includes(uid);
}

// Global window registration for non-module script tag fallbacks
if (typeof window !== 'undefined') {
    window.PERMANENT_MASTER_ADMIN_UIDS = PERMANENT_MASTER_ADMIN_UIDS;
    window.PERMANENT_MASTER_ADMIN_UID = PERMANENT_MASTER_ADMIN_UID;
    window.isPermanentAdmin = isPermanentAdmin;
}