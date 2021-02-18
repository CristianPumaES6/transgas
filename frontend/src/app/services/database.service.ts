import { Injectable } from '@angular/core';

import { Dexie } from 'dexie';

// Models
import { User } from '../models/user';

// Online service
import { UserService } from '../services/user.service';
import { Mapping } from '../models/mapping';
import { user } from '../languages/en.messages';


@Injectable()
export class DatabaseService {

    // 
    private db: any;

    constructor(
        private userService: UserService
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
            users: '++id,nick,name,filename,password,language,role,minSpeed,maxSpeed,isConsumptionIFO,isConsumptionLSFO,isConsumptionMGO,maxIFOConsumption,maxMGOConsumption,minIFOConsumption,minMGOConsumption,isMEMGO,isAEMGO,isBoilerMGO,isIGMGO,isPowerPMGO,isOtherMGO,isMEIFO,isAEIFO,isBoilerIFO,isOtherIFO,contractSpeedSailingBallastMGO,contractSpeedSailingLadenMGO,contractSpeedSailingEconomicalMGO,loadingConsumptionMGO,dischargeConsumptionMGO,sailingBallastConsumptionMGO,sailingLoadConsumptionMGO,sailingEconomicConsumptionMGO,anchoredConsumptionMGO,maneuverConsumptionMGO,otherConsumptionMGO,contractSpeedSailingBallastIFO,contractSpeedSailingLadenIFO,contractSpeedSailingEconomicalIFO,loadingConsumptionIFO,dischargeConsumptionIFO,sailingBallastConsumptionIFO,sailingLoadConsumptionIFO,sailingEconomicConsumptionIFO,anchoredConsumptionIFO,maneuverConsumptionIFO,otherConsumptionIFO,isDisplayLSFOConsumption,isDisplayMGOConsumption,isDisplayAverageSpeed,isDisplayDataMGO,isDisplayDataLSFO,isDisplayVesselPerformanceLSFO,isDisplayVesselPerformanceMGO,userIdCreated,dateCreated,userIdUpdated,dateUpdated,status,syncStatus'
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

        usersMappings = await this.SyncUsers();

        console.log('Sync Fin');
        return true;

    }

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

            // Actualizamos el syncStatus a none. [REVISAR]
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
            await this.db.users.update(iUser.id, { syncStatus: 'none' });
        }


        return saveUserMappings;

    }


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
                );

            }
        );
    }

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
                nick : user.nick,
                name : user.name,
                filename : user.filename,
                password : user.password,
                language : user.language,
                role : user.role,
        
                minSpeed : user.minSpeed,
                maxSpeed : user.maxSpeed,
                isConsumptionIFO : user.isConsumptionIFO,
                isConsumptionLSFO : user.isConsumptionLSFO,
                isConsumptionMGO : user.isConsumptionMGO,
                maxIFOConsumption : user.maxIFOConsumption,
                maxMGOConsumption : user.maxMGOConsumption,
                minIFOConsumption : user.minIFOConsumption,
                minMGOConsumption : user.minMGOConsumption,
                isMEMGO : user.isMEMGO,
                isAEMGO : user.isAEMGO,
                isBoilerMGO : user.isBoilerMGO,
                isIGMGO : user.isIGMGO,
                isPowerPMGO : user.isPowerPMGO,
                isOtherMGO : user.isOtherMGO,
                isMEIFO : user.isMEIFO,
                isAEIFO : user.isAEIFO,
                isBoilerIFO : user.isBoilerIFO,
                isOtherIFO : user.isOtherIFO,
        
                // Performance MGO
                contractSpeedSailingBallastMGO : user.contractSpeedSailingBallastMGO,
                contractSpeedSailingLadenMGO : user.contractSpeedSailingLadenMGO,
                contractSpeedSailingEconomicalMGO : user.contractSpeedSailingEconomicalMGO,
                loadingConsumptionMGO : user.loadingConsumptionMGO,
                dischargeConsumptionMGO : user.dischargeConsumptionMGO,
                sailingBallastConsumptionMGO : user.sailingBallastConsumptionMGO,
                sailingLoadConsumptionMGO : user.sailingLoadConsumptionMGO,
                sailingEconomicConsumptionMGO : user.sailingEconomicConsumptionMGO,
                anchoredConsumptionMGO : user.anchoredConsumptionMGO,
                maneuverConsumptionMGO : user.maneuverConsumptionMGO,
                otherConsumptionMGO : user.otherConsumptionMGO,
        
        
                // Performance IFO
                contractSpeedSailingBallastIFO : user.contractSpeedSailingBallastIFO,
                contractSpeedSailingLadenIFO : user.contractSpeedSailingLadenIFO,
                contractSpeedSailingEconomicalIFO : user.contractSpeedSailingEconomicalIFO,
                loadingConsumptionIFO : user.loadingConsumptionIFO,
                dischargeConsumptionIFO : user.dischargeConsumptionIFO,
                sailingBallastConsumptionIFO : user.sailingBallastConsumptionIFO,
                sailingLoadConsumptionIFO : user.sailingLoadConsumptionIFO,
                sailingEconomicConsumptionIFO : user.sailingEconomicConsumptionIFO,
                anchoredConsumptionIFO : user.anchoredConsumptionIFO,
                maneuverConsumptionIFO : user.maneuverConsumptionIFO,
                otherConsumptionIFO : user.otherConsumptionIFO,
        
        
                // Dashboard
                isDisplayLSFOConsumption : user.isDisplayLSFOConsumption,
                isDisplayMGOConsumption : user.isDisplayMGOConsumption,
                isDisplayAverageSpeed : user.isDisplayAverageSpeed,
                isDisplayDataMGO : user.isDisplayDataMGO,
                isDisplayDataLSFO : user.isDisplayDataLSFO,
                isDisplayVesselPerformanceLSFO : user.isDisplayVesselPerformanceLSFO,
                isDisplayVesselPerformanceMGO : user.isDisplayVesselPerformanceMGO,
        
        
                // Audiotoria
                userIdCreated : user.userIdCreated,
                dateCreated : user.dateCreated,
                userIdUpdated : user.userIdUpdated,
                dateUpdated : user.dateUpdated,
                status : user.status,
                syncStatus : user.syncStatus,
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
}