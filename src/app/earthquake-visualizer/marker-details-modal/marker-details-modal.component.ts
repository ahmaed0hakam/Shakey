import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-marker-details-modal',
  standalone: true,
  templateUrl: './marker-details-modal.component.html',
  styleUrls: ['./marker-details-modal.component.sass'],
  imports: [MatDialogContent, MatDialogActions, CommonModule]
})
export class MarkerDetailsModal implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MarkerDetailsModal>,
    @Inject(MAT_DIALOG_DATA) public markerDetails: any
  ) {}

  ngOnInit() { // Changed to ngOnInit (lowercase 'n')
    console.log(this.markerDetails);
  }

  close(): void {
    this.dialogRef.close();
  }
}
