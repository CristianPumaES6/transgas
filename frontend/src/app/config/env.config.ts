// El siguiente archivo tiene como finalidad agrupar todas las configuraciones del proyecto.

// Interface es como el esqueleto de un objeto. Java lo usa mucho.
export interface EnvConfig {
    API?: string;
    ENV?: string;
    VERSION?:string;
    SOCKET?:string; 
}

/*
export const EnvConfig: EnvConfig = {
    API: 'https://transgas-test.codev.site',
    ENV: '',
    VERSION: 'v1.9M'
};
*/


//FRONT DEL LINUX SERVER
export const EnvConfig: EnvConfig = {
    API: 'http://165.232.153.20:3000',
    ENV: '',
    VERSION: 'v1.9M',
    SOCKET: 'http://165.232.153.20:4000'
}; 


/* 
export const EnvConfig: EnvConfig = {
    API: 'https://transgas.codev.site',
    ENV: '',
    VERSION: 'v1.9P',
    SOCKET: 'https://socket-transgas.codev.site'
}; */



/* export const EnvConfig: EnvConfig = {
    API: 'http://localhost:3000',
    ENV: '',
    VERSION: 'v1.9P',
    SOCKET:'ws://localhost:4000'
};
 */