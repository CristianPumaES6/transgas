import { Injectable } from '@angular/core';

import { Dexie } from 'dexie';

// Models
import { User } from '../models/user';

// Online service
import { UserService } from '../services/user.service';
import { Mapping, searchKey } from '../models/mapping';
import { user, voyage } from '../languages/en.messages';
import { Voyage } from '../models/voyage';
import { VoyageService } from './voyage.service';
import { Port } from '../models/port';
import { PortService } from './port.service';


@Injectable()
export class DatabaseService {

    // 
    private db: any;

    constructor(
        private userService: UserService,
        private voyageService: VoyageService,
        private portService: PortService
    ) {
        console.log('DatabaseService constructor()');

        // Creamos la DataBase.
        this.createDatabase();

    }

    // Creacion de BD.
    private createDatabase() {
        console.log('createDatabase()');

        this.db = new Dexie('TransgasDatabase');
        this.db.version(1).stores({
            users: '++id,nick,name,filename,password,language,role,minSpeed,maxSpeed,isConsumptionIFO,isConsumptionLSFO,isConsumptionMGO,maxIFOConsumption,maxMGOConsumption,minIFOConsumption,minMGOConsumption,isMEMGO,isAEMGO,isBoilerMGO,isIGMGO,isPowerPMGO,isOtherMGO,isMEIFO,isAEIFO,isBoilerIFO,isOtherIFO,contractSpeedSailingBallastMGO,contractSpeedSailingLadenMGO,contractSpeedSailingEconomicalMGO,loadingConsumptionMGO,dischargeConsumptionMGO,sailingBallastConsumptionMGO,sailingLoadConsumptionMGO,sailingEconomicConsumptionMGO,anchoredConsumptionMGO,maneuverConsumptionMGO,otherConsumptionMGO,contractSpeedSailingBallastIFO,contractSpeedSailingLadenIFO,contractSpeedSailingEconomicalIFO,loadingConsumptionIFO,dischargeConsumptionIFO,sailingBallastConsumptionIFO,sailingLoadConsumptionIFO,sailingEconomicConsumptionIFO,anchoredConsumptionIFO,maneuverConsumptionIFO,otherConsumptionIFO,isDisplayLSFOConsumption,isDisplayMGOConsumption,isDisplayAverageSpeed,isDisplayDataMGO,isDisplayDataLSFO,isDisplayVesselPerformanceLSFO,isDisplayVesselPerformanceMGO,userIdCreated,dateCreated,userIdUpdated,dateUpdated,status,syncStatus',
            voyages: '++id,userId,voyageNumber,year,userIdCreated,dateCreated,userIdUpdated,dateUpdated,status,syncStatus',
            ports: '++id,userId,voyageId,portNumber,departurePort,arrivalPort,userIdCreated,dateCreated,userIdUpdated,dateUpdated,status,syncStatus'
        });

    }

    // Obtener DataBase
    public getDatabase() {
        console.log('getDatabase()');

        return this.db;
    }

    public async Sync(): Promise<boolean> {
        console.log('Sync Inicio');

        // Usuarios agregados en local mapeados.
        let usersMappings: Mapping[] = []
        let voyagesMappings: Mapping[] = []
        let portsMappings: Mapping[] = []

        usersMappings = await this.SyncUsers();
        voyagesMappings = await this.SyncVoyages();
        portsMappings = await this.SyncPorts(voyagesMappings);

        console.log('Sync Fin');
        return true;

    }

    // =================== Sync IndexedDB ====================================
    // Sincroniza el modulo usuario.
    public async SyncUsers(): Promise<Mapping[]> {
        console.log('syncUsers(users:User)');

        // User Mappings
        let saveUserMappings: Mapping[] = [];

        // data del IndexedDB
        let usersIndexedDB: User[];
        usersIndexedDB = await this.db.users.toArray();

        // FIltramos los datos que faltan aggregar y actualizar.
        const addUsers = usersIndexedDB.filter((user: User) => user.syncStatus == 'added');
        const updateUsers = usersIndexedDB.filter((user: User) => user.syncStatus == 'updated');
        const deleteUsers = usersIndexedDB.filter((user: User) => user.syncStatus == 'deleted');

        // Recorremos por toods los users que falta por agregar.
        for (const iUser of addUsers) {
            // Resultado del create
            let resultCreate: User;
            resultCreate = await this.userService.CreateUser(iUser).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            await this.db.users.update(iUser.id, { id: resultCreate.id, syncStatus: 'none' });

            // Mapping user
            saveUserMappings.push(
                new Mapping(iUser.id, resultCreate.id)
            )
        }

        // Recorremos por todos los users que falta por actualizar.
        for (const iUser of updateUsers) {
            let resultUpdate: User;
            resultUpdate = await this.userService.SaveUser(iUser).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            await this.db.users.update(iUser.id, { syncStatus: 'none' });
        }


        for (const iUser of deleteUsers) {
            let resultDelete: User;
            resultDelete = await this.userService.DeleteUser(iUser).pipe().toPromise();
            // Actualizamos el syncStatus a none.
            await this.db.users.update(iUser.id, { status: false, syncStatus: 'none' });// REVISAR COMO SE ACTUALIZA EL STATUS
        }


        return saveUserMappings;

    }

    // Sincroniza el modulo voyage.
    public async SyncVoyages(): Promise<Mapping[]> {
        console.log('SyncVoyages()');

        // Voyage Mappings
        let saveVoyageMappings: Mapping[] = [];

        // data del IndexedDB
        let voyagesIndexedDB: Voyage[];
        voyagesIndexedDB = await this.db.voyages.toArray();

        // FIltramos los datos que faltan aggregar y actualizar.
        const addVoyages = voyagesIndexedDB.filter((voyage: Voyage) => voyage.syncStatus == 'added');
        const updateVoyages = voyagesIndexedDB.filter((voyage: Voyage) => voyage.syncStatus == 'updated');
        const deleteVoyages = voyagesIndexedDB.filter((voyage: Voyage) => voyage.syncStatus == 'deleted');

        // Recorremos todos los viajes que falta por agregar.
        for (const iVoyage of addVoyages) {
            // Resultado del create
            let resultCreate: Voyage;
            resultCreate = await this.voyageService.Create(iVoyage).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            await this.db.voyages.update(iVoyage.id, { id: resultCreate.id, voyageNumber: resultCreate.voyageNumber, syncStatus: 'none' });

            // Mapping user
            saveVoyageMappings.push(
                new Mapping(iVoyage.id, resultCreate.id)
            )
        }

        // Recorremos todos los voyages que falta por actualizar.
        for (const iVoyage of updateVoyages) {
            let resultUpdate: Voyage;
            resultUpdate = await this.voyageService.Save(iVoyage).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            await this.db.voyages.update(iVoyage.id, { syncStatus: 'none' });
        }


        for (const iVoyage of deleteVoyages) {
            let resultDelete: Voyage;

            resultDelete = await this.voyageService.Delete(iVoyage).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            await this.db.voyages.update(iVoyage.id, { status: false, syncStatus: 'none' });// REVISAR COMO SE ACTUALIZA EL STATUS
        }


        return saveVoyageMappings;

    }

    public async SyncPorts(voyagesMappings: Mapping[]): Promise<Mapping[]> {

        console.log('SyncVoyages()');

        // Voyage Mappings
        let savePortsMappings: Mapping[] = [];

        // data del IndexedDB
        let portsIndexedDB: Port[];
        portsIndexedDB = await this.db.voyages.toArray();

        // FIltramos los datos que faltan aggregar y actualizar.
        const addPorts = portsIndexedDB.filter((port: Port) => port.syncStatus == 'added');
        const updatePorts = portsIndexedDB.filter((port: Port) => port.syncStatus == 'updated');
        const deletePorts = portsIndexedDB.filter((port: Port) => port.syncStatus == 'deleted');

        // Recorremos todos los puertos que falta por agregar.
        for (let iPort of addPorts) {
            // Resultado del create
            let resultCreate: Port;

            debugger // Revisar que valor tiene el voyage
            let searchMapping = searchKey(voyagesMappings, iPort.voyageId);

            if (searchMapping) { iPort.voyageId = searchMapping.value }
            debugger // Revisar si cambio el valor del voyage

            resultCreate = await this.portService.Create(iPort).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            // Actualizo el numero de puerto por que puede cambiar.
            // Actualizo el id del viaje por que puede cambiar.
            await this.db.ports.update(iPort.id, { id: resultCreate.id, voyageId: resultCreate.voyageId, portNumber: resultCreate.portNumber, syncStatus: 'none' });

            // Mapping Port por el nuevo ID
            savePortsMappings.push(
                new Mapping(iPort.id, resultCreate.id)
            )
        }

        // Recorremos todos los voyages que falta por actualizar.
        for (let iPort of updatePorts) {
            let resultUpdate: Port;
            resultUpdate = await this.portService.Save(iPort).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            await this.db.ports.update(iPort.id, { syncStatus: 'none' });
        }


        for (let iPort of deletePorts) {
            let resultDelete: Port;

            resultDelete = await this.portService.Delete(iPort).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            await this.db.ports.update(iPort.id, { status: false, syncStatus: 'none' });// REVISAR COMO SE ACTUALIZA EL STATUS
        }


        return savePortsMappings;

    }


    // ================ FIN SYNC


    // =================== USERS IndexedDB ====================================
    // Obtiene a todos los usuarios de IndexDB
    public async getUsersIndexDB(): Promise<User[]> {
        console.log('getUsersIndexDB()');

        return await this.db.users.toArray().then(
            (results: User[]) => {

                return results.filter(
                    (user: User) => {
                        return user.status === true;
                    }
                ).reverse();

            }
        );
    }

    // Obtiene a un usuario por ID de IndexDB
    public async getUserIndexDB(Index: number): Promise<User> {
        console.log('getUserIndexDB(Index)');

        return await this.db.users.get(Index).then(
            (result: User) => {
                return result;
            });

    }

    // Agregar User por indexedDB
    public async addUserIndexedDB(user: User): Promise<User> {
        console.log('addUserIndexedDb(user: User)');

        return await this.db.users
            .add(user).then(
                (userId: number) => {
                    user.id = userId;

                    return user;
                });
    }

    // Agregar Users por indexedDB
    public async addUsersIndexedDB(users: User[]): Promise<boolean> {
        console.log('addUsersIndexedDB(users: User[])');

        // Verificamos como se encuentra el servicios
        if (true) {
            // for await
            for (const iUser of users) {
                await this.addUserIndexedDB(iUser);
            }

        } else {

            console.log('went offline, storing in indexdb');
            return false;

        }

        console.log('FINNNNNN SINCRONOs');

        return true;

    }

    // Actualiza User del IndexedDB
    public async updateUserIndexedDB(user: User): Promise<User> {
        console.log('updateUserIndexedDB(user: User)');

        return await this.db.users.update(user.id,
            {
                nick: user.nick,
                name: user.name,
                filename: user.filename,
                password: user.password,
                language: user.language,
                role: user.role,

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


                // Audiotoria
                userIdCreated: user.userIdCreated,
                dateCreated: user.dateCreated,
                userIdUpdated: user.userIdUpdated,
                dateUpdated: user.dateUpdated,
                status: user.status,
                syncStatus: user.syncStatus,
            }
        ).then((result: boolean) => {
            return user;
        });
    }

    public async ClearUsersIndexedDB(): Promise<boolean> {
        console.log('DeleteIndexedDB()')

        return await this.db.users.clear().then(
            () => {

                console.log('OK DELETE')
                return true;
            }
        );

    }
    //__________________________________________________________________________


    // =================== VOYAGES IndexedDB ====================================
    // Obtiene a todos los viajes de IndexDB
    public async getVoyagesIndexDB(): Promise<Voyage[]> {
        console.log('getVoyagesIndexDB()');

        return await this.db.voyages.toArray().then(
            (results: Voyage[]) => {

                return results.filter(
                    (voyage: Voyage) => {
                        return voyage.status === true;
                    }
                ).reverse();

            }
        );
    }

    // Obtiene a un viaje por ID de IndexDB
    public async getVoyageIndexDB(Index: number): Promise<Voyage> {
        console.log('getVoyageIndexDB(Index)');

        return await this.db.voyages.get(Index).then(
            (result: Voyage) => {
                return result;
            });

    }

    // Agregar Voyage por indexedDB
    public async addVoyageIndexedDB(voyage: Voyage): Promise<Voyage> {
        console.log('addVoyageIndexedDB(voyage: Voyage)');

        // Primero agregamos los puestos.
        await this.addPortsIndexedDB(voyage.ports);
        // Luego eliminamos los puetos
        delete voyage.ports;

        await this.db.voyages
            .add(voyage).then(
                (voyageId: number) => {
                    voyage.id = voyageId;

                    return voyage;
                });

        return voyage;
    }

    // Agregar Voyages por indexedDB
    public async addVoyagesIndexedDB(voyages: Voyage[]): Promise<boolean> {
        console.log('addVoyagesIndexedDB(voyages: Voyage[])');

        // Verificamos como se encuentra el servicios
        if (true) {

            // for await
            for (const iVoyage of voyages) {
                let voyage = iVoyage;
                voyage.totalPort = voyage.ports.length;
                voyage.totalReport = 0;// revisar total de reports
                await this.addVoyageIndexedDB(voyage);
            }

        } else {

            console.log('went offline, storing in indexdb');
            return false;

        }

        console.log('FINNNNNN SINCRONOs');

        return true;

    }

    // Actualiza Voyage del IndexedDB
    public async updateVoyageIndexedDB(voyage: Voyage): Promise<Voyage> {
        console.log('updateVoyageIndexedDB(voyage: Voyage)');

        return await this.db.voyages.update(voyage.id,
            {
                userId: voyage.userId,
                voyageNumber: voyage.voyageNumber,
                year: voyage.year,


                userIdCreated: voyage.userIdCreated,
                dateCreated: voyage.dateCreated,
                userIdUpdated: voyage.userIdUpdated,
                dateUpdated: voyage.dateUpdated,
                status: voyage.status,
                syncStatus: voyage.syncStatus
            }
        ).then((result: boolean) => {

            return voyage;
        });
    }

    public async ClearVoyagesIndexedDB(): Promise<boolean> {
        console.log('ClearVoyagesIndexedDB()')

        return await this.db.voyages.clear().then(
            () => {

                console.log('OK DELETE Voyages DB')
                return true;
            }
        );

    }
    //__________________________________________________________________________


    // =================== PORTS IndexedDB ====================================
    // Obtiene a todos los puertos de IndexDB
    public async getPortsIndexDB(): Promise<Port[]> {
        console.log('getPortsIndexDB()');

        return await this.db.ports.toArray().then(
            (results: Port[]) => {

                return results.filter(
                    (port: Port) => {
                        return Boolean(port.status) === true;
                    }
                ).reverse();

            }
        );
    }

    public async getPortsByVoyageIndexDB(voyageId: number): Promise<Port[]> {
        console.log('getPortsByVoyageIndexDB()');

        return await this.db.ports.toArray().then(
            (results: Port[]) => {

                return results.filter(
                    (port: Port) => {
                        return Number(port.voyageId) === Number(voyageId);
                    }
                ).reverse();

            }
        );
    }

    // Obtiene a un puerto por ID de IndexDB
    public async getPortIndexDB(Index: number): Promise<Port> {
        console.log('getPortIndexDB(Index)');

        return await this.db.ports.get(Index).then(
            (result: Port) => {
                return result;
            });

    }

    // Agregar Port por indexedDB
    public async addPortIndexedDB(port: Port): Promise<Port> {
        console.log('addPortIndexedDB(port: Port)');

        return await this.db.ports
            .add(port).then(
                (portID: number) => {
                    port.id = portID;

                    return port;
                });
    }

    // Agregar Ports por indexedDB
    public async addPortsIndexedDB(ports: Port[]): Promise<boolean> {
        console.log('addPortsIndexedDB(ports: Port[])');

        // Verificamos como se encuentra el servicios
        if (true) {

            // for await
            for (const iPort of ports) {

                if (Boolean(iPort.status) === true) {
                    await this.addPortIndexedDB(iPort);
                }
            }

        } else {

            console.log('went offline, storing in indexdb');
            return false;

        }

        console.log('FINNNNNN SINCRONOs');

        return true;

    }

    // Actualiza port del IndexedDB
    public async updatePortIndexedDB(port: Port): Promise<Port> {
        console.log('updateVoyageIndexedDB(voyage: Voyage)');

        return await this.db.ports.update(port.id,
            {
                userId: port.userId,
                voyageId: port.voyageId,
                portNumber: port.portNumber,
                departurePort: port.departurePort,
                arrivalPort: port.arrivalPort,


                userIdCreated: port.userIdCreated,
                dateCreated: port.dateCreated,
                userIdUpdated: port.userIdUpdated,
                dateUpdated: port.dateUpdated,
                status: port.status,
                syncStatus: port.syncStatus,
            }
        ).then((result: boolean) => {

            return port;
        });
    }

    public async ClearPortsIndexedDB(): Promise<boolean> {
        console.log('ClearVPortsIndexedDB()')

        return await this.db.ports.clear().then(
            () => {

                console.log('OK DELETE Ports DB')
                return true;
            }
        );

    }
    //__________________________________________________________________________
}