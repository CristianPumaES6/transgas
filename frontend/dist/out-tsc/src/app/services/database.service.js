import { __decorate, __metadata } from "tslib";
import { EventEmitter, Injectable } from '@angular/core';
import { Dexie } from 'dexie';
// Models
import { User } from '../models/user';
// Online service
import { UserService } from '../services/user.service';
import { Mapping, searchKey } from '../models/mapping';
import { Voyage } from '../models/voyage';
import { VoyageService } from './voyage.service';
import { PortService } from './port.service';
import { LoadingService } from './loading.service';
import { DailyReport } from '../models/daily-report';
import { DailyReportService } from './daily-report.service';
import { CantidadRestante } from '../models/loggedUser';
import { map } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
import { LanguageService } from './language.service';
import { boolean } from 'mathjs';
let DatabaseService = class DatabaseService {
    constructor(userService, voyageService, portService, dailyReportService, loadingService, notificationsService, languageService) {
        this.userService = userService;
        this.voyageService = voyageService;
        this.portService = portService;
        this.dailyReportService = dailyReportService;
        this.loadingService = loadingService;
        this.notificationsService = notificationsService;
        this.languageService = languageService;
        // Este emiter envia la cantidad de viajes puerto y reportes que faltan enviar
        this.emitterCantOffline = new EventEmitter();
        // Este emit sirve para avisar si se debe volver a cargar la data hacer reload. refresh etc.
        this.emitterReloadData = new EventEmitter();
        //======== VARIABLES DE TRADUCCION=============
        this.userLanguage = this.languageService.GetCurrentLanguage();
        this.translateCategory = 'voyage';
        console.log('DatabaseService constructor()');
        // Creamos la DataBase.
        this.createDatabase();
    }
    // Creacion de BD.
    createDatabase() {
        console.log('createDatabase()');
        this.db = new Dexie('TransgasDatabase');
        this.db.version(2).stores({
            users: '++id,nick,name,filename,password,language,role,years,minSpeed,maxSpeed,isConsumptionIFO,isConsumptionLSFO,isConsumptionVLSFO,isConsumptionMGO,maxIFOConsumption,maxMGOConsumption,minIFOConsumption,minMGOConsumption,isMEMGO,isAEMGO,isBoilerMGO,isIGMGO,isPowerPMGO,isOtherMGO,isMEIFO,isAEIFO,isBoilerIFO,isOtherIFO,contractSpeedSailingBallastMGO,contractSpeedSailingLadenMGO,contractSpeedSailingEconomicalMGO,loadingConsumptionMGO,dischargeConsumptionMGO,sailingBallastConsumptionMGO,sailingLoadConsumptionMGO,sailingEconomicConsumptionMGO,anchoredConsumptionMGO,maneuverConsumptionMGO,otherConsumptionMGO,contractSpeedSailingBallastIFO,contractSpeedSailingLadenIFO,contractSpeedSailingEconomicalIFO,loadingConsumptionIFO,dischargeConsumptionIFO,sailingBallastConsumptionIFO,sailingLoadConsumptionIFO,sailingEconomicConsumptionIFO,anchoredConsumptionIFO,maneuverConsumptionIFO,otherConsumptionIFO,isDisplayLSFOConsumption,isDisplayMGOConsumption,isDisplayAverageSpeed,isDisplayDataMGO,isDisplayDataLSFO,isDisplayVesselPerformanceLSFO,isDisplayVesselPerformanceMGO,consumptionEquipmentME_MGO,consumptionEquipmentAE_MGO,consumptionEquipmentBOILER_MGO,consumptionEquipmentIG_MGO,consumptionEquipmentPP_MGO,consumptionEquipmentOther_MGO,consumptionEquipmentME_IFO,consumptionEquipmentAE_IFO,consumptionEquipmentBOILER_IFO,consumptionEquipmentOther_IFO,userIdCreated,dateCreated,userIdUpdated,dateUpdated,status,syncStatus',
            voyages: '++id,userId,voyageNumber,year,userIdCreated,dateCreated,userIdUpdated,dateUpdated,status,syncStatus,totalPort,totalReport',
            ports: '++id,userId,voyageId,portNumber,departurePort,arrivalPort,userIdCreated,dateCreated,userIdUpdated,dateUpdated,status,syncStatus,totalReport',
            dailyReports: '++id,userId,portId,activityPerformed,speedStraction,date,hour,bunkeringIfo,bunkeringMgo,mplaIfo,auxIfo,boilerIfo,otherIfo,mplaMgo,auxMgo,boilerMgo,ppMgo,giMgo,otherMgo,steamingTime,distance,beaufour,observation,userIdCreated,dateCreated,userIdUpdated,dateUpdated,status,syncStatus'
        });
    }
    async DeleteDataBase() {
        console.log('INICIO DELETE DATA bASE');
        await this.db.delete();
        console.log('FIN DELETE DATA bASE');
    }
    // Obtener DataBase
    getDatabase() {
        console.log('getDatabase()');
        return this.db;
    }
    async Sync() {
        console.log('-------------------------');
        console.log('-------------------------');
        console.log('-------------------------');
        console.log('Sync Inicio');
        console.log('-------------------------');
        console.log('-------------------------');
        console.log('-------------------------');
        // Usuarios agregados en local mapeados.
        let usersMappings = [];
        let voyagesMappings = [];
        let portsMappings = [];
        let dailyReportsMappings = [];
        return await Promise.resolve(true).then(result => {
            return this.SincronizaTodasLasTablaYmodificaLosMapping(usersMappings, voyagesMappings, portsMappings, dailyReportsMappings);
        }).then(resultSync => {
            // Si en la sincronizacion ubo un error 
            if (!resultSync) {
                // Si hay un error en la sincronizacion se lo hacemos saber al server.
                return this.UpdateStatusIdRegisterInServer(true, voyagesMappings, portsMappings, dailyReportsMappings);
            }
            else {
                return this.UpdateStatusIdRegisterInServer(false, voyagesMappings, portsMappings, dailyReportsMappings);
            }
        }).then(resultUpdateStatusIdRegisterInServer => {
            if (!resultUpdateStatusIdRegisterInServer)
                throw 'ERROR EN LA SINCRONZACION, COMUNIQUESE CON CRISTIAN.';
            return true;
        }).catch(err => {
            console.log('Errr Sync');
            console.log(err);
            console.log('-----------------------------------------');
            console.log('-----------------------------------------');
            console.log('--------------------VOYAGE---------------------');
            console.log(voyagesMappings);
            console.log('--------------------PORT---------------------');
            console.log(portsMappings);
            console.log('--------------------DAILY---------------------');
            console.log(dailyReportsMappings);
            console.log('-----------------------------------------');
            console.log('-----------------------------------------');
            console.log('-----------------------------------------');
            console.error('ERROR OFFLINE');
            throw 'Offline';
        });
    }
    // Si queremos emitir un reload a la base datos, un refresh de lista.
    async EmitterReloadData() {
        this.emitterReloadData.emit();
        return true;
    }
    // =================== Sync IndexedDB ====================================
    // Sincroniza el modulo usuario.
    async SyncUsers() {
        console.log('syncUsers(users:User)');
        // User Mappings
        let saveUserMappings = [];
        // data del IndexedDB
        let usersIndexedDB;
        usersIndexedDB = await this.db.users.toArray();
        // FIltramos los datos que faltan aggregar y actualizar.
        const addUsers = usersIndexedDB.filter((user) => user.syncStatus == 'added');
        const updateUsers = usersIndexedDB.filter((user) => user.syncStatus == 'updated');
        const deleteUsers = usersIndexedDB.filter((user) => user.syncStatus == 'deleted');
        // Recorremos por toods los users que falta por agregar.
        for await (const iUser of addUsers) {
            // Resultado del create
            let resultCreate;
            resultCreate = await this.userService.CreateUser(iUser).pipe().toPromise();
            // Actualizamos el syncStatus a none.
            await this.db.users.update(iUser.id, { id: resultCreate.id, syncStatus: 'none' });
            // Mapping user
            saveUserMappings.push(new Mapping(iUser.id, resultCreate.id));
        }
        // Recorremos por todos los users que falta por actualizar.
        for await (const iUser of updateUsers) {
            let resultUpdate;
            resultUpdate = await this.userService.SaveUser(iUser).pipe().toPromise();
            // Actualizamos el syncStatus a none.
            await this.db.users.update(iUser.id, { syncStatus: 'none' });
        }
        for await (const iUser of deleteUsers) {
            let resultDelete;
            resultDelete = await this.userService.DeleteUser(iUser).pipe().toPromise();
            // Actualizamos el syncStatus a none.
            await this.db.users.update(iUser.id, { status: false, syncStatus: 'none' });
        }
        return saveUserMappings;
    }
    // Sincroniza el modulo voyage.
    async SyncVoyages(saveVoyageMappings, usersMappings) {
        console.log('SyncVoyages()', saveVoyageMappings);
        try {
            // Voyage Mappings
            // data del IndexedDB
            let voyagesIndexedDB;
            voyagesIndexedDB = await this.db.voyages.toArray();
            // FIltramos los datos que faltan aggregar y actualizar.
            const addVoyages = voyagesIndexedDB.filter((voyage) => voyage.syncStatus == 'added');
            const updateVoyages = voyagesIndexedDB.filter((voyage) => voyage.syncStatus == 'updated');
            const deleteVoyages = voyagesIndexedDB.filter((voyage) => voyage.syncStatus == 'deleted');
            console.log('Inicio reccorrer viajes add');
            // Recorremos todos los viajes que falta por agregar.
            for await (const iVoyage of addVoyages) {
                // Buscamos si el userId del buque esta mapeado.
                let searchUserMapping = searchKey(usersMappings, iVoyage.userId);
                // Si se encontro algo actualizamos el nuevo UserId.
                if (searchUserMapping) {
                    iVoyage.userId = searchUserMapping.value;
                }
                console.log('Va invocar el servicio create');
                // Resultado del create
                let resultCreate;
                resultCreate = await this.voyageService.Create(iVoyage).pipe().toPromise();
                console.log('Fin invocar el servicio create');
                // Este nuevo Create se registra al final;
                // Mapping voyage
                saveVoyageMappings.push(new Mapping(iVoyage.id, resultCreate.id));
                console.log('Fin reccorrer viajes', saveVoyageMappings);
            }
            console.log('Fin for add');
            console.log('Inicio FOr Update');
            // Recorremos todos los voyages que falta por actualizar.
            for await (const iVoyage of updateVoyages) {
                let resultUpdate;
                resultUpdate = await this.voyageService.Save(iVoyage).pipe().toPromise();
                // Actualizamos el syncStatus a none.
                await this.db.voyages.update(iVoyage.id, { syncStatus: 'none' });
            }
            console.log('Fin for update');
            console.log('Inicio FOr Delete');
            for await (const iVoyage of deleteVoyages) {
                let resultDelete;
                resultDelete = await this.voyageService.Delete(iVoyage).pipe().toPromise();
                // Actualizamos el syncStatus a none.
                await this.db.voyages.update(iVoyage.id, { status: false, syncStatus: 'none' }); // REVISAR COMO SE ACTUALIZA EL STATUS
            }
            console.log('Fin for delete');
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async SyncPorts(savePortsMappings, usersMappings, voyagesMappings) {
        console.log('SyncPorts()');
        try {
            // data del IndexedDB
            let portsIndexedDB;
            portsIndexedDB = await this.db.ports.toArray();
            // FIltramos los datos que faltan aggregar y actualizar.
            const addPorts = portsIndexedDB.filter((port) => port.syncStatus == 'added');
            const updatePorts = portsIndexedDB.filter((port) => port.syncStatus == 'updated');
            const deletePorts = portsIndexedDB.filter((port) => port.syncStatus == 'deleted');
            // Recorremos todos los puertos que falta por agregar.
            for await (let iPort of addPorts) {
                // Resultado del create
                let resultCreate;
                // Buscamos el id del viaje para ver si lo tenemos mapeado para cambiarlo.
                let searchMappingVoyage = searchKey(voyagesMappings, iPort.voyageId);
                let searchMappingUser = searchKey(usersMappings, iPort.userId);
                if (searchMappingVoyage) {
                    iPort.voyageId = searchMappingVoyage.value;
                }
                if (searchMappingUser) {
                    iPort.userId = searchMappingUser.value;
                }
                // Creamos el puerto con el id del viaje.
                resultCreate = await this.portService.Create(iPort).pipe().toPromise();
                // Mapping Port por el nuevo ID
                savePortsMappings.push(new Mapping(iPort.id, resultCreate.id));
                // Este nuevo Create se registra al final;
            }
            // Recorremos todos los voyages que falta por actualizar.
            for await (let iPort of updatePorts) {
                let resultUpdate;
                resultUpdate = await this.portService.Save(iPort).pipe().toPromise();
                // Actualizamos el syncStatus a none.
                await this.db.ports.update(iPort.id, { syncStatus: 'none' });
            }
            for await (let iPort of deletePorts) {
                let resultDelete;
                resultDelete = await this.portService.Delete(iPort).pipe().toPromise();
                // Actualizamos el syncStatus a none.
                await this.db.ports.update(iPort.id, { status: false, syncStatus: 'none' }); // REVISAR COMO SE ACTUALIZA EL STATUS
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async SyncDailyReports(saveDailyReportsMappings, usersMappings, portsMappings) {
        console.log('SyncDailyReports()');
        try {
            // data del IndexedDB
            let dailyReportsIndexedDB;
            dailyReportsIndexedDB = await this.db.dailyReports.toArray();
            // FIltramos los datos que faltan aggregar y actualizar.
            const addDailyReports = dailyReportsIndexedDB.filter((dailyReport) => dailyReport.syncStatus == 'added');
            const updateDailyReports = dailyReportsIndexedDB.filter((dailyReport) => dailyReport.syncStatus == 'updated');
            const deleteDailyReports = dailyReportsIndexedDB.filter((dailyReport) => dailyReport.syncStatus == 'deleted');
            // Recorremos todos los puertos que falta por agregar.
            for await (let iDailyReport of addDailyReports) {
                // Resultado del create
                let resultCreate;
                let searchMappingUser = searchKey(usersMappings, iDailyReport.userId);
                let searchMappingPort = searchKey(portsMappings, iDailyReport.portId);
                if (searchMappingUser) {
                    iDailyReport.userId = searchMappingUser.value;
                }
                if (searchMappingPort) {
                    iDailyReport.portId = searchMappingPort.value;
                }
                resultCreate = await this.dailyReportService.Create(iDailyReport).pipe().toPromise();
                // Mapping Port por el nuevo ID
                saveDailyReportsMappings.push(new Mapping(iDailyReport.id, resultCreate.id));
            }
            // Recorremos todos los voyages que falta por actualizar.
            for await (let iDailyReport of updateDailyReports) {
                let resultUpdate;
                resultUpdate = await this.dailyReportService.Save(iDailyReport).pipe().toPromise();
                // Actualizamos el syncStatus a none.
                await this.db.dailyReports.update(iDailyReport.id, { syncStatus: 'none' });
            }
            for await (let iDailyReport of deleteDailyReports) {
                let resultDelete;
                resultDelete = await this.dailyReportService.Delete(iDailyReport).pipe().toPromise();
                // Actualizamos el syncStatus a none.
                await this.db.dailyReports.update(iDailyReport.id, { status: false, syncStatus: 'none' }); // REVISAR COMO SE ACTUALIZA EL STATUS
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    // ========================= FIN SYNC ========================
    // UPDATE DATA LOCAL
    async UpdateDataLocal() {
        let selectUser = this.userService.GetIdentity();
        // DATOS DE LAS PETICIONES HACIA EL SERVER
        let getUsers = [];
        let getVoyages = [];
        return await Promise.resolve(true).then(result => {
            let objUserGet = new User();
            // Solo si es un usuario buque cargaran sus datos en local
            if (selectUser.role === 'BUQUE') {
                objUserGet.id = selectUser.id;
            }
            // Traigo a todos los User y lo instancio en el obj.
            return this.userService.GetUsers(objUserGet).pipe(map((resultUser) => {
                if (!resultUser || resultUser.length == 0) {
                    throw 'ERROR GETTING DATA FROM THE SERVER';
                }
                getUsers = resultUser;
                // Segun el resultado retornamos la respuesta.
                return getUsers;
            })).toPromise();
        }).then(
        // Consultaremos los viajes.
        resultGetUser => {
            if (!resultGetUser || resultGetUser.length == 0) {
                throw 'I DO NOT EXPECT THAT THE SERVER RESPONDEDED';
            }
            // Seleccionaremos el primer buque del arreglo.
            let objVoyageGET = new Voyage();
            let firstUser = getUsers.reverse().find(user => user.role === 'BUQUE');
            if (firstUser) {
                selectUser = firstUser;
                objVoyageGET.userId = selectUser.id;
                objVoyageGET.year = selectUser.years[(firstUser.years.length || 1) - 1];
            }
            else {
                throw 'NO_BUQUE_REGISTER';
            }
            // Traigo a todos los User y lo instancio en el obj.
            // GeyVoyage obtiene todos los puertos.
            return this.voyageService.GetsDetail(objVoyageGET).pipe(map((resultVoyages) => {
                if (!resultVoyages) {
                    throw 'ERROR GETTING DATA FROM THE SERVER';
                }
                // Guardamos el valor en nuestra variable global.
                getVoyages = resultVoyages.reverse() || getVoyages;
                // Segun el resultado retornamos la respuesta.
                return getVoyages;
            })).toPromise();
        }).then(resulGetVoyages => {
            // Revisamos si el result es el esperado.
            if (!resulGetVoyages)
                throw 'ERROR_GET_VOYAGES';
            // Hacemos Clear a la Tabla Users
            return this.ClearUsersIndexedDB();
        }).then(resultClear => {
            // Revisamos si el result es el esperado.
            if (!resultClear)
                throw 'ERROR_CLEAR_INDEXEDDB';
            // Hacemos Clear a la Tabla Users
            return this.ClearVoyagesIndexedDB();
        }).then(resultClear => {
            // Revisamos si el result es el esperado.
            if (!resultClear)
                throw 'ERROR_CLEAR_INDEXEDDB';
            // Hacemos Clear a la Tabla Users
            return this.ClearPortsIndexedDB();
        }).then(resultClear => {
            // Revisamos si el result es el esperado.
            if (!resultClear)
                throw 'ERROR_CLEAR_INDEXEDDB';
            // Hacemos Clear a la Tabla Users
            return this.ClearDailyReportsIndexedDB();
        }).then(resultClear => {
            // Revisamos si el result es el esperado.
            if (!resultClear)
                throw 'ERROR_CLEAR_INDEXEDDB';
            // Agregamos los usuarios al indexedDB
            return this.addUsersIndexedDB(getUsers);
        }).then(resultAddUser => {
            // Revisamos si el result es el esperado.
            if (!resultAddUser)
                throw 'ERROR_ADD_USER_INDEXEDDB';
            // Agregamos los usuarios al indexedDB
            return this.addVoyagesIndexedDB(getVoyages);
        }).then(result => {
            return true;
        }).catch(err => {
            // Manejo el error
            let msg = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, err || 'ERROR_ON_LOAD'));
            // Muestro notificación
            this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
            console.error(msg);
            console.dir(err);
            // this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
            // Deshabilito el spinner de loading
            this.loadingService.Close();
            return false;
        });
    }
    // =================== USERS IndexedDB ====================================
    // Obtiene a todos los usuarios de IndexDB
    async getUsersIndexDB() {
        console.log('getUsersIndexDB()');
        return await this.db.users.toArray().then((results) => {
            return results.filter((user) => {
                return user.status === true;
            }).reverse();
        });
    }
    // Obtiene a un usuario por ID de IndexDB
    async getUserIndexDB(Index) {
        console.log('getUserIndexDB(Index)');
        return await this.db.users.get(Index).then((result) => {
            return result;
        });
    }
    // Agregar User por indexedDB
    async addUserIndexedDB(user) {
        console.log('addUserIndexedDb(user: User)');
        return await this.db.users
            .add(user).then((userId) => {
            user.id = userId;
            return user;
        });
    }
    // Agregar Users por indexedDB
    async addUsersIndexedDB(users) {
        console.log('addUsersIndexedDB(users: User[])');
        // Verificamos como se encuentra el servicios
        if (true) {
            // for await
            for await (const iUser of users) {
                await this.addUserIndexedDB(iUser);
            }
        }
        else {
            console.log('went offline, storing in indexdb');
            return false;
        }
        console.log('FINNNNNN SINCRONOs');
        return true;
    }
    // Actualiza User del IndexedDB
    async updateUserIndexedDB(user) {
        console.log('updateUserIndexedDB(user: User)');
        return await this.db.users.update(user.id, {
            nick: user.nick,
            name: user.name,
            filename: user.filename,
            password: user.password,
            language: user.language,
            role: user.role,
            years: user.years,
            minSpeed: user.minSpeed,
            maxSpeed: user.maxSpeed,
            isConsumptionIFO: user.isConsumptionIFO,
            isConsumptionLSFO: user.isConsumptionLSFO,
            isConsumptionMGO: user.isConsumptionMGO,
            maxIFOConsumption: user.maxIFOConsumption,
            maxMGOConsumption: user.maxMGOConsumption,
            minIFOConsumption: user.minIFOConsumption,
            minMGOConsumption: user.minMGOConsumption,
            isMEMGO: user.isMEMGO,
            isAEMGO: user.isAEMGO,
            isBoilerMGO: user.isBoilerMGO,
            isIGMGO: user.isIGMGO,
            isPowerPMGO: user.isPowerPMGO,
            isOtherMGO: user.isOtherMGO,
            isMEIFO: user.isMEIFO,
            isAEIFO: user.isAEIFO,
            isBoilerIFO: user.isBoilerIFO,
            isOtherIFO: user.isOtherIFO,
            // Performance MGO
            contractSpeedSailingBallastMGO: user.contractSpeedSailingBallastMGO,
            contractSpeedSailingLadenMGO: user.contractSpeedSailingLadenMGO,
            contractSpeedSailingEconomicalMGO: user.contractSpeedSailingEconomicalMGO,
            loadingConsumptionMGO: user.loadingConsumptionMGO,
            dischargeConsumptionMGO: user.dischargeConsumptionMGO,
            sailingBallastConsumptionMGO: user.sailingBallastConsumptionMGO,
            sailingLoadConsumptionMGO: user.sailingLoadConsumptionMGO,
            sailingEconomicConsumptionMGO: user.sailingEconomicConsumptionMGO,
            anchoredConsumptionMGO: user.anchoredConsumptionMGO,
            maneuverConsumptionMGO: user.maneuverConsumptionMGO,
            otherConsumptionMGO: user.otherConsumptionMGO,
            // Performance IFO
            contractSpeedSailingBallastIFO: user.contractSpeedSailingBallastIFO,
            contractSpeedSailingLadenIFO: user.contractSpeedSailingLadenIFO,
            contractSpeedSailingEconomicalIFO: user.contractSpeedSailingEconomicalIFO,
            loadingConsumptionIFO: user.loadingConsumptionIFO,
            dischargeConsumptionIFO: user.dischargeConsumptionIFO,
            sailingBallastConsumptionIFO: user.sailingBallastConsumptionIFO,
            sailingLoadConsumptionIFO: user.sailingLoadConsumptionIFO,
            sailingEconomicConsumptionIFO: user.sailingEconomicConsumptionIFO,
            anchoredConsumptionIFO: user.anchoredConsumptionIFO,
            maneuverConsumptionIFO: user.maneuverConsumptionIFO,
            otherConsumptionIFO: user.otherConsumptionIFO,
            // Dashboard
            isDisplayLSFOConsumption: user.isDisplayLSFOConsumption,
            isDisplayMGOConsumption: user.isDisplayMGOConsumption,
            isDisplayAverageSpeed: user.isDisplayAverageSpeed,
            isDisplayDataMGO: user.isDisplayDataMGO,
            isDisplayDataLSFO: user.isDisplayDataLSFO,
            isDisplayVesselPerformanceLSFO: user.isDisplayVesselPerformanceLSFO,
            isDisplayVesselPerformanceMGO: user.isDisplayVesselPerformanceMGO,
            consumptionEquipmentME_MGO: user.consumptionEquipmentME_MGO,
            consumptionEquipmentAE_MGO: user.consumptionEquipmentAE_MGO,
            consumptionEquipmentBOILER_MGO: user.consumptionEquipmentBOILER_MGO,
            consumptionEquipmentIG_MGO: user.consumptionEquipmentIG_MGO,
            consumptionEquipmentPP_MGO: user.consumptionEquipmentPP_MGO,
            consumptionEquipmentOther_MGO: user.consumptionEquipmentOther_MGO,
            consumptionEquipmentME_IFO: user.consumptionEquipmentME_IFO,
            consumptionEquipmentAE_IFO: user.consumptionEquipmentAE_IFO,
            consumptionEquipmentBOILER_IFO: user.consumptionEquipmentBOILER_IFO,
            consumptionEquipmentOther_IFO: user.consumptionEquipmentOther_IFO,
            // Audiotoria
            userIdCreated: user.userIdCreated,
            dateCreated: user.dateCreated,
            userIdUpdated: user.userIdUpdated,
            dateUpdated: user.dateUpdated,
            status: user.status,
            syncStatus: user.syncStatus,
        }).then((result) => {
            return user;
        });
    }
    async ClearUsersIndexedDB() {
        console.log('DeleteIndexedDB()');
        return await this.db.users.clear().then(() => {
            console.log('OK DELETE');
            return true;
        });
    }
    //__________________________________________________________________________
    // =================== VOYAGES IndexedDB ====================================
    // Obtiene a todos los viajes de IndexDB
    async getVoyagesIndexDB() {
        console.log('getVoyagesIndexDB()');
        return await this.db.voyages.toArray().then((results) => {
            return results.filter((voyage) => {
                return Boolean(voyage.status) === true;
            }).reverse();
        });
    }
    async getVoyagesByUserIdIndexDB(userId) {
        console.log('getVoyagesIndexDB()');
        return await this.db.voyages.toArray().then((results) => {
            return results.filter((voyage) => {
                return Boolean(voyage.status) === true && Number(voyage.userId) === Number(userId);
            }).reverse();
        });
    }
    // Obtiene a un viaje por ID de IndexDB
    async getVoyageIndexDB(Index) {
        console.log('getVoyageIndexDB(Index)');
        return await this.db.voyages.get(Index).then((result) => {
            return result;
        });
    }
    // Agregar Voyage por indexedDB
    async addVoyageIndexedDB(voyage) {
        console.log('addVoyageIndexedDB(voyage: Voyage)');
        await this.db.voyages
            .add(voyage).then((voyageId) => {
            voyage.id = voyageId;
            return voyage;
        });
        return voyage;
    }
    // Agregar Voyages por indexedDB
    async addVoyagesIndexedDB(voyages) {
        console.log('addVoyagesIndexedDB(voyages: Voyage[])');
        // Verificamos como se encuentra el servicios
        if (true) {
            // for await
            for await (const iVoyage of voyages) {
                let voyage = iVoyage;
                voyage.totalPort = 0;
                voyage.totalReport = 0;
                for await (const iPort of voyage.ports) {
                    let port = iPort;
                    port.totalReport = 0;
                    if (port.status === true) {
                        for await (const iDailyReports of port.dailyReports) {
                            let dailyReports = iDailyReports;
                            if (dailyReports.status === true) {
                                voyage.totalReport = voyage.totalReport + 1;
                                port.totalReport = port.totalReport + 1;
                                await this.addDailyReportIndexedDB(dailyReports);
                            }
                        }
                        voyage.totalPort = voyage.totalPort + 1;
                        await this.addPortIndexedDB(port);
                    }
                }
                delete voyage.ports;
                await this.addVoyageIndexedDB(voyage);
            }
        }
        else {
            console.log('went offline, storing in indexdb');
            return false;
        }
        console.log('FINNNNNN SINCRONOs');
        return true;
    }
    // Actualiza Voyage del IndexedDB
    async updateVoyageIndexedDB(voyage) {
        console.log('updateVoyageIndexedDB(voyage: Voyage)');
        return await this.db.voyages.update(voyage.id, {
            userId: voyage.userId,
            voyageNumber: voyage.voyageNumber,
            year: voyage.year,
            userIdCreated: voyage.userIdCreated,
            dateCreated: voyage.dateCreated,
            userIdUpdated: voyage.userIdUpdated,
            dateUpdated: voyage.dateUpdated,
            status: voyage.status,
            syncStatus: voyage.syncStatus,
            totalPort: voyage.totalPort,
            totalReport: voyage.totalReport
        }).then((result) => {
            return voyage;
        });
    }
    async ClearVoyagesIndexedDB() {
        console.log('ClearVoyagesIndexedDB()');
        return await this.db.voyages.clear().then(() => {
            console.log('OK DELETE Voyages DB');
            return true;
        });
    }
    //__________________________________________________________________________
    // =================== PORTS IndexedDB ====================================
    // Obtiene a todos los puertos de IndexDB
    async getPortsIndexDB() {
        console.log('getPortsIndexDB()');
        return await this.db.ports.toArray().then((results) => {
            return results.filter((port) => {
                return Boolean(port.status) === true;
            }).reverse();
        });
    }
    async getPortsByVoyageIndexDB(voyageId) {
        console.log('getPortsByVoyageIndexDB()');
        return await this.db.ports.toArray().then((results) => {
            return results.filter((port) => {
                return Boolean(port.status) === true && Number(port.voyageId) === Number(voyageId);
            }).reverse();
        });
    }
    // Obtiene a un puerto por ID de IndexDB
    async getPortIndexDB(Index) {
        console.log('getPortIndexDB(Index)');
        return await this.db.ports.get(Index).then((result) => {
            return result;
        });
    }
    // Agregar Port por indexedDB
    async addPortIndexedDB(port) {
        console.log('addPortIndexedDB(port: Port)');
        return await this.db.ports
            .add(port).then((portID) => {
            port.id = portID;
            return port;
        });
    }
    // Agregar Ports por indexedDB
    async addPortsIndexedDB(ports) {
        console.log('addPortsIndexedDB(ports: Port[])');
        // Verificamos como se encuentra el servicios
        if (true) {
            // for await
            for await (const iPort of ports) {
                if (Boolean(iPort.status) === true) {
                    await this.addPortIndexedDB(iPort);
                }
            }
        }
        else {
            console.log('went offline, storing in indexdb');
            return false;
        }
        console.log('FINNNNNN SINCRONOs');
        return true;
    }
    // Actualiza port del IndexedDB
    async updatePortIndexedDB(port) {
        console.log('updateVoyageIndexedDB(voyage: Voyage)');
        return await this.db.ports.update(port.id, {
            userId: port.userId,
            voyageId: port.voyageId,
            portNumber: port.portNumber,
            departurePort: port.departurePort,
            arrivalPort: port.arrivalPort,
            startDate: port.startDate,
            startIFO: port.startIFO,
            startMGO: port.startMGO,
            userIdCreated: port.userIdCreated,
            dateCreated: port.dateCreated,
            userIdUpdated: port.userIdUpdated,
            dateUpdated: port.dateUpdated,
            status: port.status,
            syncStatus: port.syncStatus,
            totalReport: port.totalReport,
        }).then((result) => {
            return port;
        });
    }
    async ClearPortsIndexedDB() {
        console.log('ClearVPortsIndexedDB()');
        return await this.db.ports.clear().then(() => {
            console.log('OK DELETE Ports DB');
            return true;
        });
    }
    //__________________________________________________________________________
    // =================== REPORT DAILY IndexedDB ====================================
    // Obtiene a todos los reportes de IndexDB
    async getReportDailysIndexDB() {
        console.log('getReportDailyIndexDB()');
        return await this.db.dailyReports.toArray().then((results) => {
            return results.filter((dailyReport) => {
                return Boolean(dailyReport.status) === true;
            }).reverse();
        });
    }
    async getReportDailysByPortIdIndexDB(portId) {
        console.log('getReportDailysByPortIdIndexDB(portId: number)');
        return await this.db.dailyReports.toArray().then((results) => {
            return results.filter((dailyReport) => {
                return Boolean(dailyReport.status) === true && Number(dailyReport.portId) === Number(portId);
            });
        });
    }
    // Obtiene a un puerto por ID de IndexDB
    async getDailyReportIndexDB(Index) {
        console.log('getDailyReportIndexDB(Index: number)');
        return await this.db.dailyReports.get(Index).then((result) => {
            return result;
        });
    }
    async GetLastReportDailys() {
        console.log('getLastReportDailys()');
        return await this.db.dailyReports.toArray().then((results) => {
            return results.reverse();
        }).then((results) => {
            return results.find(report => boolean(report.status));
        });
    }
    // CosumptionTotalByPortID
    // RETORNA EL TOTAL Y EL ULTIMO CONSUMO.
    async CosumptionTotalByPortID(portId) {
        console.log('CosumptionTotalByPortID(portId:number)' + portId);
        return await this.db.dailyReports.toArray().then((results) => {
            return results;
        }).then((results) => {
            // TotalConsumo.
            let totalDailyReport = new DailyReport();
            results.forEach((indexDaily) => {
                // si el stado es true y el portId Coinciden sumamos.
                if (Boolean(indexDaily.status) === true && indexDaily.portId === portId) {
                    // Recarga de IFO
                    totalDailyReport.bunkeringIfo = totalDailyReport.bunkeringIfo + indexDaily.bunkeringIfo;
                    // Recarga de MGO
                    totalDailyReport.bunkeringMgo = totalDailyReport.bunkeringMgo + indexDaily.bunkeringMgo;
                    // Consumo mplaIfo
                    totalDailyReport.mplaIfo = totalDailyReport.mplaIfo + indexDaily.mplaIfo;
                    // Consumo auxIfo
                    totalDailyReport.auxIfo = totalDailyReport.auxIfo + indexDaily.auxIfo;
                    // consumo boilerIfo
                    totalDailyReport.boilerIfo = totalDailyReport.boilerIfo + indexDaily.boilerIfo;
                    // Otros consumos Ifo
                    totalDailyReport.otherIfo = totalDailyReport.otherIfo + indexDaily.otherIfo;
                    // Consumo mplaMgo
                    totalDailyReport.mplaMgo = totalDailyReport.mplaMgo + indexDaily.mplaMgo;
                    // Consumo auxMgo
                    totalDailyReport.auxMgo = totalDailyReport.auxMgo + indexDaily.auxMgo;
                    // Consumo boilerMgo
                    totalDailyReport.boilerMgo = totalDailyReport.boilerMgo + indexDaily.boilerMgo;
                    // Consumo ppMgo
                    totalDailyReport.ppMgo = totalDailyReport.ppMgo + indexDaily.ppMgo;
                    // Consumo giMgo
                    totalDailyReport.giMgo = totalDailyReport.giMgo + indexDaily.giMgo;
                    // Consumo otherMgo
                    totalDailyReport.otherMgo = totalDailyReport.otherMgo + indexDaily.otherMgo;
                    totalDailyReport.date = indexDaily.date;
                    totalDailyReport.hour = indexDaily.hour;
                }
            });
            return totalDailyReport;
        });
    }
    // Agregar DailyReport por indexedDB
    async addDailyReportIndexedDB(dailyReport) {
        console.log('addDailyReportIndexedDB(dailyReport: DailyReport)');
        return await this.db.dailyReports
            .add(dailyReport).then((dailyReportId) => {
            dailyReport.id = dailyReportId;
            return dailyReport;
        });
    }
    // Agregar DailyReports por indexedDB
    async addDailyReportsIndexedDB(dailyReports) {
        console.log('addPortsIndexedDB(ports: Port[])');
        // Verificamos como se encuentra el servicios
        if (true) {
            // for await
            for await (const iDailyReports of dailyReports) {
                if (Boolean(iDailyReports.status) === true) {
                    await this.addDailyReportIndexedDB(iDailyReports);
                }
            }
        }
        else {
            console.log('went offline, storing in indexdb');
            return false;
        }
        console.log('FINNNNNN SINCRONOs');
        return true;
    }
    // Actualiza DailyReports del IndexedDB
    async updateDailyReportIndexedDB(dailyReport) {
        console.log('updateDailyReportsIndexedDB(dailyReports: DailyReports)');
        return await this.db.dailyReports.update(dailyReport.id, {
            userId: dailyReport.userId,
            portId: dailyReport.portId,
            activityPerformed: dailyReport.activityPerformed,
            typeActivityPerformed: dailyReport.typeActivityPerformed,
            speedStraction: dailyReport.speedStraction,
            date: dailyReport.date,
            hour: dailyReport.hour,
            bunkeringIfo: dailyReport.bunkeringIfo,
            bunkeringMgo: dailyReport.bunkeringMgo,
            mplaIfo: dailyReport.mplaIfo,
            auxIfo: dailyReport.auxIfo,
            boilerIfo: dailyReport.boilerIfo,
            otherIfo: dailyReport.otherIfo,
            mplaMgo: dailyReport.mplaMgo,
            auxMgo: dailyReport.auxMgo,
            boilerMgo: dailyReport.boilerMgo,
            ppMgo: dailyReport.ppMgo,
            giMgo: dailyReport.giMgo,
            otherMgo: dailyReport.otherMgo,
            steamingTime: dailyReport.steamingTime,
            distance: dailyReport.distance,
            beaufour: dailyReport.beaufour,
            observation: dailyReport.observation,
            userIdCreated: dailyReport.userIdCreated,
            dateCreated: dailyReport.dateCreated,
            userIdUpdated: dailyReport.userIdUpdated,
            dateUpdated: dailyReport.dateUpdated,
            status: dailyReport.status,
            syncStatus: dailyReport.syncStatus,
            // NUEVO CAMPO
            north_degree: dailyReport.north_degree,
            north_minutes: dailyReport.north_minutes,
            north_north_south: dailyReport.north_north_south,
            east_degree: dailyReport.east_degree,
            east_minutes: dailyReport.east_minutes,
            east_east_west: dailyReport.east_east_west,
        }).then((result) => {
            return dailyReport;
        });
    }
    async ClearDailyReportsIndexedDB() {
        console.log('ClearVPortsIndexedDB()');
        return await this.db.dailyReports.clear().then(() => {
            console.log('OK DELETE DailyReports DB');
            return true;
        });
    }
    async ConsultarCuantosInsertFaltanAgregaroActualizaroEliminarEnElServidor() {
        let cantidadQueFaltaEnviar = new CantidadRestante();
        return await Promise.resolve(true).then(result => {
            return this.db.voyages.toArray();
        }).then(dbVoyages => {
            // data del IndexedDB
            let voyagesIndexedDB;
            voyagesIndexedDB = dbVoyages;
            // FIltramos los datos que faltan aggregar y actualizar.
            const addVoyages = voyagesIndexedDB.filter((voyage) => voyage.syncStatus == 'added');
            const updateVoyages = voyagesIndexedDB.filter((voyage) => voyage.syncStatus == 'updated');
            const deleteVoyages = voyagesIndexedDB.filter((voyage) => voyage.syncStatus == 'deleted');
            // Sumamos lo que falta en el 
            cantidadQueFaltaEnviar.voyage = addVoyages.length + updateVoyages.length + deleteVoyages.length;
            return this.db.ports.toArray();
        }).then(dbPorts => {
            // FIltramos los datos que faltan aggregar y actualizar.
            const addPorts = dbPorts.filter((port) => port.syncStatus == 'added');
            const updatePorts = dbPorts.filter((port) => port.syncStatus == 'updated');
            const deletePorts = dbPorts.filter((port) => port.syncStatus == 'deleted');
            // Sumamos lo que falta en el 
            cantidadQueFaltaEnviar.port = addPorts.length + updatePorts.length + deletePorts.length;
            return this.db.dailyReports.toArray();
        }).then((dailyReportsIndexedDB) => {
            // data del IndexedDB 
            // FIltramos los datos que faltan aggregar y actualizar.
            const addDailyReports = dailyReportsIndexedDB.filter((dailyReport) => dailyReport.syncStatus == 'added');
            const updateDailyReports = dailyReportsIndexedDB.filter((dailyReport) => dailyReport.syncStatus == 'updated');
            const deleteDailyReports = dailyReportsIndexedDB.filter((dailyReport) => dailyReport.syncStatus == 'deleted');
            // Sumamos lo que falta en el 
            cantidadQueFaltaEnviar.report = addDailyReports.length + updateDailyReports.length + deleteDailyReports.length;
            return cantidadQueFaltaEnviar;
        }).catch(err => {
            let cantidadRestante = new CantidadRestante(99, 99, 99);
            //return cantidadRestante;
            throw 'Contact cristian, there is a problem updating the records to the server';
        });
    }
    // emita la cantidad que falta que esta registrado en local.
    async EmitterCantOffline() {
        return await Promise.resolve(true).then(result => {
            return this.ConsultarCuantosInsertFaltanAgregaroActualizaroEliminarEnElServidor();
        }).then(resultCantidadRestante => {
            this.emitterCantOffline.emit(resultCantidadRestante);
        }).then(result => {
            return true;
        }).catch(err => {
            //return cantidadRestante;
            throw 'Contact cristian, there is a problem updating the records to the server';
        });
    }
    // esta funcion retornara la data del usuario que se tiene en local, no se tiene ninguna usuario en local retorna 0.
    async CheckWhatUserWeHaveInLocal() {
        let userIdOld = 0;
        return await Promise.resolve(true).then(result => {
            // Obtenemos todos los viajes.
            return this.db.voyages.toArray();
        }).then(voyages => {
            if (voyages && voyages.length) {
                userIdOld = voyages[0].userId;
                return userIdOld;
            }
            else {
                return 0;
            }
        }).catch(err => {
            //return cantidadRestante;
            throw 'Contact cristian, could not get the users local record.';
        });
    }
    // Actualizar los id nuevos creados.
    async UpdateStatusIdRegisterInServer(updateForError, voyagesMappings, portsMappings, dailyReportsMappings) {
        console.log('ENtro UpdateStatusIdRegisterInServer()');
        // Empezamos desde el ultimo que se registro.
        let voyagesMappingsReverse = voyagesMappings.reverse();
        let portsMappingsMappingsReverse = portsMappings.reverse();
        let dailyReportsMappingsReverse = dailyReportsMappings.reverse();
        // si este update es provocado por un error, debemos verificar que no exista un viaje con el mismo id
        // imaginate que los id locales son 1, 2, 3, 4, 5
        // Ahora solo se actualizan los 2 primero y en el server esta el id 2
        // si se ubiran registrado correcto seria 3, 4, 5, 6, 7
        // eso significa que 1, 2  => serian 3, 4, pero los siguientes se repiten por id.
        // entonces esta validacion valida eso. y actualiza mas 1 los del server.
        if (updateForError) {
            console.log('ESTE UPDATE ES POR UN ERROR');
            let resultUpdateIdMayoresAlUltimo = await this.VerificaSiElUltimoIdEsDiferenteAlDelServer(voyagesMappings, portsMappings, dailyReportsMappings);
            if (!resultUpdateIdMayoresAlUltimo)
                throw 'Error al Actualizar el ultimoID segun el server.';
        }
        console.log('Inicio For voyagesMappingsReverse');
        // Actualizamos el arrglo de maping.
        let resultDelUpdaTe = await this.ActualizamosAlArregloMappingVoyage(voyagesMappingsReverse);
        if (!resultDelUpdaTe) {
            console.error('ERRROR ADDMAPPING VOYAGES');
            throw 'ERROR ADD MAPPING VOYAGES';
        }
        console.log('Inicio For portsMappingsMappingsReverse');
        for await (let idPortRegister of portsMappingsMappingsReverse) {
            // Actualizamos el syncStatus a none.
            await this.db.ports.update(idPortRegister.key, { id: idPortRegister.value, syncStatus: 'none' });
            console.log('EstaFuncionSirveParaActualizarALosReportesConElNUevoIdDelPuerto    : ' + idPortRegister.key + '  - ' + idPortRegister.value);
            await this.EstaFuncionSirveParaActualizarALosReportesConElNUevoIdDelPuerto(idPortRegister.key, idPortRegister.value);
        }
        console.log('Inicio For dailyReportsMappingsReverse');
        for await (let idDailyReport of dailyReportsMappingsReverse) {
            // Actualizamos el syncStatus a none.
            // Actualizo el numero de puerto por que puede cambiar.
            await this.db.dailyReports.update(idDailyReport.key, { id: idDailyReport.value, syncStatus: 'none' });
        }
        console.log('FIN UpdateStatusIdRegisterInServer()');
        return true;
    }
    // Esta funcion iserve para actualizar los puertos a un nuevo viajeId
    async ActualizaPuertosDeUnViajeIdDistintoAlServer(oldVoyageIdLocal, newVoyageIdServer) {
        // obtenemos todos los puertos
        let portsIndexedDB = await this.db.ports.toArray();
        console.log('Filta los puertos dentro del viaje.');
        // Filtramos los puertos con el mismo id del key
        portsIndexedDB = portsIndexedDB.filter((report) => report.voyageId == oldVoyageIdLocal);
        // recorremos y actualizamos los puertos con el nuevo id del viaje.
        for await (let iPortIndexedDB of portsIndexedDB) {
            // Actualizo el id del viaje por que puede cambiar.
            await this.db.ports.update(iPortIndexedDB.id, { voyageId: newVoyageIdServer });
        }
        console.log('Fin del Filtro los puertos dentro del viaje.');
        return true;
    }
    async EstaFuncionSirveParaActualizarALosReportesConElNUevoIdDelPuerto(oldPortId, newPortId) {
        // AQUI TENEMOS QUE ACTUALIZAR TODOS LOS REPORTES QUE TIENEN ESE PUERTO ID
        let reportesIndexedDB;
        reportesIndexedDB = await this.db.dailyReports.toArray();
        // FIltramos los reportes que tienen ese puertoId
        reportesIndexedDB = reportesIndexedDB.filter((report) => report.portId == oldPortId);
        // recorremos y actualizamos uno por uno
        for await (let iReportesIndexedDB of reportesIndexedDB) {
            // Actualizamos el syncStatus a none.
            // Actualizo el numero de puerto por que puede cambiar.
            // Actualizo el id del viaje por que puede cambiar.
            await this.db.dailyReports.update(iReportesIndexedDB.id, { portId: newPortId });
        }
        return true;
    }
    async SincronizaTodasLasTablaYmodificaLosMapping(usersMappings, voyagesMappings, portsMappings, dailyReportsMappings) {
        return await Promise.resolve(true).then(result => {
            return this.SyncUsers();
        }).then(Usermapping => {
            if (!Usermapping)
                throw 'ERROR Sync Users';
            usersMappings = Usermapping;
            return this.SyncVoyages(voyagesMappings, usersMappings);
        }).then(resultSyncVoyages => {
            if (!resultSyncVoyages)
                throw 'ERROR Sync Voyages';
            return this.SyncPorts(portsMappings, usersMappings, voyagesMappings);
        }).then(resultSyncPorts => {
            if (!resultSyncPorts)
                throw 'ERROR Sync Ports';
            return this.SyncDailyReports(dailyReportsMappings, usersMappings, portsMappings);
        }).then(resultSyncDailyReports => {
            if (!resultSyncDailyReports)
                throw 'ERROR Sync DailyReports';
            return true;
        }).catch(result => {
            console.error(result);
            console.log(result);
            return false;
        });
    }
    async ActualizamosAlArregloMappingVoyage(voyagesMappingsReverse) {
        let voyagesArray = await this.db.voyages.toArray();
        let portsArray = await this.db.ports.toArray();
        let dailyReportsArray = await this.db.dailyReports.toArray();
        console.log(voyagesArray);
        console.log(portsArray);
        console.log(dailyReportsArray);
        return await Promise.resolve(true).then(result => {
            // Arreglo con los update
            let arrdeUpdate = [];
            // Recorreoms todo el mapping
            voyagesMappingsReverse.forEach(mapping => {
                console.log('actualizaviajeypuertodentro    : ' + mapping.key + '  - ' + mapping.value);
                // Agregamos al arreglo
                arrdeUpdate.push(this.ActualizaViajeIdLocalConElDelServer(mapping.key, mapping.value, true));
            });
            // EJecutamos las promesas
            return Promise.all(arrdeUpdate);
        }).then(result => {
            result.forEach(element => {
                if (!element)
                    throw 'ERROR No se actualizo un elemento del arreglo.';
            });
            // Revisamos el resultado
            console.log('Primer then');
            console.log(result);
            //Continumos
            return true;
        }).then(result => {
            return true;
        }).catch(err => {
            console.error(err);
            console.log('ActualizamosAlArregloMappingVoyage', voyagesMappingsReverse);
            return false;
        });
    }
    // Actualizamos el viaje junto cpon el puerto.
    async ActualizaViajeIdLocalConElDelServer(oldVoyageIdLocal, newVoyageIdServer, isUpdateSyncStatus) {
        return await Promise.resolve(true)
            .then(result => {
            // Se desea actualizar el synxStatus
            if (isUpdateSyncStatus) {
                return this.db.voyages.update(oldVoyageIdLocal, { id: newVoyageIdServer, syncStatus: 'none' });
            }
            else {
                return this.db.voyages.update(oldVoyageIdLocal, { id: newVoyageIdServer });
            }
        })
            .then(result => {
            return this.ActualizaPuertosDeUnViajeIdDistintoAlServer(oldVoyageIdLocal, newVoyageIdServer);
        })
            .then(result => {
            return true;
        })
            .catch(error => {
            console.error('ERROR actualizaviajeypuertodentro', error);
            return false;
        });
    }
    async VerificaSiElUltimoIdEsDiferenteAlDelServer(voyagesMappingsReverse, portsMappingsMappingsReverse, dailyReportsMappingsReverse) {
        console.log('VerificaSiElUltimoIdEsDiferenteAlDelServer');
        console.log(voyagesMappingsReverse);
        console.log(portsMappingsMappingsReverse);
        console.log(dailyReportsMappingsReverse);
        // Capturamos los ultimo id registrados desde la bd, para poder asignarlos a los nuevos.
        let ultimoVoyageIdLocal, ultimoPortIdLocal, ultimoDailyReportIdLocal;
        // Verificamos si se registro algun viaje,
        if (voyagesMappingsReverse.length > 0) {
            // Capturamos el ultimo id registrado.
            ultimoVoyageIdLocal = voyagesMappingsReverse[0].key;
            let ultimoVoyageIdServer = voyagesMappingsReverse[0].value;
            // Si el key es diferente.
            if (voyagesMappingsReverse[0].value != voyagesMappingsReverse[0].key) {
                // Verificamos si existe viajes superiores a este 
                let voyages = await this.db.voyages.toArray();
                // fILTRAMOS los viajes mayor o igual al ultimo id.
                let listFilterVoyageMayoresQueElId = voyages.filter(voyage => voyage.id > ultimoVoyageIdLocal).reverse();
                ultimoVoyageIdServer = ultimoVoyageIdServer + listFilterVoyageMayoresQueElId.length + 1;
                console.log('Cantidad de viajes superiores al key' + ultimoVoyageIdLocal);
                console.log(listFilterVoyageMayoresQueElId);
                // Recorremos la lista.
                for await (let voyage of listFilterVoyageMayoresQueElId) {
                    // Le sumamos mas 1 al server.
                    ultimoVoyageIdServer = ultimoVoyageIdServer - 1;
                    console.log('VAije local que se actualizara' + voyage.id);
                    console.log('VAije local que se actualizara con el nuevo' + ultimoVoyageIdServer);
                    let voyageIdLocal = voyage.id;
                    let newVoyageId = ultimoVoyageIdServer;
                    let resultUpdate = await this.ActualizaViajeIdLocalConElDelServer(voyageIdLocal, newVoyageId, false);
                    if (!resultUpdate) {
                        console.error('ERROR AL ACTUALIZAR LOS VIAJES LOCALES');
                    }
                }
            }
        }
        // Verificamos si se ha registra algun puerto
        if (portsMappingsMappingsReverse.length > 0) {
            // Capturamos el ultimo id registrado.
            ultimoPortIdLocal = portsMappingsMappingsReverse[0].key;
            let ultimoPortIdServer = portsMappingsMappingsReverse[0].value;
            // Si el key es diferente.
            if (portsMappingsMappingsReverse[0].value != portsMappingsMappingsReverse[0].key) {
                // Verificamos si existe viajes superiores a este 
                let dbPorts = await this.db.ports.toArray();
                // fILTRAMOS los viajes mayor o igual al ultimo id.
                let listFilterMayorAUltimoPortId = dbPorts.filter(port => port.id > ultimoPortIdLocal).reverse();
                ultimoPortIdServer = ultimoPortIdServer + listFilterMayorAUltimoPortId.length + 1;
                // Recorremos la lista.
                for await (let iPort of listFilterMayorAUltimoPortId) {
                    // Le sumamos mas 1 al server.
                    ultimoPortIdServer = ultimoPortIdServer - 1;
                    let antiguoId = iPort.id;
                    let newId = ultimoPortIdServer;
                    // Y le sumamos un digito.
                    await this.db.ports.update(antiguoId, { id: newId });
                    console.log('Actualizmaos los reportes dentro del puerto');
                    await this.EstaFuncionSirveParaActualizarALosReportesConElNUevoIdDelPuerto(antiguoId, newId);
                    console.log('FIN puertos que estan en el viaje');
                }
            }
        }
        // Verificamos si se ha registra algun puerto
        if (dailyReportsMappingsReverse.length > 0) {
            // Capturamos el ultimo id registrado.
            ultimoDailyReportIdLocal = dailyReportsMappingsReverse[0].key;
            let ultimoDailyReportIdServer = dailyReportsMappingsReverse[0].value;
            // Si el key es diferente.
            if (dailyReportsMappingsReverse[0].value != dailyReportsMappingsReverse[0].key) {
                // Verificamos si existe viajes superiores a este 
                let dbDailyReport = await this.db.dailyReports.toArray();
                // Filtramos los viajes mayor o igual al ultimo id.
                let listFilterMayorAUltimoReportId = dbDailyReport.filter(report => report.id > ultimoDailyReportIdLocal).reverse();
                ultimoDailyReportIdServer = ultimoDailyReportIdServer + listFilterMayorAUltimoReportId.length + 1;
                // Recorremos la lista.
                for await (let iReport of listFilterMayorAUltimoReportId) {
                    // Le sumamos mas 1 al server.
                    ultimoDailyReportIdServer = ultimoDailyReportIdServer - 1;
                    let antiguoId = iReport.id;
                    let newId = ultimoDailyReportIdServer;
                    // Y le sumamos un digito.
                    await this.db.dailyReports.update(antiguoId, { id: newId });
                    console.log('FIN puertos que estan en el viaje');
                }
            }
        }
        console.log('Sale del  if');
        return true;
    }
};
DatabaseService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UserService,
        VoyageService,
        PortService,
        DailyReportService,
        LoadingService,
        NotificationsService,
        LanguageService])
], DatabaseService);
export { DatabaseService };
//# sourceMappingURL=database.service.js.map