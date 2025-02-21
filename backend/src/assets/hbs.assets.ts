import * as express from 'express';
import * as hbs from 'hbs';

// modulos de node
import { join } from 'path';
import * as path from 'path';

import { INestApplication, INestApplicationContext, INestMicroservice } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { TEMPLATE_MAIL_PATH, TEMPLATE_FOLDER } from '../config/path.config';

// Assets || Si es una class lo tego que poner en el constructor y como proverdor del modulo
import { DummyPromise } from './promises.assets';
import { ReadFileContent } from './file-manager.assets';

// Instancias de hbs para usar en cada tipo
let hbsHtml: any;

export function GetHbsHtml(): any {
  // Devuelvo el objeto
  return hbsHtml;
}

// Funcion para inicializar el engine de templating
export function HbsInit(app: NestExpressApplication): Promise<boolean> {
  // Armo promesa para devolver
  return DummyPromise().then((result: boolean) => {
    // Inicializo instancias de handlebars para cada extensión
    hbsHtml = hbs.create();

    // Asocio las instancias al app
    app.engine('html', hbsHtml.__express);

    return true;
  });
}

// Funcion que te pide la ruta, objeto y retorna html.
export function HbsConvertHtmlRender(fileHbs: string, objRender: any): Promise<string> {
  // contenido html
  let contentHTML: string = '';

  // Armo promesa para devolver
  return DummyPromise()
    .then((result: boolean) => {
      //ubicacion template
      let originalFileFullPath = path.join(TEMPLATE_MAIL_PATH, fileHbs);

      // leemos el contenido de un archivo.
      return ReadFileContent(originalFileFullPath, 'utf8');
    })
    .then((resultContent: string) => {
      // Si no existe en contenido, envio  un mensaje de error.
      if (!resultContent) throw Error('revisar la funcion ReadFileContent.');

      // Guardo contenido para utilizarlo luego.
      contentHTML = resultContent;

      // Obtengo instancia de hbs
      return GetHbsHtml();
    })
    .then((resultHbsHtml: any) => {
      // Si en este punto no hay hbs no se puede seguir
      if (!resultHbsHtml) throw 'No se pudo inicializar engine para generación de HTML';

      // Obtengo el template en base al hbs
      let theme: any = resultHbsHtml.compile(contentHTML);

      // Render html
      let renderHtml: string = theme(objRender);

      // retornamos el html renderizado
      return renderHtml;
    });
}
