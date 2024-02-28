import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogMembersComponent } from '../../dialogs/dialog-members/dialog-members.component';
import { DialogAddUserComponent } from '../../dialogs/dialog-add-user/dialog-add-user.component';
import { User } from '../../../../shared/models/user.class';
import { Channel } from '../../../../shared/models/channel.class';
import { DialogChannelComponent } from '../../dialogs/dialog-channel/dialog-channel.component';
import { MembershipService } from '../../../../shared/firebase-services/membership.service';
import { PositionService } from '../../../../shared/services/position.service';
import { DialogErrorComponent } from '../../../../shared/components/dialogs/dialog-error/dialog-error.component';
import { Membership } from '../../../../shared/models/membership.class';
import { Subscription } from 'rxjs';

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

  // @Input() members: User[] = [];
  @Input() channel: Channel = new Channel({});
  @Input() allUsers: User[] = [];
  @Input() currentChannelID: string = '';

  @ViewChild('channleInfo') channelInfo?: ElementRef;
  @ViewChild('membersInfo') membersInfo?: ElementRef;
  @ViewChild('addUser') addUser?: ElementRef;

  currentChannelMemberships: Membership[] = [];
  currentChannelMembers: User[] = [];
  currentChannelMemberIDs: string[] = [];

  private channelMembershipSubscription?: Subscription;

  constructor(public dialog: MatDialog,
    private MembershipService: MembershipService,
    private PositionService: PositionService) {

  }

  ngOnInit() {
    this.MembershipService.getChannelMemberships(this.currentChannelID);
    this.channelMembershipSubscription = this.MembershipService.channelMemberships$.subscribe(channelMemberships => {
      this.currentChannelMemberships = channelMemberships;
      this.currentChannelMemberIDs = this.currentChannelMemberships.map(membership => membership.userID);
      this.currentChannelMembers = this.allUsers.filter(user => user.id && this.currentChannelMemberIDs.includes(user.id));
    });
  }
  

  ngOnDestroy() {
    this.channelMembershipSubscription?.unsubscribe();
  }

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

  openDialogChannel(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.channelInfo, 'left');
    let channel = this.channel;
    const dialogRef = this.dialog.open(DialogChannelComponent, {
      width: '750px',
      position: pos, panelClass: ['card-left-corner'],
      data: { channel: this.channel, allUsers: this.allUsers },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogMembers(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.membersInfo, 'right');
    let members = this.currentChannelMembers;
    const dialogRef = this.dialog.open(DialogMembersComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: { members: this.currentChannelMembers },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.openDialogAddUser();
    });
  }

  openDialogAddUser(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.addUser, 'right');
    this.currentChannelMemberIDs = this.currentChannelMembers.map(user => user.id!);
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      position: pos, panelClass: ['card-right-corner'],
      data: { allUsers: this.allUsers, currentMemberIDs: this.currentChannelMemberIDs, channel: this.channel },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) console.log(result);
      this.saveAddedMembers(result);
    });
  }

  async saveAddedMembers(selectedUsers: User[]) {
    if (selectedUsers) {
      for (let user of selectedUsers) {
        try {
          let membership = this.MembershipService.createMembership(user.id!, this.channel.id);
          await this.MembershipService.addMembership(membership);
          // this.members.push(user); // ggf. sauberer lösen durch unmittelbares Abo dieser Komponente auf members-Array
        } catch (err) {
          console.error(err);
          this.dialog.open(DialogErrorComponent, {
            panelClass: ['card-round-corners'],
            data: { errorMessage: 'Es gab ein Problem beim Hinzufügen von Mitgliedern. Bitte versuche es erneut.' }
          });
          break;
        }
      }
    }
  }

  
}
