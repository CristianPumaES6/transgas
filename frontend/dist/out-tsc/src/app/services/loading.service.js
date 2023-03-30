import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let LoadingService = class LoadingService {
    constructor() {
        this.loading = null;
    }
    Initialize(loading) {
        console.log('Initialize(loading: LoadingComponent)');
        this.loading = loading;
    }
    Open() {
        console.log('Open()');
        this.loading.open();
    }
    Close() {
        console.log('Close()');
        this.loading.close();
    }
    IsOpened() {
        console.log('IsOpened()');
        return (this.loading && this.loading.isOpened()) || false;
    }
};
LoadingService = __decorate([
    Injectable()
], LoadingService);
export { LoadingService };
//# sourceMappingURL=loading.service.js.map