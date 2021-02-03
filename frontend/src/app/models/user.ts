export class User {
    constructor(
        public id?: number,
        public nick?: string,
        public name?: string,
        public password?: string,
        public language?: string,
        public role?: string,
        public status?: boolean,

    ) {
        this.id = id || null;
        this.nick = nick || '';
        this.name = name || '';
        this.password = password || '';
        this.language = language || 'EN';
        this.role = role || '';
        this.status = status || true;
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