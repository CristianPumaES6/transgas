import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { LanguageService } from '../services/language.service';
// https://angular.io/guide/pipes
// A pipe takes in data as input and transforms it to a desired output. In this page, you'll use pipes to transform a component's birthday property into a human-friendly date.
let TranslateMessagePipe = class TranslateMessagePipe {
    constructor(languageService) {
        this.languageService = languageService;
    }
    transform(value, category, language) {
        return this.languageService.GetMessage(category, value, language);
    }
};
TranslateMessagePipe = __decorate([
    Pipe({ name: 'translateMessage' }),
    __metadata("design:paramtypes", [LanguageService])
], TranslateMessagePipe);
export { TranslateMessagePipe };
//# sourceMappingURL=language.pipe.js.map