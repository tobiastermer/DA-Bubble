import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../models/user.class';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';
import { CommonModule } from '@angular/common';
import { Channel } from '../../../../models/channel.class';



@Component({
  selector: 'app-dialog-channel',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    UserChipComponent,
    CommonModule
  ],
  templateUrl: './dialog-channel.component.html',
  styleUrl: './dialog-channel.component.scss'
})
export class DialogChannelComponent {

  editName = false;
  editDesc = false;

  channel?: Channel;


  @ViewChild('userInp') userInp?: ElementRef;


  constructor(
    public dialogRef: MatDialogRef<DialogChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (!data) this.onNoClick();
    this.channel = data.channel;
  }


  editChannelName(){
    this.editName = true;
  }


  saveChannelName(){
    this.editName = false;
  }


  editChannelDescr(){
    this.editDesc = true;
  }


  saveChannelDescr(){
    this.editDesc = false;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
