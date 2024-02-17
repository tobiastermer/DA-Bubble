import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { DialogMembersComponent } from '../../dialogs/dialog-members/dialog-members.component';
import { DialogAddUserComponent } from '../../dialogs/dialog-add-user/dialog-add-user.component';
import { User } from '../../../../shared/models/user.class';
import { Channel } from '../../../../shared/models/channel.class';
import { DialogChannelComponent } from '../../dialogs/dialog-channel/dialog-channel.component';

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

  // dummy - owner ID function is missing
  channel: Channel = {
    id: '',
    name: 'Entwicklerteam',
    description: `Dieser Channel ist für alles rund um #dfsdf vorgesehen. 
    Hier kannst du zusammen mit deinem Team Meetings abhalten, 
    Dokumente teilen und Entscheidungen treffen.`,
    ownerID: '' 
  }
  members: User[] = [
    {
      name: 'Frederik Beck (Du)',
      avatar: 1,
      email: '',
      status: '',
    },
    {
      name: 'Sofia Müller',
      avatar: 2,
      email: '',
      status: '',
    },
    {
      name: 'Noah Braun',
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
  openDialogChannel(): void {
    let pos = this.getDialogPos(this.channelInfo, 'left');
    let channel = this.channel;
    const dialogRef = this.dialog.open(DialogChannelComponent, {
      width: '750px',
      position: pos, panelClass: ['card-left-corner'],
      data: { channel },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


  // Daten müssen noch angepasst werde
  openDialogMembers(): void {
    let pos = this.getDialogPos(this.membersInfo, 'right');
    let members = this.members;
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: { members },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.openDialogAddUser();
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
    else return { top: pos.y + pos.h + 'px', left: pos.x + 'px' }
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
