import { Injectable } from '@angular/core';

import { Dexie } from 'dexie';

// Models
import { User } from '../models/user';

// Online service
import { UserService } from '../services/user.service';
import { Mapping } from '../models/mapping';


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
            users: 'id,nick,name,password,language,role,status,syncStatus'
        });

    }

    // Obtener DataBase
    public getDatabase() {
        console.log('getDatabase()');

        return this.db;
    }

    public async Sync(): Promise<boolean> {
        console.log('Sync');

        // Usuarios agregados en local mapeados.
        let usersMappings: Mapping[] = []
       
        usersMappings = await this.SyncUsers();

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

        // Recorremos por toods los users que falta por agregar.
        console.log('---------------Eliminar el console SyncUsers prueba asincrona----------------');
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
            // Verificamos si es sincrono.
            console.log('Verificamos si es sincrono.');
            console.log(resultCreate);

        }

        // Recorremos por todos los users que falta por actualizar.
        for (const iUser of updateUsers) {

            let resultCreate: User;
            resultCreate = await this.userService.SaveUser(iUser).pipe().toPromise();

            // Actualizamos el syncStatus a none.
            await this.db.users.update(iUser.id, { syncStatus: 'none' });

            // Verificamos si es sincrono.
            console.log('Verificamos si es sincrono.');
            console.log(resultCreate);

        }


        return saveUserMappings;

    }


    // =================== USERS IndexedDB ====================================

    // Agregar User por indexedDB
    private async addUserIndexedDB(user: User): Promise<boolean> {
        console.log('addUserIndexedDb(user: User)');

        return await this.db.users
            .add(user).then(
                async () => {

                    console.log('saved in DB, DB is now', user);

                    return true;
                });
    }

    // Agregar Users por indexedDB
    public async addUsersIndexedDB(users: User[]): Promise<boolean> {
        console.log('addUsersIndexedDB(users: User[])');

        // Verificamos como se encuentra el servicios
        if (true) {

            // for await
            for await (const iUser of users) {
                await this.addUserIndexedDB(iUser);
            }

        } else {

            console.log('went offline, storing in indexdb');
            return false;

        }

        return true;

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