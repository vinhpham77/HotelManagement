import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogConfirm } from 'src/app/models/dialog-confirm';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirm,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
