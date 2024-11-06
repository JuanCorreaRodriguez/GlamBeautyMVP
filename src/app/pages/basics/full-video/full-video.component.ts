import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
@Component({
  selector: 'app-full-video',
  templateUrl: './full-video.component.html',
  styleUrls: ['./full-video.component.scss'],
})
export class FullVideoComponent implements OnInit {
  path = '';
  constructor(
    public dialogRef: MatDialogRef<FullVideoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.path = this.data.dataKey;
  }
}
