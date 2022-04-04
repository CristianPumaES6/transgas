import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';

moment.locale();
momentTimezone().tz("America/Los_Angeles").format();
//momentTimezone().tz("Africa/Abidjan").format();

// AL ser una class lo tengo que poner en el constructor para que pueda ser utilizado.
export function GetDate(): any {

    // lo desencripto
    return moment().format();
}


// Convierte el formato de fecha.
export function ConvertMMDDYYYToYYYYMMDD(dateMMDDYYY: any): Date {

    let date = moment(dateMMDDYYY, "MM/DD/YYYY");

    return new Date(date.format("YYYY/MM/DD"));

}


export function FormatDateUTCToDateHour(dateUTC: any): string {
    // Con el formato YYYY MM DD
    let momentDate = moment.utc(dateUTC);

    let local = momentDate.local();

    let format = local.format('MM/DD/YYYY HH:mm');

    return format;
}


// Resta una cantidad de dias a una fecha utc.
export function FormatDateSumDays(dateUTC: any, subtractDays: number): string {
    // Con el formato YYYY MM DD
    let momentDate = moment.utc(dateUTC);
    // Restamos los dias.
    let subtract = momentDate.subtract(subtractDays, 'days');

    // damos formato a una fecha.
    return subtract.format('YYYY-MM-DD HH:mm:ss') + 'Z';
}