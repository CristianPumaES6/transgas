import { __decorate, __metadata } from "tslib";
import { Component, Output, EventEmitter } from '@angular/core';
let LoadingComponent = class LoadingComponent {
    constructor() {
        this.onLoaded = new EventEmitter();
        this.opened = false;
        console.log('constructor()');
    }
    ngOnInit() {
        console.log('ngOnInit()');
        this.onLoaded.emit(this);
    }
    open() {
        console.log('open()');
        this.opened = true;
        return false;
    }
    close() {
        console.log('close()');
        this.opened = false;
        return false;
    }
    isOpened() {
        console.log('isOpened()');
        return (this.opened === true);
    }
};
__decorate([
    Output('onLoaded'),
    __metadata("design:type", EventEmitter)
], LoadingComponent.prototype, "onLoaded", void 0);
LoadingComponent = __decorate([
    Component({
        selector: 'app-loading',
        templateUrl: 'loading.html',
        styleUrls: ['loading.scss']
    }),
    __metadata("design:paramtypes", [])
], LoadingComponent);
export { LoadingComponent };
//# sourceMappingURL=loading.component.js.map