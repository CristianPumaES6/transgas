export const azList: any = {
    NEW: 'New',
    BACK: 'Back'
};

//
export const aSide: any = {
    DASHBOARD: 'Dashboard',
    VOYAGE: 'Voyage',
    USER: 'User'
};

//
export const application: any = {
    EDIT_PERFIL: 'Edit profile',
    EXIT_PERFIL: 'Logout',
    CURRENT_STATUS: 'current status',
    STATUS_TRUE: 'Online',
    STATUS_FALSE: 'Offline',
    // Errores comunes
    ERROR: 'Error',
    SUCCESS: 'Success',
    ERROR_ON_LOAD: 'Could not get data from server.',
    ERROR_FORKJOIN_GET: 'Could not get data from server.',
    // Error comun indexedDB
    ERROR_UPDATE_INDEXEDDB_IN_ONLINE: 'Error updating the data in indexDB in online',
    ERROR_SYNC_INDEXEDDB_IN_ONLINE: 'Failed to sync User ADD, UPDATE in server.',
    ERROR_CLEAR_INDEXEDDB: 'Failed to clear User indexBD',
    // Errores personalizados
    ERROR_GET_USERS: 'Could not get user data.',
};

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
};

export const user: any = {
    // Comunes
    SAVE: 'Save',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    EDIT: 'Edit',
    UPDATE: 'Update',
    CREATE: 'Create',
    // Comunes personalizados.
    CREATE_USER: 'Save new user',
    UPDATE_USER: 'Update user',
    EDIT_USER: 'Enable form',
    // Error
    ERROR: 'Error',
    SUCCESS: 'Success',
    WARNING: 'Warning',
    MISSING_FIELS: 'Send all necessary fields.',
    ERROR_ON_LOAD: 'Could not get data from server.',
    ERROR_FORKJOIN_GET: 'Could not get data from server.',
    // Error comun indexedDB
    ERROR_UPDATE_INDEXEDDB_IN_ONLINE: 'Error updating the data in indexDB in online.',
    ERROR_SYNC_INDEXEDDB_IN_ONLINE: 'Failed to sync User ADD, UPDATE in server.',
    ERROR_CLEAR_INDEXEDDB: 'Failed to clear User indexBD.',
    // Error indexedDB Personalizado
    ERROR_GET_USERS_INDEXEDDB: 'No users found in the indexed DB.',
    // Error personalizados
    ERROR_GET_USERS: 'Could not get user data.',
    ERROR_USER_UPDATE: 'Could not update user.',
    ERROR_USER_UPDATE_LOCAL: 'Could not update user local.',
    ERROR_USER_CREATE: 'Could not create user.',
    ERROR_USER_CREATE_LOCAL: 'Could not create user local.',
    ERROR_USER_DELETE:'Could not delete user.',
    ERROR_USER_DELETE_LOCAL:'Could not delete user local.',
    REPEAT_NICK: 'Repeat nick.',
    // Formulario
    NAME: 'Name',
    PASSWORD: 'Password',
    NICK: 'Nick',
    ROLE: 'Role',
    ADMIN: 'Admin',
    SUPPORT: 'Support',
    BUQUE: 'Buque',
    // Mensaje personalizados.
    SUCCESS_USER_SAVE: 'User saved successfully.',
    SUCCESS_USER_SAVE_LOCAL: 'User successfully saved local.',
    SUCCESS_USER_CREATE: 'User created successfully.',
    SUCCESS_USER_CREATE_LOCAL: 'User successfully created local.',
    SUCCESS_USER_DELETE: 'User deleted successfully.',
    SUCCESS_USER_DELETE_LOCAL: 'User successfully deleted local.',
    COMFIMR_DELETE_TITLE_REPLACE: 'Are you sure you want to delete [NAME]?',
    COMFIRM_DELETE_DESCRIPTION: 'The changes are irreversible.',
};