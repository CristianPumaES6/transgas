
import * as fs from 'fs';

export function ReadFileContent(fileName: string, encode: string, safe?: boolean): Promise<string> {

    // Armo promesa para devolver
    return new Promise(function (resolve, reject) {
        // Leo el contenido del archivo
        try {
            fs.readFile(fileName, <any>encode, function (err: any, data: any) {
                if (err) {
                    if (safe)
                        return resolve(null);
                    else
                        return reject(err);
                } else {
                    return resolve(data);
                }
            });
        } catch (e) {
            // Algo fallo, lanzo error
            if (safe)
                resolve(null);
            else
                reject(e);
        }
    });
}