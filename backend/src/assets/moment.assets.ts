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
export function ConvertDDMMYYYToYYYYMMDD(dateDDMMYYY: any): Date {

    let date = moment(dateDDMMYYY, "MM/DD/YYYY");

    return new Date(date.format("YYYY/MM/DD"));

}