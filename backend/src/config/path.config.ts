import * as path from 'path';


// Ruta completa de la carpeta de sqlite.
export const SQLITE_PATH: string = path.resolve(__dirname, '../..', '');
// Ruta de las imagenes subidas.
export const FOLDER_UPLOADS: string = path.resolve(__dirname, '../..', 'IMAGE_UPLOADS')
export const FOLDER_STATIC: string = path.resolve(__dirname, '../..', 'STATIC')