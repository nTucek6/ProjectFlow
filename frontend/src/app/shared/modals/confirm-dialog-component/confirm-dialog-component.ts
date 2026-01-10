import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface DialogData {
  title: string;
  message: string;
}


@Component({
  selector: 'app-confirm-dialog-component',
  imports: [MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogContent, MatButtonModule],
  templateUrl: './confirm-dialog-component.html',
  styleUrl: './confirm-dialog-component.scss',
})
export class ConfirmDialogComponent {
 data = inject<DialogData>(MAT_DIALOG_DATA);
}
