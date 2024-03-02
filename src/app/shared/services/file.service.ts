import { ElementRef, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogInfoComponent } from '../components/dialogs/dialog-info/dialog-info.component';
import { StorageService } from '../firebase-services/storage.service';
import { File } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  element!: ElementRef;

  constructor(
    public dialog: MatDialog,
    private storage: StorageService,
  ) { }


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
    // this.tempFile = file;
    this.addFileToMessageText(file);
    return file
  }


  openDialogInfo(info: String): void {
    this.dialog.open(DialogInfoComponent, {
      panelClass: ['card-round-corners'],
      data: { info },
    });
  }


  addFileToMessageText(file: File) {
    if (!this.element) return;
    this.appendChildForFile(file);
    // if (!this.range) return
    // this.addEmoji.setCurserToEndPos(this.range);
  }


  appendChildForFile(file: any) {
    let div = document.createElement('div');
    div.contentEditable = 'false';
    div.classList.add('file-overview');
    div.appendChild(this.getImgByFileType(file));
    div.appendChild(this.getSpanByFileName(file));
    div.id = 'uploadFile';
    this.element.nativeElement.insertBefore(div, this.element.nativeElement.firstChild);
    this.element.nativeElement.appendChild(document.createElement('br'));
  }


  getImgByFileType(file: File): Element {
    let img = document.createElement('img');
    img.src = 'assets/img/icons/upload_file.png';
    img.alt = file.type;
    return img
  }


  getSpanByFileName(file: globalThis.File): Element {
    let span = document.createElement('span');
    span.innerText = file.name;
    return span
  }


  async uploadFile(file: globalThis.File) {
    if (!this.element) return ''
    let retUrl = '';
    await this.storage.uploadMsgData(file).then((url) => {
      retUrl = url;
    }).catch((error) => {
      console.error("Fehler beim Hochladen des Bildes: ", error);
      this.openDialogInfo("Fehler beim Hochladen des Bildes.");
    });
    return retUrl
  }
}
