import { Injectable } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { MenuDialogComponent } from "../../main-content/header/menu-dialog/menu-dialog.component";
import { DialogShowUserComponent } from "../components/dialogs/dialog-show-user/dialog-show-user.component";
import { User } from "../models/user.class";
import { Channel } from "../models/channel.class";

/**
 * Service to manage dialog operations throughout the application.
 */
@Injectable({
  providedIn: 'root',
})
export class DialogsService {

  /**
 * Constructs the DialogsService.
 * @param {MatDialog} dialog - The MatDialog service for opening modal dialogs.
 */
  constructor(
    public dialog: MatDialog
  ) { }

  /**
     * Opens the header menu dialog with specific properties based on the screen width.
     */
  public headerMenuDialog() {
    this.dialog.open(MenuDialogComponent, this.headerMenuProp());
  }

  /**
     * Defines properties for the header menu dialog based on the screen width.
     * @returns {any} - The dialog properties including panel class and position.
     */
  private headerMenuProp(): any {
    let wWidth = window.innerWidth;
    if (wWidth > 1000) return {
      panelClass: ['card-right-corner'],
      position: { top: '90px', right: '20px' },
    }
    else return this.mobileCardBottom()
  }

  /**
    * Opens a dialog to show user details.
    * @param {User} user - The user whose details to display.
    * @param {String | undefined} currentUserID - The ID of the current user.
    */
  public showUserDialog(user: User, currentUserID: String | undefined) {
    const data = { user, currentUserID };
    let isCurrentUser = (user.id === currentUserID);
    this.dialog.open(DialogShowUserComponent, this.showUserProp(data, isCurrentUser));
  }

  /**
    * Defines properties for the show user dialog based on the screen width and whether the user is the current user.
    * @param {any} data - The data to pass to the dialog.
    * @param {boolean} [isCurrentUser=false] - Whether the user is the current user.
    * @returns {any} - The dialog properties including panel class, position, and data.
    */
  private showUserProp(data: any, isCurrentUser?: boolean) {
    let wWidth = window.innerWidth;
    if (wWidth > 1000 && isCurrentUser) return {
      panelClass: ['card-right-corner'],
      position: { top: '90px', right: '20px', },
      data: data,
    }
    if (wWidth > 1000) return {
      panelClass: ['card-round-corners'],
      data: data,
    }
    else return this.mobileCardCenter(data, '580px')
  }

  /**
    * Defines properties for the emoji dialog based on the screen width and position.
    * @param {DialogPosition} [pos] - The position for the dialog.
    * @returns {any} - The dialog properties including panel class, width, and position.
    */
  public emojiProp(pos?: DialogPosition) {
    let wWidth = window.innerWidth;
    let classCorner = pos?.right ? 'card-right-bottom-corner' : 'card-left-bottom-corner';
    if (wWidth > 1000 && pos) return {
      position: pos,
      panelClass: [classCorner],
      width: '350px',
    }
    else return this.mobileCardCenter()
  }

  /**
     * Defines properties for the dialog used to mention a user in a channel based on the screen width and position.
     * @param {string[]} currentMemberIDs - The IDs of current members in the channel.
     * @param {Channel} [channel] - The channel context.
     * @param {DialogPosition} [pos] - The position for the dialog.
     * @returns {any} - The dialog properties including panel class, width, position, and data.
     */
  public atUserProp(currentMemberIDs: string[], channel?: Channel, pos?: DialogPosition) {
    let wWidth = window.innerWidth;
    let data = { currentMemberIDs: currentMemberIDs, channel: channel };
    if (wWidth > 1000 && pos) return {
      position: pos,
      panelClass: ['card-left-bottom-corner'],
      width: '350px',
      data: data,
    }
    else return this.mobileCardBottom(data)
  }

  /**
    * Defines properties for a mobile card dialog positioned at the bottom of the screen.
    * @param {any} [data] - The data to pass to the dialog.
    * @param {string} [minHeight] - The minimum height of the dialog.
    * @returns {any} - The dialog properties including panel class, position, width, and data.
    */
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

  /**
     * Defines properties for a mobile card dialog positioned at the center of the screen.
     * @param {any} [data] - The data to pass to the dialog.
     * @param {string} [width='580px'] - The width of the dialog.
     * @returns {any} - The dialog properties including panel class, width, and data.
     */
  private mobileCardCenter(data?: any, width?: string) {
    return {
      panelClass: ['card-round-corners'],
      width: width,
      maxWidth: '90vw',
      data: data
    }
  }

}