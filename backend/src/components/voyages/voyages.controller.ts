import { Controller, Query, Get, Post, Put, Delete, Body, UseGuards, Param, HttpException, HttpStatus, Headers } from '@nestjs/common';

// Assets || Si es una class lo tego que poner en el constructor y como provverdor del modulo
import { DummyPromise } from '../../assets/promises.assets';
import { JwtDecode } from '../../assets/jwtDecode.assets';

// 1 Importo los servicios
import { VoyagesService } from './voyages.service';

// Entity
import { ImportVoyage, Voyage, VoyageFilterByYears } from '../../models/voyage.entity';
import { UserEntity } from '../../models/user.entity';
import { ConvertMMDDYYYToYYYYMMDD, GetDate } from '../../assets/moment.assets';
import { Port } from '../../models/port.entity';
import { PortsService } from './ports/ports.service';
import { DailyReport } from '../../models/daily-report.entity';
import { DailyReportsService } from './daily-reports/daily-reports.service';


@Controller('voyages')
export class VoyagesController {

    constructor(
        private readonly _voyagesService: VoyagesService,
        private readonly _portsService: PortsService,
        private readonly _dailyReportsService: DailyReportsService,
    ) { }


    @Get('byYears')
    async GetsByYear(@Headers() headers, @Query() voyageFilterByYears: VoyageFilterByYears): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                if (voyageFilterByYears) {
                    // Tiene que llegar el userId
                    if (!voyageFilterByYears.userId) {
                        throw new Error('MISSING_FIELS');
                    } else {
                        // Validamos que el userId sea el mismo que el del token
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT' || headerToken.role == 'OWNER') {
                            // Nose hace nada
                        } else if ((Number(voyageFilterByYears.userId) !== Number(headerToken.id))) throw new Error('ERROR_USERID_FAIL');
                        return true;
                    }
                } else throw new Error('MISSING_FIELS');


            }
        ).then(
            (resultValidate: Boolean) => {


                voyageFilterByYears.years = JSON.parse('' + voyageFilterByYears.years);
                // Ejecutamos el servicio de obtener sailingAnalities.
                return this._voyagesService.GetsByYears(voyageFilterByYears);
            }
        ).then(
            (results: Voyage[]) => {

                // Retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: results
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Get('detail')
    async GetsDetail(@Headers() headers, @Query() voyage: Voyage, @Query('page') page: number): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                if (voyage) {
                    // Si no existe el user id tiene que ser admin o suppor para seguir
                    if (!voyage.userId) {
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            return true;
                        } else throw new Error('MISSING_FIELS');
                    } else {
                        // Validamos que el userId sea el mismo que el del token
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            // Nose hace nada
                        } else if ((Number(voyage.userId) !== Number(headerToken.id))) throw new Error('ERROR_USERID_FAIL');
                        return true;
                    }
                } else throw new Error('MISSING_FIELS');


            }
        ).then(
            (resultValidate: Boolean) => {

                // Ejecutamos el servicio de obtener sailingAnalities.
                return this._voyagesService.GetsDetails(voyage, page);
            }
        ).then(
            (results: Voyage[]) => {

                // Retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: results
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Get(':id')
    async Get(@Param('id') id): Promise<any> {

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos recibidos sean los correctos.
                if (Number(id)) {
                    let voyageId = Number(id);
                    return this._voyagesService.Get(voyageId);
                } else {
                    // caso contrario retornamos un error
                    throw 'MISSING_FIELS';
                }

            }
        ).then(
            (resultGet: Voyage) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultGet
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Get()
    async Gets(@Headers() headers, @Query() voyage: Voyage, @Query('page') page: number): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos sean los necesarios.
                if (voyage) {
                    // Si no existe el user id tiene que ser admin o suppor para seguir
                    if (!voyage.userId) {
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            return true;
                        } else throw new Error('MISSING_FIELS');
                    } else {
                        // Validamos que el userId sea el mismo que el del token
                        if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                            // Nose hace nada
                        } else if (Number(voyage.userId) !== Number(headerToken.id)) throw new Error('ERROR_USERID_FAIL');
                        return true;
                    }
                } else throw new Error('MISSING_FIELS');


            }
        ).then(
            (resultValidate: Boolean) => {

                // Ejecutamos el servicio de obtener sailingAnalities.
                return this._voyagesService.Gets(voyage, page);
            }
        ).then(
            (results: Voyage[]) => {

                // Retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: results
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Post('create')
    async CreateVoyage(@Headers() headers, @Body() voyage: Voyage): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        return DummyPromise().then(
            (resultDummy: Boolean) => {
                // Validamos que esten llegando los datos necesarios.
                if (voyage && Number(voyage.userId) && Number(voyage.voyageNumber) && Number(voyage.year) && headerToken && headerToken.id) {

                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        // NO se hace nada
                    } else if (voyage.userId !== headerToken.id) throw new Error('ERROR_USERID_FAIL');

                    delete voyage.id;
                    // Auditoria.
                    voyage.userIdCreated = headerToken.id;
                    voyage.dateCreated = GetDate();
                    delete voyage.userIdUpdated;
                    delete voyage.dateUpdated;
                    voyage.status = Boolean(voyage.status);
                    // Ejecutamos la funcion que registra en bd.
                    return this._voyagesService.Create(voyage);
                }
                else throw 'MISSING_FIELS';
            }
        ).then(
            (resultCreate: Voyage) => {

                // retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultCreate
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');


                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Put(':id/update')
    async Update(@Headers() headers, @Param('id') id, @Body() voyage: Voyage): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos los datos del objeto a registar.
                if (voyage && voyage.userId && voyage.voyageNumber && voyage.year && headerToken && headerToken.id) {
                    voyage.id = Number(id);

                    if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                        // No se hace nada
                    } else if (Number(headerToken.id) !== Number(voyage.userId)) throw new Error('ERROR_USERID_FAIL');

                    // Auditoria.
                    delete voyage.userIdCreated;
                    delete voyage.dateCreated;
                    voyage.userIdUpdated = headerToken.id;
                    voyage.dateUpdated = GetDate();
                    voyage.status = Boolean(voyage.status);
                    // Ejecutamos la funcion que actualiza el obj en la bd.
                    return this._voyagesService.Update(voyage);

                } else {

                    // Enviar los datos necesarios.
                    throw 'MISSING_FIELS';

                }
            }
        ).then(
            (resultUpdate: Voyage) => {

                // Validamos el resultado
                if (!resultUpdate) throw new Error('TYPEORM_UPDATE_VOYAGE');

                // Retornamos una! Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultUpdate
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // Caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    @Delete(':id/delete')
    async DeletePort(@Headers() headers, @Param('id') id): Promise<any> {

        // Le asigno el valor al token desde la cabecera.
        // Lo decodifico con otra libreria por problemas jwt-module.
        let headerToken: UserEntity = JwtDecode(headers.authorization);

        // Inicio una promesa Dummy.
        return DummyPromise().then(
            (resultDummy: Boolean) => {

                // Validamos que los datos sean los necesarios.
                if (Number(id)) {
                    // Decodeamos.
                    return this._voyagesService.Get(id);

                } else {
                    // Enviar los datos necesarios.
                    throw new Error('MISSING_FIELS');

                }

            }
        ).then(
            (result: Voyage) => {

                if (headerToken.role == 'ADMIN' || headerToken.role == 'SUPPORT') {
                    // No se hace nada
                } else if (Number(headerToken.id) !== Number(result.userId)) throw new Error('ERROR_USERID_FAIL');

                result.status = false;

                delete result.userIdCreated;
                delete result.dateCreated;
                result.userIdUpdated = headerToken.id;
                result.dateUpdated = GetDate();
                return this._voyagesService.Delete(result);
            }
        ).then(
            (resultDelete: Voyage) => {

                // Retornamos una Respuesta exitosa.
                return {
                    status: HttpStatus.OK,
                    message: 'OK',
                    data: resultDelete
                };
            }
        ).catch(
            err => {
                // Obtengo mensajes de error
                const clientMsg: string = (typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST');
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST');

                // caso contrario retornamos un error
                throw new HttpException({
                    status: HttpStatus.ACCEPTED,
                    error: clientMsg,
                    message: errorMsg,
                }, HttpStatus.ACCEPTED);
            }
        );
    }

    // Registra viajes desde un arreglo del objeto Port.
    @Post('importVoyages')
    async ImportJSONVoyages(@Headers() headers, @Body() ImportVoyages: ImportVoyage[]): Promise<any> {
        
        try {
            
            let headerToken: UserEntity = JwtDecode(headers.authorization);

            if (!(headerToken.role === 'SUPPORT')) {
                return 'HOLA QUE HACES? Escribeme WSP => +51976873362';
            }
    
            let MappingVoyage: Mapping[] = [];
            let MappingPort: Mapping[] = [];
            
            for await (const importVoyage of ImportVoyages) {
    
                let existeViaje = searchKey(MappingVoyage, importVoyage.voyageNumber);
    
                let userId= importVoyage.userId;
                // Consultamos si el numero de viaje ya lo tenemos mapeado.
                // Si no lo tuvieramos lo registrariamos.
                if (!existeViaje) {
    
                    // Hacemos una consulta si tenemos el numero de viaje en tal año.
                    let voyageExistente = await this._voyagesService.ThisVoyageNumberExists(importVoyage.voyageNumber, importVoyage.year,userId);
    
                    // Si no existe lo registraremos en la BD caso contrario solo lo agregamos al mapping
                    if (!voyageExistente) {
    
                        // ARMAMOS AL NUEVO VIAJE
                        let newVoyage = new Voyage();
                        delete newVoyage.id;
                        newVoyage.userId = importVoyage.userId;
                        newVoyage.voyageNumber = importVoyage.voyageNumber;
                        newVoyage.year = importVoyage.year;
                        // Auditoria.
                        newVoyage.userIdCreated = headerToken.id;
                        newVoyage.dateCreated = GetDate();
                        delete newVoyage.userIdUpdated;
                        delete newVoyage.dateUpdated;
                        newVoyage.status = true;
    
                        // LO REGISTRAMOS
                        let voyageRegister = await this._voyagesService.Create(newVoyage);
    
                        // Lo agregamos al mapping
                        MappingVoyage.push(new Mapping(importVoyage.voyageNumber, voyageRegister.id))
                        // Reset mapping Port
                        MappingPort = [];
                    } else {
                        // Agregamos al mapping el id buscado por numero de viaje.
                        MappingVoyage.push(new Mapping(importVoyage.voyageNumber, voyageExistente.id))
                    }
                }

                // Actualizamos el viaje
                existeViaje = searchKey(MappingVoyage, importVoyage.voyageNumber);
    













                // Consultamos si tenemos mapeado el puerto.
                // Si no lo tuvieramos lo registrariamos.
                let existePort = searchKey(MappingPort, importVoyage.portNumber);
                if (!existePort) {
    
                    // Consultamos si existe el numero de puerto en el viaje.
                    let portExiste = await this._portsService.ThereIsThisPortInTheVoyage(importVoyage.portNumber, existeViaje.value,userId)
                                                          
    
                    // Si no existe lo registraremos en la BD caso contrario solo lo agregamos al mapping
                    if (!portExiste) {
                        let newPort = new Port();
                        delete newPort.id;
                        newPort.userId = importVoyage.userId;
                        newPort.voyageId = existeViaje.value;
                        newPort.departurePort = importVoyage.departurePort;
                        newPort.arrivalPort = importVoyage.arrivalPort;
                        newPort.portNumber = importVoyage.portNumber
                        // Auditoria.
                        newPort.userIdCreated = headerToken.id;
                        newPort.dateCreated = GetDate();
                        delete newPort.userIdUpdated;
                        delete newPort.dateUpdated;
                        newPort.status = true;
    
                        // Lo registramos
                        let portRegister = await this._portsService.Create(newPort);
                        MappingPort.push(new Mapping(importVoyage.portNumber, portRegister.id))
                    } else {
                        // Agregamos al mapping el id buscado por numero de viaje.
                        MappingPort.push(new Mapping(importVoyage.portNumber, portExiste.id))
                    }
    
                }
                // Actualizamos el puerto
                existePort = searchKey(MappingPort, importVoyage.portNumber);
    










                
                // Armamos el obj de reporte.
                let newReport = new DailyReport();
                delete newReport.id;
                newReport.userId = importVoyage.userId;
                newReport.portId = existePort.value;
    
               // ---- - - - --  \ MODIFICAR SIEMPRE ESTO A NUESTRA CONVENIENCIA LA FECHA Y LA HORA \ ------
               let  textoCadena:string = importVoyage.date;

        /*        if(importVoyage.date.length == 15){
               newReport.date = <any> textoCadena.slice(0,-7)
               } else if(importVoyage.date.length == 14){
                newReport.date = <any> textoCadena.slice(0,-6)
                }
                else{
                    console.log('REVISAR LA FECHA ERROR') 
                    throw  'REVISAR LA FECHA ERRROR'
                } */
                newReport.date = <any> textoCadena;
               newReport.hour = importVoyage.hour.slice(-5)

                /* 
                // Verificamos si existe una hora,
                if (importVoyage.hour) {
                    // Verificamos el tamaño de la hora,
                    // Lo normal seria 03:00 esto seria un total de 5 caracteres
                    // entonces si solo tiene 4 caracteres le aumentamos el caracter 0
                    if (importVoyage.hour.length === 4) {
                        // concatenamos el 0 a la hora.
                        newReport.hour = '0' + importVoyage.hour;
                    } else {
                        newReport.hour = importVoyage.hour;
                    }
                } */

                // -*--------------------------FIN MODIFICACION

                
    

                newReport.mplaIfo = importVoyage.mplaIfo || 0;
                newReport.auxIfo = importVoyage.auxIfo || 0;
                newReport.boilerIfo = importVoyage.boilerIfo || 0;
                newReport.otherIfo = importVoyage.otherIfo || 0;
                newReport.mplaMgo = importVoyage.mplaMgo || 0;
                newReport.auxMgo = importVoyage.auxMgo || 0;
                newReport.boilerMgo = importVoyage.boilerMgo || 0;
                newReport.ppMgo = importVoyage.ppMgo || 0;
                newReport.giMgo = importVoyage.giMgo || 0;
                newReport.otherMgo =  importVoyage.otherMgo || 0;
                newReport.steamingTime = importVoyage.steamingTime || 0;
                newReport.distance = importVoyage.distance || 0;
    
                if (!importVoyage.beaufour) {
                    newReport.beaufour = '';
                } else if (importVoyage.beaufour === 's1' || importVoyage.beaufour === 'S1' || importVoyage.beaufour === 's 1' || importVoyage.beaufour == 'S 1' || importVoyage.beaufour === '1s' || importVoyage.beaufour === '1S' || importVoyage.beaufour === '1 s' || importVoyage.beaufour == '1 S' || importVoyage.beaufour == '1.00' || importVoyage.beaufour == '1') {
                    newReport.beaufour = 'S1';
                } else if (importVoyage.beaufour === 's2' || importVoyage.beaufour === 'S2' || importVoyage.beaufour === 's 2' || importVoyage.beaufour == 'S 2' || importVoyage.beaufour === '2s' || importVoyage.beaufour === '2S' || importVoyage.beaufour === '2 s' || importVoyage.beaufour == '2 S' || importVoyage.beaufour == '2.00' || importVoyage.beaufour == '2') {
                    newReport.beaufour = 'S2';
                } else if (importVoyage.beaufour === 's3' || importVoyage.beaufour === 'S3' || importVoyage.beaufour === 's 3' || importVoyage.beaufour == 'S 3' || importVoyage.beaufour === '3s' || importVoyage.beaufour === '3S' || importVoyage.beaufour === '3 s' || importVoyage.beaufour == '3 S' || importVoyage.beaufour == '3.00' || importVoyage.beaufour == '3') {
                    newReport.beaufour = 'S3';
                } else if (importVoyage.beaufour === 's4' || importVoyage.beaufour === 'S4' || importVoyage.beaufour === 's 4' || importVoyage.beaufour == 'S 4' || importVoyage.beaufour === '4s' || importVoyage.beaufour === '4S' || importVoyage.beaufour === '4 s' || importVoyage.beaufour == '4 S' || importVoyage.beaufour == '4.00' || importVoyage.beaufour == '4') {
                    newReport.beaufour = 'S4';
                } else if (importVoyage.beaufour === 's5' || importVoyage.beaufour === 'S5' || importVoyage.beaufour === 's 5' || importVoyage.beaufour == 'S 5' || importVoyage.beaufour === '5s' || importVoyage.beaufour === '5S' || importVoyage.beaufour === '5 s' || importVoyage.beaufour == '5 S' || importVoyage.beaufour == '5.00' || importVoyage.beaufour == '5') {
                    newReport.beaufour = 'S5';
                } else if (importVoyage.beaufour === 's6' || importVoyage.beaufour === 'S6' || importVoyage.beaufour === 's 6' || importVoyage.beaufour == 'S 6' || importVoyage.beaufour === '6s' || importVoyage.beaufour === '6S' || importVoyage.beaufour === '6 s' || importVoyage.beaufour == '6 S' || importVoyage.beaufour == '6.00' || importVoyage.beaufour == '6') {
                    newReport.beaufour = 'S6';
                } else {
                    newReport.beaufour = importVoyage.beaufour;
                }
    
                newReport.bunkeringIfo = importVoyage.bunkeringIfo || 0;
                newReport.bunkeringMgo = importVoyage.bunkeringMgo || 0;
    
                newReport.observation = importVoyage.observation;
    
                newReport.activityPerformed = importVoyage.activityPerformed;
                if (newReport.activityPerformed == 'CARGANDO') {
                    newReport.activityPerformed = 'LOADING';
    
                } else if (newReport.activityPerformed == 'DESCARGANDO') {
                    newReport.activityPerformed = 'DOWNLOADING';
    
                } else if (newReport.activityPerformed == 'NAVEGANDO EN LASTRE') {
                    newReport.activityPerformed = 'SAILING_IN_BALLAST';
    
                } else if (newReport.activityPerformed == 'NAVEGANDO CON CARGA') {
                    newReport.activityPerformed = 'SAILING_WITH_LADEN';
    
                } else if (newReport.activityPerformed == 'NAVEGACION ECONOMICA') {
                    newReport.activityPerformed = 'ECONOMICAL_NAVIGATION';
    
                } else if (newReport.activityPerformed == 'FONDEADO') {
                    newReport.activityPerformed = 'ANCHORED';
    
                } else if (newReport.activityPerformed == 'MANIOBRA') {
                    newReport.activityPerformed = 'MANEUVER';
    
                } else if (newReport.activityPerformed == 'OTRAS ACT.') {
                    newReport.activityPerformed = 'OTHER_ACT';
                }
                // Tipo de velocidad.
                newReport.speedStraction = importVoyage.speedStraction;
                newReport.observation = importVoyage.observation;
    

                

                newReport.north_degree = importVoyage.north_degree || 0,
                newReport.north_minutes = importVoyage.north_minutes || 0,
                newReport.north_north_south = importVoyage.north_north_south || '',
                newReport.east_degree = importVoyage.east_degree || 0,
                newReport.east_minutes = importVoyage.east_minutes || 0,
                newReport.east_east_west = importVoyage.east_east_west || '',


                // Auditoria.
                newReport.userIdCreated = headerToken.id;
                newReport.dateCreated = GetDate();
                delete newReport.userIdUpdated;
                delete newReport.dateUpdated;
                newReport.status = true;
    
                await this._dailyReportsService.Create(newReport);
    
            }
    
            return 'Se registraron los datos correctamente.';


        } catch (error) {
            return 'ERRRORRRRRRRRRRRRRRRRRRRRRRRRRR! '
        }
    }

}

export class Mapping {
    constructor(
        public key?: number,
        public value?: number
    ) {
        this.key = key || 0;
        this.value = value || 0;
    }

}


export function searchKey(mappings: Mapping[], key: number): Mapping {
    return mappings.find(mapping => Number(mapping.key) == Number(key));
}