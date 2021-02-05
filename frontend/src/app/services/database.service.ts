import { Injectable } from '@angular/core';

// Models
import { User } from '../models/user';

// Online service
import { OnlineOfflineService } from './online-offline.service';

import { Dexie } from 'dexie';

@Injectable()
export class DatabaseService {

    // 
    private db: any;

    constructor(
        private readonly onlineOfflineService: OnlineOfflineService
    ) {
        console.log('constructor()');

        this.registerToEvents(onlineOfflineService);
        this.createDatabase();
    }

    private registerToEvents(onlineOfflineService: OnlineOfflineService) {
        console.log('registerToEvents(onlineOfflineService: OnlineOfflineService)');

        //  
        if (this.onlineOfflineService.updateOnlineStatus()) {
            console.log('went online');
            console.log('sending all stored items');
            this.sendItemsFromIndexedDb();
        } else {
            console.log('went offline, storing in indexdb');
        }
    }

    private createDatabase() {
        console.log('createDatabase()');


        this.db = new Dexie('TransgasDatabase');
        this.db.version(1).stores({
            users: 'id,nick,name,password,language,role,status,syncStatus'
        });
    }

    public getDatabase() {
        console.log('getDatabase()');

        return this.db;
    }

    // Enviar item y eliminar de la BD.
    private async sendItemsFromIndexedDb() {
        console.log('sendItemsFromIndexedDb()');


        const allUsers = [];
        //const allUsers: User[] = await this.db.users.toArray();

        allUsers.forEach((item: User) => {
            // Actualizar el items;
            /*  this.db.users.update(item.id).then(() => {
                 console.log(`item ${item.id} sent and deleted locally`);
             }); */
        });

    }
}