// El siguiente archivo tiene como finalidad agrupar todas las configuraciones del proyecto.

// Interface es como el esqueleto de un objeto. Java lo usa mucho.
export interface EnvConfig {
    API?: string;
    ENV?: string;
    VERSION?: string;
    SOCKET?: string;
    URL_EMPRESA?: string;
}

/*
// CONFIGURACION PARA AMBIENTES DE WINDOWS
export const EnvConfig: EnvConfig = {
    API: 'https://transgas-test.codev.site',
    ENV: '',
    VERSION: 'v1.9M',
    URL_EMPRESA: 'https://www.transgas.com.pe/'
};
*/


//FRONT DEL LINUX SERVER sin DOMINIO
/* export const EnvConfig: EnvConfig = {
    API: 'http://165.232.153.20:3000',
    ENV: '',
    VERSION: 'v1.9M',
    SOCKET: 'http://165.232.153.20:4000',
    URL_EMPRESA: 'https://www.transgas.com.pe/'
}; */





// SERVIDOR LINUX - front Firebase
/* export const EnvConfig: EnvConfig = {
    API: 'https://transgas.lowcodetool.com',
    ENV: '',
    VERSION: 'v1.9M',
    SOCKET: 'https://socket-transgas.lowcodetool.com',
    URL_EMPRESA: 'https://www.transgas.com.pe/'
};
*/



// CONFIGURACION PARA test DESARROLLO-server
/* export const EnvConfig: EnvConfig = {
    API: 'https://transgas.esteesel.club',
    ENV: '',
    VERSION: 'v1.9M',
    SOCKET: 'https://socket-transgas.esteesel.club',
    URL_EMPRESA: 'https://www.transgas.com.pe/'
};
 */

//CONFIG DEVELOPER LOCAL
export const EnvConfig: EnvConfig = {
    API: 'http://localhost:3000',
    ENV: '',
    VERSION: 'v1.9M',
    SOCKET: 'ws://localhost:4000',
    URL_EMPRESA: 'https://www.transgas.com.pe/'
};
 

