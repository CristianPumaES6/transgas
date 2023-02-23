import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    color: string,
    icon: string;
    title: string;
    mensage: string;
}

@Component({
    selector: 'app-dialog-delete',
    templateUrl: 'dialog-delete.component.html',
    styleUrls: ['dialog-delete.component.scss']
})
export class DialogDeleteComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DialogDeleteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    ngOnInit() {
        console.log('ngOnInit() ');
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }

}