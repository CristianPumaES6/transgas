import { __decorate, __metadata, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageService } from '../../../services/language.service';
let DialogUpdateServerComponent = class DialogUpdateServerComponent {
    // Constructores para setear valores al componente.
    constructor(
    // Dialog referencia es el mismo.
    dialogRef, 
    // Data que se importara.
    data, 
    // servicio de lenguaje.
    languageService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.languageService = languageService;
        // Traducciones
        this.userLanguage = this.languageService.GetCurrentLanguage();
        this.translateCategory = 'dialog';
        this.iDialogUpdateServer = {
            versionActual: '',
            versionServer: '',
        };
    }
    ngOnInit() {
        this.iDialogUpdateServer = this.data || {
            versionActual: '',
            versionServer: '',
        };
    }
};
DialogUpdateServerComponent = __decorate([
    Component({
        selector: 'app-dialog-update-server',
        templateUrl: './dialog-update-server.component.html',
        styleUrls: ['./dialog-update-server.component.scss']
    }),
    __param(1, Inject(MAT_DIALOG_DATA)),
    __metadata("design:paramtypes", [MatDialogRef, Object, LanguageService])
], DialogUpdateServerComponent);
export { DialogUpdateServerComponent };
//# sourceMappingURL=dialog-update-server.component.js.map