/// <reference types="node" />
import { MailLastVoyage } from 'src/models/sendMailConfig';
export declare function NodemailerInit(): Promise<boolean>;
export declare function MailSendSMTP(from: string, to: string, subject: string, body: string, htmlBody?: boolean, cc?: string, bcc?: string, attachments?: any): Promise<any>;
export declare function SendMailHTMLValidate(to: string, name: string, token: string): Promise<boolean>;
export declare function SendMailForgotPsw(to: string, name: string, token: string): Promise<boolean>;
export declare function SendMailArchiveInfoLastVoyage(to: string, name: string, title: string, bufferFile: Buffer, mailLastVoyage: MailLastVoyage): Promise<boolean>;
export declare function SendMailHTMLLubricante(to: string, texto: string): Promise<boolean>;
export declare function SendMailHTMLOverCosumption(to: string, name: string, dateSend: any, listConsumptionLubricant: any): Promise<boolean>;
