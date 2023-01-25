export class MailOptions {
    constructor(
        public from?: string,
        public to?: string,
        public subject?: string,
        public html?: string,
        public text?: string,
        public cc?: string,
        public bcc?: string,
        public attachments?: any,
    ) {
        this.from = from || '';
        this.to = to || '';
        this.subject = subject || '';
        this.html = html || '';
        this.text = text || '';
        this.cc = cc || '';
        this.bcc = bcc || '';
        this.attachments = attachments || '';
    }

}
