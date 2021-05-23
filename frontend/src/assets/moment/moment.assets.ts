import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';

moment.locale();
momentTimezone().tz("America/Los_Angeles").format();

// AL ser una class lo tengo que poner en el constructor para que pueda ser utilizado.
export function GetDate(): any {

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

export function GetMonthYearFromDate(fecha: any): string {

    let formatfecha = moment(fecha);

    let result = formatfecha.month() + '/' + formatfecha.year();
    return result;

}

export function FormatDate(fecha: any): string {

    let formatfecha = moment(fecha).format('MM-DD-YYYY');

    return formatfecha;
}

export function ComparePreviousDates(date1: any, date2: any): String {


    if (!date1) return date2;

    let d1 = moment(date1, 'YYYY-MM-DD');
    let d2 = moment(date2, 'YYYY-MM-DD');

    let condition = d1.isSameOrBefore(d2);
    if (condition) {
        return date1;
    } else {
        return date2;
    }

}
export function IsPrevious1Date(date1: any, date2: any): boolean {


    if (!date1) return false;

    let d1 = moment(date1, 'YYYY-MM-DD');
    let d2 = moment(date2, 'YYYY-MM-DD');

    let condition = d1.isSameOrBefore(d2);
    if (condition) {
        return true;
    } else {
        return false;
    }

}

export function DiffDates(date1: any, date2: any): number {


    if (!date1) return date2;

    let d1 = moment(date1, 'YYYY-MM-DD');
    let d2 = moment(date2, 'YYYY-MM-DD');

    let nDay = d1.diff(d2, 'days');
    return -nDay;
}


export function CompareAfterDates(date1: any, date2: any): String {


    if (!date1) return date2;

    let d1 = moment(date1, 'YYYY-MM-DD');
    let d2 = moment(date2, 'YYYY-MM-DD');

    let condition = d1.isSameOrAfter(d2);
    if (condition) {
        return date1;
    } else {
        return date2;
    }

}


export function IsAfter1Date(date1: any, date2: any): boolean {


    if (!date1) return false;

    let d1 = moment(date1, 'YYYY-MM-DD');
    let d2 = moment(date2, 'YYYY-MM-DD');

    let condition = d1.isSameOrAfter(d2);
    if (condition) {
        return true;
    } else {
        return false;
    }

}
// retorna true si es valido false si no lo es.

export function validateDate(fecha: any): boolean {

    let result = !!moment(fecha).isValid();

    return result;
}

// ESTA FUNCION DEVUELVE EN TEXTO EL MES Y AÑO DE UN FORMATO EXPECIFICO.
export function TextMonthYearFormatYYYYMMDD(date: any): string {

    // Convertimos el string en formato moment,
    // Con el formato YYYY MM DD
    let momentDate = moment(date, 'YYYY-MM-DD');

    let result = momentDate.format('MMMM') + ' ' + momentDate.format('YYYY')

    return result;
}


// ESTA FUNCION DEVUELVE EN TEXTO EL DIA, EL MES Y AÑO DE UN FORMATO EXPECIFICO.
export function TextMonthDayYearFormatYYYYMMDD(date: any): string {

    // Convertimos el string en formato moment,
    // Con el formato YYYY MM DD
    let momentDate = moment(date, 'YYYY-MM-DD');

    let result = momentDate.format('MMMM') + ' ' + momentDate.format('DD') + ', ' + momentDate.format('YYYY')

    return result;
}


// retorna el primero y ultimo dia del mes de la fecha enviada.
export function FisrtOldDayFromDate(date: any): any {
    if (!date) return null;

    let momentDate = moment(date, 'YYYY-MM-DD');

    const startOfMonth = momentDate.startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth = momentDate.endOf('month').format('YYYY-MM-DD hh:mm');

    return {
        start: startOfMonth,
        end: endOfMonth
    }
}


export function FormatYYYYMMDD(date: any): string {

    let momentDate = moment(date, 'YYYY-MM-DD');

    let result = momentDate.format('MM-DD-YYYY')

    return result;
}


export function FormatYYYYMMDDToSTRING(date: any): string {

    
    let momentDate = moment(date, 'YYYY-MM-DD');

    let result = momentDate.format('YYYY-MM-DD')
    
    return result;
}

// ESTA FUNCION junta una fehca y le setea una ora.
export function ConvertirDateHourToMoment(date: any, hour: any): moment.Moment {

    // Convertimos el string en formato moment,
    // Con el formato YYYY MM DD
    let momentDate = moment(date, 'YYYY-MM-DD');

    momentDate.add(hour);


    let momentLastDaily = moment(momentDate, 'YYYY-MM-DD hh:mm');

    return momentLastDaily;
}
// ESTA FUNCION junta una fehca y le setea una ora.
export function ConvertirDateToMoment(date: any): moment.Moment {

    // Convertimos el string en formato moment,
    // Con el formato YYYY MM DD
    let momentDate = moment(date, 'YYYY-MM-DD hh:mm');



    let momentLastDaily = moment(momentDate, 'YYYY-MM-DD hh:mm');

    return momentLastDaily;
}

export function DiferentHourTwoMoment(moment1: moment.Moment, moment2: moment.Moment): number {

    let result: number;

    let minutes = moment1.diff(moment2, 'minutes');
    let hours = minutes / 60;

    result = hours;
    return result;
}
