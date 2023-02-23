import { Injectable } from '@angular/core';
import { LoadingComponent } from '../shared/loading/loading.component';

@Injectable()

export class LoadingService {

    private loading: LoadingComponent = null;

    public Initialize(loading: LoadingComponent): void {
        console.log('Initialize(loading: LoadingComponent)');


        this.loading = loading;
    }

    public Open(): void {
        console.log('Open()');


        this.loading.open();
    }

    public Close(): void {
        console.log('Close()');
        
        this.loading.close();
    }

    public IsOpened(): boolean {
        console.log('IsOpened()');
        
        return (this.loading && this.loading.isOpened()) || false;
    }

}
