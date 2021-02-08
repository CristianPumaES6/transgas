export class User {
    constructor(
        public id?: number,
        public nick?: string,
        public name?: string,
        public password?: string,
        public language?: string,
        public role?: string,
        public status?: boolean,
        public syncStatus?:string,// none added updated

    ) {
        this.id = id || null;
        this.nick = nick || '';
        this.name = name || '';
        this.password = password || '';
        this.language = language || 'EN';
        this.role = role || '';
        this.status = status || false;
        this.syncStatus = '';
    }

}


export class Login {
    constructor(
        public username?: string,
        public password?: string,
    ) {
        this.username = username || '';
        this.password = password || '';
    }
}