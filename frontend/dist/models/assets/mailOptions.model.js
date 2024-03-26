"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailOptions = void 0;
class MailOptions {
    constructor(from, to, subject, html, text, cc, bcc, attachments) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.html = html;
        this.text = text;
        this.cc = cc;
        this.bcc = bcc;
        this.attachments = attachments;
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
exports.MailOptions = MailOptions;
//# sourceMappingURL=mailOptions.model.js.map