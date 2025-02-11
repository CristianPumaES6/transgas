import * as path from 'path';

// Ruta completa de la carpeta de sqlite.
export const SQLITE_PATH: string = path.resolve(__dirname, '../..', '');
// Ruta de las imagenes subidas.
export const FOLDER_UPLOADS: string = path.resolve(__dirname, '../..', 'IMAGE_UPLOADS');
export const FOLDER_STATIC: string = path.resolve(__dirname, '../..', 'STATIC');

// Directorio del FrontEnd
export const FOLDER_FRONTEND: string = path.resolve(__dirname, '../../..', 'frontend', 'dist', 'frontend');

// [Nombre de las carpetas temaplate HBS]
export const TEMPLATE_FOLDER: string = 'template';

// Ruta completa de la carpeta de templates para mailing
export const TEMPLATE_MAIL_PATH: string = path.resolve(__dirname, '../..', TEMPLATE_FOLDER);
