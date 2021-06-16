// El siguiente archivo tiene como finalidad agrupar todas las configuraciones del proyecto.

// Interface es como el esqueleto de un objeto. Java lo usa mucho.
export interface EnvConfig {
    API?: string;
    ENV?: string;
    VERSION?:string;
}

/* export const EnvConfig: EnvConfig = {
    API: 'https://transgas-test.codev.site',
    ENV: '',
    VERSION: 'v1.9e'
};
*/

/* 
export const EnvConfig: EnvConfig = {
    API: 'https://transgas1.codev.app',
    ENV: '',
    VERSION: 'v1.9e'
};
*/


export const EnvConfig: EnvConfig = {
    API: 'http://localhost:3000',
    ENV: '',
    VERSION: 'v1.9e'
};
