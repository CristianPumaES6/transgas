import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { en } from '../languages/en';
import { es } from '../languages/es';
let LanguageService = class LanguageService {
    constructor() {
        // Lenguajes soportados
        this.suportedLanguages = ['es', 'en', 'pt', 'fr'];
        // Idioma del usuario logueado
        this.currentLanguage = 'en'; // this.GetBrowserLanguage();
        // Evento de cambio de idioma
        this.onLanguageChanged = new Subject();
    }
    // Devuelve el lenaguaje en uso
    GetCurrentLanguage() {
        return this.currentLanguage;
    }
    // Actualiza el lenaguaje en uso
    SetCurrentLanguage(languageCode) {
        // Guardo el idioma anterior
        let oldLanguate = this.currentLanguage;
        // Actualizo el idioma del usuario
        this.currentLanguage = languageCode || this.currentLanguage;
        //Guardamos lenguaje actual en LocalSstorage
        localStorage.setItem('UserLanguage', this.currentLanguage);
        // Si se cambió el idioma disparo evento
        if (this.currentLanguage !== oldLanguate)
            this.onLanguageChanged.next(this.currentLanguage);
    }
    // Devuelve la traduccion de un mensaje dentro de una categoria
    GetMessage(category, message, language, separator) {
        // Resultado a devolver (por defecto el message recibido)
        let result = message || '';
        // Si no tengo separador por defecto uso el pipe
        separator = separator || '|';
        // Acomodo el input
        let categoryKey = category || '';
        let messageKey = message || '';
        // Busco los argumentos que me pueden llegar con el separador
        let messagesArgs = messageKey.split(separator);
        // El mensaje es el primer elemento del array (lo quito y me lo quedo)
        messageKey = messagesArgs.shift();
        // Paso el mensaje a mayuscula
        messageKey = messageKey.toUpperCase();
        // Si no recibo language para el resultado, uso el default
        let resultLanguage = (language || this.currentLanguage).toLowerCase();
        // Devuelvo segun el idioma recibido
        switch (resultLanguage) {
            // Español
            case 'es':
                if (es[categoryKey] && es[categoryKey][messageKey] !== undefined && es[categoryKey][messageKey] !== null)
                    result = es[categoryKey][messageKey];
                break;
            // Portugues
            case 'pt':
                if (en[categoryKey] && en[categoryKey][messageKey] !== undefined && en[categoryKey][messageKey] !== null)
                    result = en[categoryKey][messageKey];
                break;
            // Frances
            case 'fr':
                if (en[categoryKey] && en[categoryKey][messageKey] !== undefined && en[categoryKey][messageKey] !== null)
                    result = en[categoryKey][messageKey];
                break;
            // Ingles
            case 'en':
            default:
                if (en[categoryKey] && en[categoryKey][messageKey] !== undefined && en[categoryKey][messageKey] !== null)
                    result = en[categoryKey][messageKey];
                break;
        }
        // Si tengo argumentos, los reemplazo del mensaje obtenido
        if (result && messagesArgs && messagesArgs.length > 0) {
            // Expresion para buscar los parametros dentro del texto
            let regexp = /{([0-9]*)}/g;
            // Busco y reemplazo argumentos en el mensaje
            result = result.replace(regexp, (match, $1) => {
                try {
                    // Intento parsear el indice con el que se hizo match
                    let index = parseInt($1);
                    // Busco el argumento correspondiente al indice recibido, sino se reemplaza con vacio
                    return (messagesArgs && messagesArgs.length > index ? messagesArgs[index] : '');
                }
                catch (err) {
                    // Si algo falla reemplazo con vacío
                    return '';
                }
            });
        }
        // Si no esta en la lista, devuelvo el codigo del mensaje
        return result;
    }
    // Devuelve la traduccion de una ayuda dentro de una categoria
    GetHelp(category, message, language, separator) {
        // A la categoria le agrego el sufijo y obtengo el mensaje
        return this.GetMessage(category + 'Help', message, language, separator);
    }
    // Devuelve el nombre del pais a partir del codigo ISO 3166-1 (A2)
    GetCountryName(countryCode, language) {
        // La categoria en este caso es isoLanguages
        let category = 'isoCountries';
        // Llamo a la funcion principal para obtener mensajes
        return this.GetMessage(category, countryCode, language);
    }
    // Devuelve el nombre del idioma a partir del codigo ISO 639-1
    GetLanguageName(languageCode, language) {
        // La categoria en este caso es isoLanguages
        let category = 'isoLanguages';
        // Llamo a la funcion principal para obtener mensajes
        return this.GetMessage(category, languageCode, language);
    }
    // Devuelve la lista de nombres de meses
    GetMonths(language, firstLetterCapital) {
        // La categoria en este caso es isoLanguages
        let category = 'months';
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
    GetShortMonths(language, firstLetterCapital) {
        // La categoria en este caso es isoLanguages
        let category = 'shortMonths';
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
    GetWeekDays(language, firstLetterCapital) {
        // La categoria en este caso es isoLanguages
        let category = 'weekDays';
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
    GetHighchartsLogDateFormat(language) {
        // Si no recibo language para el resultado, uso el current
        let resultLanguage = (language || this.currentLanguage).toLowerCase();
        // Resultado a devolver
        let format;
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
    GetBrowserLanguage() {
        //Busco si el lenguaje ya se encuentra guardado en localStorage
        let storedLanguage = localStorage.getItem('UserLanguage');
        if (storedLanguage)
            return storedLanguage;
        // Obtengo el codigo de idioma del navegador.
        let lang = navigator.language || navigator.userLanguage || navigator.browserLanguage || 'en';
        // Me quedo solo con el codigo inicial
        if (lang)
            lang = lang.slice(0, 2);
        // Verifico que el idioma obtenido sea uno de los soportados
        if (!this.suportedLanguages.includes(lang))
            lang = 'en';
        // Devuelvo el dato obtenido
        return lang;
    }
    GetLanguagesExtended() {
        // Armo el array de idiomas
        let languages = [
            { code: 'eu', name: this.GetLanguageName('eu') },
            { code: 'bg', name: this.GetLanguageName('bg') },
            { code: 'ca', name: this.GetLanguageName('ca') },
            { code: 'en', name: this.GetLanguageName('en') },
            { code: 'fr', name: this.GetLanguageName('fr') },
            { code: 'gl', name: this.GetLanguageName('gl') },
            { code: 'de', name: this.GetLanguageName('de') },
            { code: 'el', name: this.GetLanguageName('el') },
            { code: 'he', name: this.GetLanguageName('he') },
            { code: 'ga', name: this.GetLanguageName('ga') },
            { code: 'it', name: this.GetLanguageName('it') },
            { code: 'la', name: this.GetLanguageName('la') },
            { code: 'lb', name: this.GetLanguageName('lb') },
            { code: 'lt', name: this.GetLanguageName('lt') },
            { code: 'mt', name: this.GetLanguageName('mt') },
            { code: 'pl', name: this.GetLanguageName('pl') },
            { code: 'pt', name: this.GetLanguageName('pt') },
            { code: 'qu', name: this.GetLanguageName('qu') },
            { code: 'ro', name: this.GetLanguageName('ro') },
            { code: 'ru', name: this.GetLanguageName('ru') },
            { code: 'gd', name: this.GetLanguageName('gd') },
            { code: 'sk', name: this.GetLanguageName('sk') },
            { code: 'sl', name: this.GetLanguageName('sl') },
            { code: 'es', name: this.GetLanguageName('es') },
            { code: 'sv', name: this.GetLanguageName('sv') },
            { code: 'tr', name: this.GetLanguageName('tr') },
            { code: 'uk', name: this.GetLanguageName('uk') }, // Ukraniano
        ];
        // Ordeno alfabéticamente por el nombre traducido
        languages = languages.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase())
                return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase())
                return 1;
            return 0;
        });
        // Devuelvo el resultado
        return languages;
    }
};
LanguageService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [])
], LanguageService);
export { LanguageService };
// Convierte la primera letra a mayuscula o minuscula segun parametro
function ConvertCase(input, firstLetterCapital) {
    if (firstLetterCapital) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
    else {
        return input.toLowerCase();
    }
}
//# sourceMappingURL=language.service.js.map