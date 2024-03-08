import { Injectable } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { MenuDialogComponent } from "../../main-content/header/menu-dialog/menu-dialog.component";
import { DialogShowUserComponent } from "../components/dialogs/dialog-show-user/dialog-show-user.component";
import { User } from "../models/user.class";
import { Channel } from "../models/channel.class";


@Injectable({
  providedIn: 'root',
})
export class DialogsService {

  constructor(
    public dialog: MatDialog
  ) { }


  public headerMenuDialog() {
    this.dialog.open(MenuDialogComponent, this.headerMenuProp());
  }


  private headerMenuProp(): any {
    let wWidth = window.innerWidth;
    if (wWidth > 1000) return {
      panelClass: ['card-right-corner'],
      position: { top: '90px', right: '20px' },
    }
    else return this.mobileCardBottom()
  }


  public showUserDialog(user: User, currentUserID: String | undefined) {
    const data = { user, currentUserID };
    this.dialog.open(DialogShowUserComponent, this.showUserProp(data));
  }


  private showUserProp(data: any) {
    let wWidth = window.innerWidth;
    if (wWidth > 1000) return {
      panelClass: ['card-right-corner'],
      position: {
        top: '90px',
        right: '20px',
      },
      data: data,
    }
    else return this.mobileCardCenter(data,'580px')
  }
  

  public emojiProp(pos?: DialogPosition){
    let wWidth = window.innerWidth;
    let classCorner = pos?.right ? 'card-right-bottom-corner' : 'card-left-bottom-corner';
    if (wWidth > 1000 && pos) return {
      position: pos,
      panelClass: [classCorner],
      width: '350px',
    }
    else return this.mobileCardCenter()
  }


  public atUserProp(currentMemberIDs: string[], channel?: Channel, pos?:DialogPosition) {
    let wWidth = window.innerWidth;
    let data = { currentMemberIDs: currentMemberIDs, channel: channel };
    if (wWidth > 1000 && pos) return {
      position: pos,
      panelClass: ['card-left-bottom-corner'],
      width: '350px',
      data: { data },
    }
    else return this.mobileCardBottom(data)
  }


  private mobileCardBottom(data?: any, minHeight?: string) {
    return {
      panelClass: ['mobile-card-corner'],
      position: { bottom: '0' },
      minHeight: minHeight,
      width: '100%',
      maxWidth: '100%',
      data: data
    }
  }


  private mobileCardCenter(data?: any, width?: string) {
    return {
      panelClass: ['card-round-corners'],
      width: width,
      maxWidth: '90vw',
      data: data
    }
  }

}