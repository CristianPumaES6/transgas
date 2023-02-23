import { Injectable } from '@angular/core';
import { ASideComponent } from '../shared/a-side/a-side.component';

@Injectable()

export class ASideService {

    // Inicializamos nuestro componente.
    private aSide: ASideComponent = null;



    // Inicializamos los valores de navBar.
    public Initialize(aSide: ASideComponent): void {
        console.log('Initialize(aSide: ASideComponent)');
        this.aSide = aSide;
    }


    public OpenClose(type: string): void {
        console.log('OpenClose(type: string)');


        this.aSide.ClickFormulateOrMenuOrClose(type);
    }

    public Close(): void {
        console.log('Close()');


        this.aSide.ClickFormulateOrMenuOrClose('');
    }

    public IsOpened(): boolean {
        console.log('IsOpened()');


        return // (this.loading && this.loading.isOpened()) || false;
    }

    public SetNavLink(navLink: string): void {
        console.log('SetNavLink(navLink: string)');


        this.aSide.setNavLink(navLink);
    }
}