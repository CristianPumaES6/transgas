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


export function ConvertDateUTC_To_FORMAT_UTC(dateUTC): string {
    let momentDate = moment.utc(dateUTC);

    return momentDate.format('YYYY-MM-DD HH:mm:ss');
}

// este convert retorna con -5 horas para que se registre en e; server
export function ConvertDateUTC_To_FORMAT_UTC_Menos5HorasLOCAL(dateUTC): string {
    let momentDate = moment.utc(dateUTC).subtract(5, 'hours');

    return momentDate.format('YYYY-MM-DD HH:mm:ss');
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
export function ConvertMomentUTC(dateUTC): moment.Moment {

    // lo desencripto
    return moment.utc(dateUTC);
}

export function ObtenerHoraDeDosStringUTC(fechaUTC: string, fechaUTC2: string): number {

    let result = 0;

    let fecha1 = moment.utc(fechaUTC);
    let fecha2 = moment.utc(fechaUTC2);


    var duration = moment.duration(fecha1.diff(fecha2));
    result = duration.asHours();

    return result;
}

export function GetHours(): any {
    return moment().format('HH mm ss');
}

