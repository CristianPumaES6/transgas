// El siguiente archivo tiene como finalidad agrupar todas las configuraciones del proyecto.

// Interface es como el esqueleto de un objeto. Java lo usa mucho.
export interface EnvConfig {
    API?: string;
    ENV?: string;
}

export const EnvConfig: EnvConfig = {
    API: 'https://transgas.labcode.site',
    ENV: ''
};



/* export const EnvConfig: EnvConfig = {
    API: 'http://localhost:3000',
    ENV: ''
}; */
