import * as countries from './es.countries';
import * as dates from './es.dates';
import * as languages from './es.languages';
import * as messages from './es.messages';

// Armo un objeto para exportar y junto todas las categorias importadas
const es: any = {};

Object.assign(es, countries, dates, languages, messages);

export { es };
