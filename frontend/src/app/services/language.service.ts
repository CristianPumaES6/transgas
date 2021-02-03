import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { en } from '../languages/en';
import { es } from '../languages/es';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  // Lenguajes soportados
  private suportedLanguages: string[] = ['es', 'en', 'pt', 'fr'];

  // Idioma del usuario logueado
  private currentLanguage: string = 'en';// this.GetBrowserLanguage();

  // Evento de cambio de idioma
  public onLanguageChanged: Subject<string> = new Subject<string>();

  constructor(
  ) { }

  // Devuelve el lenaguaje en uso
  GetCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Actualiza el lenaguaje en uso
  SetCurrentLanguage(languageCode: string) {
    // Guardo el idioma anterior
    let oldLanguate: string = this.currentLanguage;
    // Actualizo el idioma del usuario
    this.currentLanguage = languageCode || this.currentLanguage;
    //Guardamos lenguaje actual en LocalSstorage
    localStorage.setItem('UserLanguage', this.currentLanguage);
    // Si se cambió el idioma disparo evento
    if (this.currentLanguage !== oldLanguate) this.onLanguageChanged.next(this.currentLanguage);
  }

  // Devuelve la traduccion de un mensaje dentro de una categoria
  GetMessage(category: string, message: string, language?: string, separator?: string): string {

    // Resultado a devolver (por defecto el message recibido)
    let result: string = message || '';

    // Si no tengo separador por defecto uso el pipe
    separator = separator || '|';

    // Acomodo el input
    let categoryKey: string = category || '';
    let messageKey: string = message || '';

    // Busco los argumentos que me pueden llegar con el separador
    let messagesArgs: string[] = messageKey.split(separator);

    // El mensaje es el primer elemento del array (lo quito y me lo quedo)
    messageKey = messagesArgs.shift();

    // Paso el mensaje a mayuscula
    messageKey = messageKey.toUpperCase();

    // Si no recibo language para el resultado, uso el default
    let resultLanguage: string = (language || this.currentLanguage).toLowerCase();

    // Devuelvo segun el idioma recibido
    switch (resultLanguage) {

      // Español
      case 'es':
        if (es[categoryKey] && es[categoryKey][messageKey] !== undefined && es[categoryKey][messageKey] !== null) result = es[categoryKey][messageKey];
        break;

      // Portugues
      case 'pt':
        if (en[categoryKey] && en[categoryKey][messageKey] !== undefined && en[categoryKey][messageKey] !== null) result = en[categoryKey][messageKey];
        break;

      // Frances
      case 'fr':
        if (en[categoryKey] && en[categoryKey][messageKey] !== undefined && en[categoryKey][messageKey] !== null) result = en[categoryKey][messageKey];
        break;

      // Ingles
      case 'en':
      default:
        if (en[categoryKey] && en[categoryKey][messageKey] !== undefined && en[categoryKey][messageKey] !== null) result = en[categoryKey][messageKey];
        break;
    }

    // Si tengo argumentos, los reemplazo del mensaje obtenido
    if (result && messagesArgs && messagesArgs.length > 0) {

      // Expresion para buscar los parametros dentro del texto
      let regexp: RegExp = /{([0-9]*)}/g;

      // Busco y reemplazo argumentos en el mensaje
      result = result.replace(regexp,
        (match: string, $1: any) => {
          try {
            // Intento parsear el indice con el que se hizo match
            let index: number = parseInt($1);
            // Busco el argumento correspondiente al indice recibido, sino se reemplaza con vacio
            return (messagesArgs && messagesArgs.length > index ? messagesArgs[index] : '');
          } catch (err) {
            // Si algo falla reemplazo con vacío
            return '';
          }
        }
      );
    }

    // Si no esta en la lista, devuelvo el codigo del mensaje
    return result;
  }

  // Devuelve la traduccion de una ayuda dentro de una categoria
  GetHelp(category: string, message: string, language?: string, separator?: string): string {

    // A la categoria le agrego el sufijo y obtengo el mensaje
    return this.GetMessage(category + 'Help', message, language, separator);
  }

  // Devuelve el nombre del pais a partir del codigo ISO 3166-1 (A2)
  GetCountryName(countryCode: string, language?: string): string {

    // La categoria en este caso es isoLanguages
    let category: string = 'isoCountries';

    // Llamo a la funcion principal para obtener mensajes
    return this.GetMessage(category, countryCode, language);
  }

  // Devuelve el nombre del idioma a partir del codigo ISO 639-1
  GetLanguageName(languageCode: string, language?: string): string {

    // La categoria en este caso es isoLanguages
    let category: string = 'isoLanguages';

    // Llamo a la funcion principal para obtener mensajes
    return this.GetMessage(category, languageCode, language);
  }

  // Devuelve la lista de nombres de meses
  GetMonths(language?: string, firstLetterCapital?: boolean): string[] {

    // La categoria en este caso es isoLanguages
    let category: string = 'months';

    // Llamo a la funcion principal para obtener mensajes
    return [
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month1', language), firstLetterCapital) : this.GetMessage(category, 'month1', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month2', language), firstLetterCapital) : this.GetMessage(category, 'month2', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month3', language), firstLetterCapital) : this.GetMessage(category, 'month3', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month4', language), firstLetterCapital) : this.GetMessage(category, 'month4', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month5', language), firstLetterCapital) : this.GetMessage(category, 'month5', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month6', language), firstLetterCapital) : this.GetMessage(category, 'month6', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month7', language), firstLetterCapital) : this.GetMessage(category, 'month7', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month8', language), firstLetterCapital) : this.GetMessage(category, 'month8', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month9', language), firstLetterCapital) : this.GetMessage(category, 'month9', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month10', language), firstLetterCapital) : this.GetMessage(category, 'month10', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month11', language), firstLetterCapital) : this.GetMessage(category, 'month11', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'month12', language), firstLetterCapital) : this.GetMessage(category, 'month12', language))
    ];
  }

  // Devuelve la lista de nombres cortos de meses
  GetShortMonths(language?: string, firstLetterCapital?: boolean): string[] {

    // La categoria en este caso es isoLanguages
    let category: string = 'shortMonths';

    // Llamo a la funcion principal para obtener mensajes
    return [
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth1', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth1', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth2', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth2', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth3', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth3', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth4', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth4', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth5', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth5', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth6', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth6', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth7', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth7', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth8', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth8', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth9', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth9', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth10', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth10', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth11', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth11', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'shortMonth12', language), firstLetterCapital) : this.GetMessage(category, 'shortMonth12', language))
    ];
  }

  // Devuelve la lista de nombres de dias de la semana
  GetWeekDays(language?: string, firstLetterCapital?: boolean): string[] {

    // La categoria en este caso es isoLanguages
    let category: string = 'weekDays';

    // Llamo a la funcion principal para obtener mensajes
    return [
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'weekDay1', language), firstLetterCapital) : this.GetMessage(category, 'weekDay1', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'weekDay2', language), firstLetterCapital) : this.GetMessage(category, 'weekDay2', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'weekDay3', language), firstLetterCapital) : this.GetMessage(category, 'weekDay3', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'weekDay4', language), firstLetterCapital) : this.GetMessage(category, 'weekDay4', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'weekDay5', language), firstLetterCapital) : this.GetMessage(category, 'weekDay5', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'weekDay6', language), firstLetterCapital) : this.GetMessage(category, 'weekDay6', language)),
      (firstLetterCapital !== undefined ? ConvertCase(this.GetMessage(category, 'weekDay7', language), firstLetterCapital) : this.GetMessage(category, 'weekDay7', language))
    ];
  }

  GetHighchartsLogDateFormat(language?: string): string {

    // Si no recibo language para el resultado, uso el current
    let resultLanguage: string = (language || this.currentLanguage).toLowerCase();

    // Resultado a devolver
    let format: string;

    switch (resultLanguage) {

      // Español
      case 'es':
        format = '%A, %e de %B de %Y';
        break;

      // Portugues
      case 'pt':
        format = '%A, %e de %B de %Y';
        break;

      // Frances
      case 'fr':
        format = '%A %e %B %Y';
        break;

      // Ingles
      case 'en':
      default:
        format = '%A, %B %e, %Y';
        break;
    }

    // Devuelvo resultado
    return format;
  }

  GetBrowserLanguage(): string {

    //Busco si el lenguaje ya se encuentra guardado en localStorage
    let storedLanguage: string = localStorage.getItem('UserLanguage');
    if (storedLanguage) return storedLanguage;

    // Obtengo el codigo de idioma del navegador.
    let lang: string = navigator.language || (<any>navigator).userLanguage || (<any>navigator).browserLanguage || 'en';

    // Me quedo solo con el codigo inicial
    if (lang) lang = lang.slice(0, 2);

    // Verifico que el idioma obtenido sea uno de los soportados
    if (!this.suportedLanguages.includes(lang)) lang = 'en';

    // Devuelvo el dato obtenido
    return lang;
  }

  GetLanguagesExtended(): Array<{ code: string, name: string }> {

    // Armo el array de idiomas
    let languages: Array<{ code: string, name: string }> = [
      { code: 'eu', name: this.GetLanguageName('eu') }, // Vasco
      { code: 'bg', name: this.GetLanguageName('bg') }, // Búlgaro
      { code: 'ca', name: this.GetLanguageName('ca') }, // Catalán
      { code: 'en', name: this.GetLanguageName('en') }, // Inglés
      { code: 'fr', name: this.GetLanguageName('fr') }, // Francés
      { code: 'gl', name: this.GetLanguageName('gl') }, // Galés
      { code: 'de', name: this.GetLanguageName('de') }, // Alemán
      { code: 'el', name: this.GetLanguageName('el') }, // Griego
      { code: 'he', name: this.GetLanguageName('he') }, // Hebreo (moderno)
      { code: 'ga', name: this.GetLanguageName('ga') }, // Irlanda
      { code: 'it', name: this.GetLanguageName('it') }, // Italiano
      { code: 'la', name: this.GetLanguageName('la') }, // Latín
      { code: 'lb', name: this.GetLanguageName('lb') }, // Luxemburgués, Luxemburgués
      { code: 'lt', name: this.GetLanguageName('lt') }, // Lituano
      { code: 'mt', name: this.GetLanguageName('mt') }, // Maltés
      { code: 'pl', name: this.GetLanguageName('pl') }, // Polaco
      { code: 'pt', name: this.GetLanguageName('pt') }, // Portugués
      { code: 'qu', name: this.GetLanguageName('qu') }, // Quechua
      { code: 'ro', name: this.GetLanguageName('ro') }, // Rumania, Moldavia, Moldavan
      { code: 'ru', name: this.GetLanguageName('ru') }, // Ruso
      { code: 'gd', name: this.GetLanguageName('gd') }, // Gaélico escocés, gaélico
      { code: 'sk', name: this.GetLanguageName('sk') }, // Eslovaca
      { code: 'sl', name: this.GetLanguageName('sl') }, // Esloveno
      { code: 'es', name: this.GetLanguageName('es') }, // Español
      { code: 'sv', name: this.GetLanguageName('sv') }, // Sueco
      { code: 'tr', name: this.GetLanguageName('tr') }, // Turco
      { code: 'uk', name: this.GetLanguageName('uk') }, // Ukraniano
    ];

    // Ordeno alfabéticamente por el nombre traducido
    languages = languages.sort(
      (a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      }
    );

    // Devuelvo el resultado
    return languages;
  }
}

// Convierte la primera letra a mayuscula o minuscula segun parametro
function ConvertCase(input: string, firstLetterCapital: boolean): string {
  if (firstLetterCapital) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  } else {
    return input.toLowerCase();
  }
}
