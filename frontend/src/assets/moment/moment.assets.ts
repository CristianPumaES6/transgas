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
// retorna true si es valido false si no lo es.

export function validateDate(fecha: any): boolean {

    let result = !!moment(fecha).isValid();

    return result;
}

export function TextMonthYear(date: any): string {
    let momentDate = moment(date, 'MM-DD-YYYY');
    let result = momentDate.format('MMMM') + ' ' + momentDate.format('YYYY')

    return result;
}

export function TextMonthDayYear(date: any): string {
    let momentDate = moment(date, 'MM-DD-YYYY');
    let result = momentDate.format('MMMM') + ' ' + momentDate.format('DD') + ' ' + momentDate.format('YYYY')

    return result;
}