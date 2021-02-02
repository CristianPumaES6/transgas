import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: 'loading.html',
    styleUrls: ['loading.scss']
})
export class LoadingComponent implements OnInit {

    @Output('onLoaded') private onLoaded: EventEmitter<LoadingComponent> = new EventEmitter<LoadingComponent>();

    public opened: boolean = false;

    constructor() {
        console.log('constructor()');

    }

    public ngOnInit() {
        console.log('ngOnInit()');

        this.onLoaded.emit(this);
    }

    public open(): boolean {
        console.log('open()');

        this.opened = true;
        return false;
    }

    public close(): boolean {
        console.log('close()');

        this.opened = false;
        return false;
    }

    public isOpened(): boolean {
        console.log('isOpened()');

        return (this.opened === true);
    }
}