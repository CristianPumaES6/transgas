//
export const aSide: any = {
    DASHBOARD: 'Dashboard',
    VOYAGE: 'Voyage',
    USER: 'User'
}

//
export const application: any = {
    EDIT_PERFIL: 'Edit profile',
    EXIT_PERFIL: 'Logout',
    CURRENT_STATUS: 'current status',
    STATUS_TRUE: 'Online',
    STATUS_FALSE: 'Offline',
    ERROR_UPDATE_INDEXEDDB_IN_ONLINE: 'Error updating the data in indexDB in online',
    ERROR_SYNC_INDEXEDDB_IN_ONLINE: 'Failed to sync User ADD, UPDATE in server.',
    ERROR_CLEAR_INDEXEDDB: 'Failed to clear User indexBD',
}

// Cateogría para autenticacion
export const auth: any = {
    // Comunes personalizado,
    LOGIN_FAILED: 'The username or password entered is not valid.',
    SUCCESS_LOGIN: 'Welcome {{NAME}}',
    ERROR_CONNECTION: 'Could not connect to server',
    CANNOT_REACH_SERVER: 'Could not connect to server.',
    ERROR_ON_GENERAL: 'He encountered an unexpected error, contact us at: labcode.team.lt@gmail.com ',
    CONNECTION_ERROR: 'Connection error.',
    SESSION_LOST_401: 'Session lost.',
    ACCOUNT_EXPIRED_402: 'Account expired.',
    USER_HAS_NOT_PERSMISSIONS_403: 'User does not have permission',
    SERVER_RETURNED_NOT_FOUND_404: 'Server returned not found.',
    // Generico
    ERROR: 'Error',
    SUCCESS: 'Success',
};

// Categoria para sing-up
export const logIn: any = {
    LOG_IN: 'Log In',
    TITLE_PRINCIPAL: 'Transgas',
    SUB_TITLE_PRINCIPAL: 'SAILING ANALYSIS',
    WELCOME_LOGIN: 'Welcome back!',
    PLEASE_SING_LOGIN: 'Please sign in to continue.',

    // Formulario
    USERNAME: 'Username',
    PASSWORD: 'Password',
    BTN_SING_IN: 'Sing in',
    // Generico
    SUCCESS: 'Success',
    ERROR: 'Error',
    ERROR_CONNECTION: 'Could not connect to server',
    CANNOT_REACH_SERVER: 'Could not connect to server.',
    ERROR_ON_GENERAL: 'He encountered an unexpected error, contact us at: labcode.team.lt@gmail.com ',

    // Personalize
    SUCCESS_LOGIN: 'Welcome {{NAME}}',
    LOGIN_FAILED: 'The username or password entered is not valid.',
}
