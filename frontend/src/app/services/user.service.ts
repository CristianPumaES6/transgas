import { Injectable } from '@angular/core';
//import { UUID } from 'angular2-uuid';
import Dexie from 'dexie';
//import { Todo } from '../models/todo';

//Services
import { OnlineOfflineService } from './online-offline.service';
import { DatabaseService } from './database.service';

// Models
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {

    private users: User[] = [];
    private db: any;

    constructor(
        private readonly onlineOfflineService: OnlineOfflineService,
        private readonly databaseService: DatabaseService,
    ) {
        console.log('constructor()');

        this.db = this.databaseService.getDatabase();

        this.registerToEvents(onlineOfflineService);

    }


    private registerToEvents(onlineOfflineService: OnlineOfflineService) {
        console.log('registerToEvents(onlineOfflineService: OnlineOfflineService)');

        // Verificamos como se encuentra el servicios
        if (onlineOfflineService.updateOnlineStatus()) {
            console.log('went online');
            console.log('sending all stored items');
            this.sendItemsFromIndexedDb();
        } else {
            console.log('went offline, storing in indexdb');
        }

    }




    private async sendItemsFromIndexedDb() {
        console.log('sendItemsFromIndexedDb()');

        const allItems: User[] = await this.db.users.toArray();

        allItems.forEach((item: User) => {

            console.log(`item ${item.id} sent and deleted locally------------- NO`);
            /*      this.db.todos.delete(item.id).then(() => {
                     console.log(`item ${item.id} sent and deleted locally`);
                 }); */

        });
    }


    private addUserIndexedDb(user: User) {
        this.db.users
            .add(user)
            .then(async () => {

                const allItems: User[] = await this.db.todos.toArray();
                console.log('saved in DB, DB is now', allItems);
                
            })
            .catch(e => {
                alert('Error: ' + (e.stack || e));
            });
    }


}