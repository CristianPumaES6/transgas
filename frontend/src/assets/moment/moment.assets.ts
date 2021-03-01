import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';

moment.locale();
momentTimezone().tz("America/Los_Angeles").format();

// AL ser una class lo tengo que poner en el constructor para que pueda ser utilizado.
export function getDate(): any {

    // lo desencripto
    return moment().format();
}

export function getYear(): string {

    // retornamos el año.
    return moment().format('YYYY');
}

export function stringToDate(fecha: any): string {

    let formatfecha = moment(fecha).format('MM-DD-YYYY');

    return formatfecha;
}


// retorna true si es valido false si no lo es.
export function validateDate(fecha: any): boolean {

    let result = !!moment(fecha).isValid();
    
    return result;
}

