import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { DialogMembersComponent } from '../../dialogs/dialog-members/dialog-members.component';

@Component({
  selector: 'app-header-channel',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './header-channel.component.html',
  styleUrl: './header-channel.component.scss'
})
export class HeaderChannelComponent {

  @ViewChild('channleInfo') channelInfo?: ElementRef;
  @ViewChild('membersInfo') membersInfo?: ElementRef;

  constructor(public dialog: MatDialog) { }

  changeImgBl() {
    if (!this.channelInfo) return;
    const srcImg1 = "./../../../../../assets/img/icons/hash_bl_24.png";
    const srcImg2 = "./../../../../../assets/img/icons/expand_more_bl.png";
    this.channelInfo.nativeElement.firstChild.src = srcImg1;
    this.channelInfo.nativeElement.lastChild.src = srcImg2;
  }


  changeImgBk() {
    if (!this.channelInfo) return;
    const srcImg1 = "./../../../../../assets/img/icons/hash_bk_22.png";
    const srcImg2 = "./../../../../../assets/img/icons/expand_more_bk.png";
    this.channelInfo.nativeElement.firstChild.src = srcImg1;
    this.channelInfo.nativeElement.lastChild.src = srcImg2;
  }


  // Daten müssen noch angepasst werde
  openDialogMembers(): void {
    let pos: DialogPosition | undefined = this.getMemberPos()
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      position: pos,
      panelClass: ['card-right-corner', 'test'],
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }


  getMemberPos(): DialogPosition | undefined {
    if (!this.membersInfo) return undefined
    const y = this.membersInfo.nativeElement.getBoundingClientRect().y
    const h = this.membersInfo.nativeElement.getBoundingClientRect().height
    const x = this.membersInfo.nativeElement.getBoundingClientRect().x
    const w = this.membersInfo.nativeElement.getBoundingClientRect().width
    const windowW = window.innerWidth;
    return { top: y + h + 'px', right: windowW - x - w + 'px'}
  }



  test() {
    debugger
  }

}
