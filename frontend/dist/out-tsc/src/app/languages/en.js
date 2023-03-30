import * as countries from './en.countries';
import * as dates from './en.dates';
import * as languages from './en.languages';
import * as messages from './en.messages';
// Armo un objeto para exportar y junto todas las categorias importadas
const en = {};
Object.assign(en, countries, dates, languages, messages);
export { en };
//# sourceMappingURL=en.js.map