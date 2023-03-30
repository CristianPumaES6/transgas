import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let ASideService = class ASideService {
    constructor() {
        // Inicializamos nuestro componente.
        this.aSide = null;
    }
    // Inicializamos los valores de navBar.
    Initialize(aSide) {
        console.log('Initialize(aSide: ASideComponent)');
        this.aSide = aSide;
    }
    OpenClose(type) {
        console.log('OpenClose(type: string)');
        this.aSide.ClickFormulateOrMenuOrClose(type);
    }
    Close() {
        console.log('Close()');
        this.aSide.ClickFormulateOrMenuOrClose('');
    }
    IsOpened() {
        console.log('IsOpened()');
        return; // (this.loading && this.loading.isOpened()) || false;
    }
    SetNavLink(navLink) {
        console.log('SetNavLink(navLink: string)');
        this.aSide.setNavLink(navLink);
    }
};
ASideService = __decorate([
    Injectable()
], ASideService);
export { ASideService };
//# sourceMappingURL=a-side.service.js.map