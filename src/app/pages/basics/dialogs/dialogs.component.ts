import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VariablesService } from 'src/app/core/variables.service';
import { ModelInfDialogData } from 'src/app/interfaces/Global.interface';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.scss'],
})
export class DialogsComponent implements OnInit {
  title = '';
  message = '';
  gModelDialog: ModelInfDialogData;

  constructor(
    public variables: VariablesService,
    public dialogRef: MatDialogRef<DialogsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public model: ModelInfDialogData
  ) {
    this.gModelDialog = data.model;
  }

  onNoClick(): void {
    //this.dialogRef.close();
  }

  ngOnInit(): void {
    //this.gModelDialog = this.data;
  }

  continue() {
    /**CONT */
  }
  cancel() {
    /** CANCEL */
  }
}
