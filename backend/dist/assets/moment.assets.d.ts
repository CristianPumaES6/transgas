import * as moment from 'moment';
export declare function GetDate(): any;
export declare function ConvertMMDDYYYToYYYYMMDD(dateMMDDYYY: any): Date;
export declare function FormatDateUTCToDateHour(dateUTC: any): string;
export declare function ConvertDateUTC_To_FORMAT_UTC(dateUTC: any): string;
export declare function FormatDateSumDays(dateUTC: any, subtractDays: number): string;
export declare function ConvertMomentUTC(dateUTC: any): moment.Moment;
export declare function ObtenerHoraDeDosStringUTC(fechaUTC: string, fechaUTC2: string): number;
