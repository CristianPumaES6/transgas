import { NestExpressApplication } from '@nestjs/platform-express';
export declare function GetHbsHtml(): any;
export declare function HbsInit(app: NestExpressApplication): Promise<boolean>;
export declare function HbsConvertHtmlRender(fileHbs: string, objRender: any): Promise<string>;
