import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MenuDialogComponent } from "../../main-content/header/menu-dialog/menu-dialog.component";
import { DialogShowUserComponent } from "../components/dialogs/dialog-show-user/dialog-show-user.component";
import { User } from "../models/user.class";


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
    else return this.mobileCardCenter(data)
  }


  private mobileCardBottom() {
    return {
      panelClass: ['mobile-card-corner'],
      position: { bottom: '0' },
      width: '100%',
      maxWidth: '100%',
    }
  }

  private mobileCardCenter(data: any) {
    return {
      panelClass: ['card-round-corners'],
      width: '580px',
      maxWidth: '90vw',
      data: data
    }
  }





}