import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-marker-details-modal',
  standalone: true,
  templateUrl: './marker-details-modal.component.html',
  styleUrls: ['./marker-details-modal.component.sass'],
  imports: [MatDialogContent, MatDialogActions]
})
export class MarkerDetailsModal {
  constructor(
    public dialogRef: MatDialogRef<MarkerDetailsModal>,
    @Inject(MAT_DIALOG_DATA) public markerDetails: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
