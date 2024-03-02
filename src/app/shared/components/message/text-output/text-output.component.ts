import { Component, Input, OnChanges, SimpleChanges, Injectable, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { ChannelMessage } from '../../../models/channel-message.class';
import { Reply } from '../../../models/reply.class';
import { CommonModule } from '@angular/common';
import { DialogInfoComponent } from '../../dialogs/dialog-info/dialog-info.component';
import { MatDialog } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../firebase-services/storage.service';

@Component({
  selector: 'app-text-output',
  standalone: true,
  imports: [
    CommonModule,
    DialogInfoComponent
  ],
  templateUrl: './text-output.component.html',
  styleUrl: './text-output.component.scss'
})

@Injectable({
  providedIn: 'root'
})

export class TextOutputComponent implements OnChanges {

  @Input() msg?: ChannelMessage | Reply;
  @Input() isUserCurrentUser: boolean = false;
  @Input() isEdit: boolean = false;

  @Output() msgChanged = new EventEmitter<string>();

  isFileAttached: boolean = false;

  public message: string = "";
  fileName: string = "";


  constructor(
    public dialog: MatDialog,
    private storage: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (!this.msg) return
      this.checkMsg();
    }
  }


  checkMsg() {
    this.isFileAttached = false
    if (this.msg?.attachmentID === '') return
    const files = ['.jpg', '.png', '.pdf'];
    files.forEach(file => {
      if (this.msg?.message.indexOf(file) !== -1) {
        let msg = this.msg?.message.split(file);
        if (!msg) return
        this.fileName = msg[0] + file;
        this.message = msg[1].replace(/^\n+/, '');
        this.emitValue(this.message);
        this.isFileAttached = true;
        return
      }
    });
  }


  emitValue(message: string) {
    this.msgChanged.emit(message);
  }


  async downloadDocument(url: string | undefined, fileName: string): Promise<void> {
    if (this.isEdit) return
    if (!url) return
    if (!isPlatformBrowser(this.platformId)) return
    await this.storage.downloadFromSorage(url, fileName)
  }

}
