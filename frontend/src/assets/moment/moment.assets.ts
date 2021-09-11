import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';

moment.locale();
momentTimezone().tz("America/Los_Angeles").format();
//momentTimezone().tz("Africa/Abidjan").format();

// Revisar.
export function ConvertMoment(date): moment.Moment {

    // lo desencripto
    return moment(date);
}

export function ConvertMomentUTC(dateUTC): moment.Moment {

    // lo desencripto
    return moment.utc(dateUTC);
}

export function ConvertMMDDYYYYHHmmToMomment(dateMMDDYYYYHHmm):moment.Moment {
    return moment(dateMMDDYYYYHHmm,'MM/DD/YYYY HH:mm');
}

// AL ser una class lo tengo que poner en el constructor para que pueda ser utilizado.
export function GetDate(): any {

    // lo desencripto
    return moment().format();
}

export function getYear(): string {

    // retornamos el año.
    return moment().format('YYYY');
}

// convierte un string a una fecha, la fecha debe ser UTC,
export function stringToDate(fechaUTC: any): string {

    let formatfecha = moment.utc(fechaUTC);
    console.log(formatfecha);

    let text = formatfecha.local().format('MM-DD-YYYY');

    return text;
}

// obtiene el mes y el año de una fecha.
export function GetMonthYearFromDate(fechaUTC: any): string {

    let formatfecha = moment.utc(fechaUTC).local();

    let result = formatfecha.month() + '/' + formatfecha.year();
    return result;

}

// Convierte a un formate Date a un horario UTC.'MM-DD-YYYY'
export function FormatDate(fechaUTC: any): string {

    let formatfecha = moment.utc(fechaUTC).local().format('MM-DD-YYYY');

    return formatfecha;
}

// La primera fecha es la misma o es antes.
export function ComparePreviousDates(date1UTC: any, date2UTC: any): string {

    if (!date1UTC) return date2UTC;

    let d1 = moment.utc(date1UTC).local();
    let d2 = moment.utc(date2UTC).local();

    let condition = d1.isSameOrBefore(d2);
    if (condition) {
        return date1UTC;
    } else {
        return date2UTC;
    }

}


// La primera fecha es la misma o antes.
export function IsPrevious1Date(date1UTC: any, date2UTC: any): boolean {


    if (!date1UTC) return false;

    let d1 = moment.utc(date1UTC).local();
    let d2 = moment.utc(date2UTC).local();

    let condition = d1.isSameOrBefore(d2);
    if (condition) {
        return true;
    } else {
        return false;
    }

}

// Devuelven los dias que han pasado.
export function DiffDates(date1UTC: any, date2UTC: any): number {


    if (!date1UTC) return date2UTC;

    let d1 = moment.utc(date1UTC).local();
    let d2 = moment.utc(date2UTC).local();

    let nDay = d1.diff(d2, 'days');
    return -nDay;
}


// La primera fecha es la misma o es despues.
export function CompareAfterDates(date1UTC: any, date2UTC: any): string {


    if (!date1UTC) return date2UTC;

    let d1 = moment.utc(date1UTC).local();
    let d2 = moment.utc(date2UTC).local();

    let condition = d1.isSameOrAfter(d2);
    if (condition) {
        return date1UTC;
    } else {
        return date2UTC;
    }

}


// Verifica si la fecha es antes o no, revisar como esta entrando
export function IsAfter1Date(date1UTC: any, date2UTC: any): boolean {
    
    let d1 = moment.utc(date1UTC).local();
    let d2 = moment.utc(date2UTC).local();

    if (!date1UTC) return false;


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
export function TextMonthYearFormatYYYYMMDD(dateUTC: any): string {

    // Convertimos el string en formato moment,
    // Con el formato YYYY MM DD
    let momentDate = moment.utc(dateUTC).local();

    let result = momentDate.format('MMMM') + ' ' + momentDate.format('YYYY')

    return result;
}

// ESTA FUNCION DEVUELVE EN TEXTO EL MES Y AÑO DE UN FORMATO EXPECIFICO.
export function GetYearFromDate(dateUTC: any): string {

    // Convertimos el string en formato moment,
    // Con el formato YYYY MM DD
    let momentDate = moment.utc(dateUTC).local();

    let result = momentDate.format('YYYY')

    return result;
}



// ESTA FUNCION DEVUELVE EN TEXTO EL DIA, EL MES Y AÑO DE UN FORMATO EXPECIFICO.
export function TextMonthDayYearFormatYYYYMMDD(dateUTC: any): string {

    // Convertimos el string en formato moment,
    // Con el formato YYYY MM DD
    let momentDate = moment.utc(dateUTC).local();

    let result = momentDate.format('MMMM') + ' ' + momentDate.format('DD') + ', ' + momentDate.format('YYYY')

    return result;
}


// retorna el primero y ultimo dia del mes de la fecha enviada.
export function FisrtOldDayFromDate(dateUTC: any): any {

    if (!dateUTC) return null;

    let momentDate = moment.utc(dateUTC).local();

    const startOfMonth = momentDate.startOf('month').format('YYYY-MM-DD HH:mm');
    const endOfMonth = momentDate.endOf('month').format('YYYY-MM-DD HH:mm');

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


// Tal cual es Año mes y dia, tal cual lo retorna
export function FormatYYYYMMDDToSTRING(date: any): string {

    
    let momentDate = moment(date, 'YYYY-MM-DD');

    let result = momentDate.format('YYYY-MM-DD')
    
    return result;
}


// esto lo voy a quitar.
// Revisar si es necesario, el query como esta trabajando aqui?
export function AddOneDayAndConvertYYYYMMDDToSTRING(date: any): string {

    
    let momentDate = moment(date, 'YYYY-MM-DD');

    momentDate.add(1, 'd');

    let result = momentDate.format('YYYY-MM-DD')
    
    return result;
}


export function FormatDateUTCToDateHour(dateUTC:any): string{
    // Con el formato YYYY MM DD
    let momentDate = moment.utc(dateUTC);

    let local = momentDate.local();

    let format =local.format('MM/DD/YYYY HH:mm');
    
    return format;
}

// revisar, 
// ESTA FUNCION junta una fecha y le setea una hora.
// revisar como lo esta asiendo.
export function ConvertirDateHourToMoment(dateLocal: any, hourLocal: any): moment.Moment {

    // Convertimos el string en formato moment,
    // Con el formato YYYY MM DD
    let momentDate = moment(dateLocal, 'YYYY-MM-DD');

    momentDate.add(hourLocal);

    let momentLastDaily = moment(momentDate, 'YYYY-MM-DD HH:mm');

    return momentLastDaily;
}

export function DiferentHourTwoMoment(moment1: moment.Moment, moment2: moment.Moment): number {

    let result: number;

    let minutes = moment1.diff(moment2, 'minutes');
    let hours = minutes / 60;

    result = hours;
    return result;
}
