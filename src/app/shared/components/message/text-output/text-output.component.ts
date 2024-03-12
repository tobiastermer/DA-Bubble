import { Component, Input, OnChanges, SimpleChanges, Injectable, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { ChannelMessage } from '../../../models/channel-message.class';
import { Reply } from '../../../models/reply.class';
import { CommonModule } from '@angular/common';
import { DialogInfoComponent } from '../../dialogs/dialog-info/dialog-info.component';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../firebase-services/storage.service';
import { DirectMessage } from '../../../models/direct-message.class';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-text-output',
  standalone: true,
  imports: [
    CommonModule,
    DialogInfoComponent,
    MatIcon
  ],
  templateUrl: './text-output.component.html',
  styleUrl: './text-output.component.scss'
})

@Injectable({
  providedIn: 'root'
})

export class TextOutputComponent implements OnChanges {

  @Input() msg?: ChannelMessage | DirectMessage | Reply;
  @Input() isUserCurrentUser: boolean = false;
  @Input() isEdit: boolean = false;

  @Output() msgChanged = new EventEmitter<string>();

  isFileAttached: boolean = false;
  isFileAImage: boolean = false;

  public message: string = "";
  fileName: string = "";
  fileSrc: string = './.. /../../../../../../assets/img/icons/download_file.png';


  constructor(
    public dialog: MatDialog,
    private storage: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * @param {SimpleChanges} changes - Object containing previous and current property values of the directive's data-bound properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (!this.msg) return
      this.checkMsg();
    }
  }


  /**
   * Checks the message for attachments and sets corresponding values.
   */
  checkMsg() {
    this.isFileAttached = false
    if (this.msg?.attachmentID === '') return
    const files = ['.jpg', '.png', '.pdf'];
    files.forEach(file => {
      if (this.msg?.message.indexOf(file) !== -1) return this.setMsgValues(file)
    });
  }


  /**
   * Sets values based on the attached file.
   * @param {string} file - The file extension.
   */
  setMsgValues(file: any) {
    let msg = this.msg?.message.split(file);
    if (!msg) return
    this.fileName = msg[0] + file;
    this.message = msg[1].replace(/^\n+/, '');
    this.emitValue(this.message);
    this.isFileAttached = true;
    this.setFileImg(file)
  }


  /**
   * Emits the changed message.
   * @param {string} message - The updated message.
   */
  emitValue(message: string) {
    this.msgChanged.emit(message);
  }


  setFileImg(file: string) {
    if (file !== '.pdf' && this.msg?.attachmentID) {
      this.fileSrc = this.msg.attachmentID;
      this.isFileAImage = true;
    }
    else {
      this.fileSrc = './.. /../../../../../../assets/img/icons/download_file.png'
      this.isFileAImage = false;
    }
  }


  /**
   * Downloads a document from the provided URL.
   * @param {string | undefined} url - The URL of the document to download.
   * @param {string} fileName - The name to save the downloaded file as.
   */
  async downloadDocument(url: string | undefined, fileName: string): Promise<void> {
    if (this.isEdit) return
    if (!url) return
    if (!isPlatformBrowser(this.platformId)) return
    await this.storage.downloadFromSorage(url, fileName)
  }

}
