import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { DialogMembersComponent } from '../../dialogs/dialog-members/dialog-members.component';
import { DialogAddUserComponent } from '../../dialogs/dialog-add-user/dialog-add-user.component';
import { User } from '../../../../models/user.class';

export interface ElementPos {
  y: number,
  h: number,
  x: number,
  w: number,
}

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

  members: User[] = [
    {
      firstName: 'Frederik',
      lastName: 'Beck (Du)',
      avatar: 1,
      email: '',
      status: '',
    },
    {
      firstName: 'Sofia',
      lastName: 'Müller',
      avatar: 2,
      email: '',
      status: '',
    },
    {
      firstName: 'Noah',
      lastName: 'Braun',
      avatar: 3,
      email: '',
      status: '',
    },
  ];

  @ViewChild('channleInfo') channelInfo?: ElementRef;
  @ViewChild('membersInfo') membersInfo?: ElementRef;
  @ViewChild('addUser') addUser?: ElementRef;

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
    let pos = this.getDialogPos(this.membersInfo, 'right');
    let members = this.members;
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: {members},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  // Daten müssen noch angepasst werde
  openDialogAddUser(): void {
    let pos = this.getDialogPos(this.addUser, 'right');
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) console.log(result)
    });
  }


  getDialogPos(element: ElementRef | undefined, cornerPos: 'right' | 'left'): DialogPosition | undefined {
    if (!element) return undefined
    const windowW = window.innerWidth;
    let pos: ElementPos;
    if (element.nativeElement) pos = this.getElementPos(element.nativeElement);
    else {
      let e: any = element;
      pos = this.getElementPos(e._elementRef.nativeElement)
    }
    if (cornerPos === 'right') return { top: pos.y + pos.h + 'px', right: windowW - pos.x - pos.w + 'px' }
    else return { top: pos.y + pos.h + 'px', right: pos.x + 'px' }
  }


  getElementPos(element: any): ElementPos {
    return {
      y: element.getBoundingClientRect().y,
      h: element.getBoundingClientRect().height,
      x: element.getBoundingClientRect().x,
      w: element.getBoundingClientRect().width,
    }
  }


  test() {
    debugger
  }

}
