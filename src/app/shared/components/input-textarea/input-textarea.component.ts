import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChannelMessage } from '../../models/channel-message.class';
import { DataService } from '../../services/data.service';
import { ChannelMessagesService } from '../../firebase-services/channel-message.service';
import { Channel } from '../../models/channel.class';
import { Reply } from '../../models/reply.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatDialog } from '@angular/material/dialog';
import { PositionService } from '../../../shared/services/position.service';
import { DialogEmojiComponent } from '../dialogs/dialog-emoji/dialog-emoji.component';
import { User } from '../../models/user.class';
import { DialogAtUserComponent } from '../dialogs/dialog-at-user/dialog-at-user.component';
import { DialogShowUserComponent } from '../dialogs/dialog-show-user/dialog-show-user.component';
import { AuthService } from '../../firebase-services/auth.service';
import { DialogInfoComponent } from '../dialogs/dialog-info/dialog-info.component';
import { AddEmojiService } from '../../services/add-emoji.service';


@Component({
  selector: 'app-input-textarea',
  standalone: true,
  imports: [
    MatIconModule,
    PickerComponent,
  ],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.scss',
})
export class InputTextareaComponent {

  @Input() channel!: Channel | undefined;
  @Input() msg!: ChannelMessage;
  @Input() channelMsg: Boolean = false;
  @Input() members: User[] = [];

  @ViewChild('messageText') messageText!: ElementRef;
  @ViewChild('emoijBtn') emoijBtn!: ElementRef;
  @ViewChild('atUser') atUser!: ElementRef;

  isButtonDisabled: boolean = true;
  isEmojiPickerVisible: boolean = false;

  range?: Range;

  currentMemberIDs: string[] = [];
  tempFile: any;



  constructor(
    private data: DataService,
    private messageFBS: ChannelMessagesService,
    private PositionService: PositionService,
    public dialog: MatDialog,
    private authService: AuthService,
    public addEmoji: AddEmojiService
    ) { }


  updateButtonState(textValue: string): void {
    this.isButtonDisabled = !textValue.trim();
  }


  handleEnter(event: Event, textValue: string): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey) return
    event.preventDefault();
    if (textValue.trim()) {
      this.addNewMsg(textValue.trim());
      if (this.messageText) this.messageText.nativeElement.innerText = '';
    }
  }


  addNewMsg(text: string) {
    if (this.channelMsg) this.addNewChannelMsg(text)
    else this.addNewReplyMsg(text)
  }


  async addNewChannelMsg(text: string) {
    let newMsg: ChannelMessage | undefined = await this.fillChannelMsg(text);
    let id: any;
    if (!newMsg) return
    id = await this.messageFBS.addChannelMessage(newMsg);
    if (!id) return
    newMsg.id = id;
    await this.messageFBS.updateChannelMessage(newMsg);
  }


  async fillChannelMsg(text: string) {
    if (!this.data.currentUser.id) return
    if (!this.channel || this.channel.id === '') return
    let msg = new ChannelMessage();
    msg.date = new Date().getTime();
    msg.channelID = this.channel.id;
    msg.fromUserID = this.data.currentUser.id;
    msg.message = text.replace(/^\n+/, '');
    msg.attachmentID = await this.uploadFile();
    return msg
  }


  async addNewReplyMsg(text: string) {
    let newReply: Reply | undefined = await this.fillReplyMsg(text)
    if (!newReply || !this.msg) return
    this.msg.replies.push(newReply);
    await this.messageFBS.updateChannelMessage(this.msg);
  }


  async fillReplyMsg(text: string) {
    if (!this.data.currentUser.id) return
    if (!this.channel || this.channel.id === '') return
    let reply = new Reply();
    reply.date = new Date().getTime();
    reply.channelID = this.channel.id;
    reply.userID = this.data.currentUser.id;
    reply.message = text;
    reply.attachmentID = await this.uploadFile();
    return reply
  }

  // @-Part

  openDialogAtUser(): void {
    let pos = this.PositionService.getDialogPosWithCorner(this.atUser, 'bottom');
    this.currentMemberIDs = this.members.map(user => user.id!);
    const dialogRef = this.dialog.open(DialogAtUserComponent, {
      position: pos, panelClass: ['card-round-corners'], width: '350px',
      data: { allUsers: this.data.users, currentMemberIDs: this.currentMemberIDs, channel: this.channel },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.addUserToMessageText(result);
    });
  }

  addUserToMessageText(users: User[]) {
    if (!this.messageText) return;
    this.appendChildForAllUsers(users)
    if (!this.range) return
    this.addEmoji.setCurserToEndPos(this.range);
  }

  appendChildForAllUsers(users: User[]) {
    users.forEach((user, index) => {
      let span = document.createElement('span');
      span.contentEditable = 'false';
      span.innerText = '@' + user.name;
      span.style.color = 'blue';
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => this.openShowUserDialog(user));
      this.messageText.nativeElement.appendChild(span)
      this.messageText.nativeElement.appendChild(document.createTextNode(' '))
    });
  }

  openShowUserDialog(user: User) {
    this.dialog.open(DialogShowUserComponent, {
      panelClass: ['card-round-corners'],
      data: { user: user },
    });
  }

  // Emoji part

  openDialogEmoji(): void {
    const selection = window.getSelection();
    if (selection) this.range = selection.getRangeAt(0);
    let pos = this.PositionService.getDialogPosEmojy(this.emoijBtn);
    let classCorner = pos?.right ? 'card-right-bottom-corner' : 'card-left-bottom-corner';
    const dialogRef = this.dialog.open(DialogEmojiComponent, {
      position: pos, panelClass: [classCorner],
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.addEmoji.addEmoji(this.range, result, this.messageText )
    });
  }



  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const supportedFileTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!file) return;
    if ((file.size / 1024 / 1024) > 1) {
      return this.openDialogInfo('Ihre Datei ist zu groß. Maximale Größe beträgt 1.5MB.');
    }
    if (!supportedFileTypes.includes(file.type)) {
      return this.openDialogInfo('Nur .jpg / .png oder .pdf Dateiformate werden unterstützt.');
    }
    this.tempFile = file;
    this.addFileToMessageText(file);
  }


  openDialogInfo(info: String): void {
    this.dialog.open(DialogInfoComponent, {
      panelClass: ['card-round-corners'],
      data: { info },
    });
  }


  addFileToMessageText(file: File) {
    if (!this.messageText) return;
    this.appendChildForFile(file);
    if (!this.range) return
    this.addEmoji.setCurserToEndPos(this.range);
  }


  appendChildForFile(file: File) {
    let div = document.createElement('div');
    div.contentEditable = 'false';
    div.classList.add('file-overview');
    div.appendChild(this.getImgByFileType(file));
    div.appendChild(this.getSpanByFileName(file));
    this.messageText.nativeElement.insertBefore(div, this.messageText.nativeElement.firstChild);
    this.messageText.nativeElement.appendChild(document.createElement('br'));
  }


  getImgByFileType(file: File): Element {
    let img = document.createElement('img');
    img.src = 'assets/img/icons/upload_file.png';
    img.alt = file.type;
    return img
  }


  getSpanByFileName(file: File): Element {
    let span = document.createElement('span');
    span.innerText = file.name;
    return span
  }


  async uploadFile() {
    if (!this.tempFile) return ''
    let retUrl = '';
    await this.authService.uploadMsgData(this.tempFile).then((url) => {
      retUrl = url;
    }).catch((error) => {
      console.error("Fehler beim Hochladen des Bildes: ", error);
      this.openDialogInfo("Fehler beim Hochladen des Bildes.");
    });
    return retUrl
  }

}
