import { Injectable } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';
import { getStorage, getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { DialogInfoComponent } from '../components/dialogs/dialog-info/dialog-info.component';

/**
 * Provides utility functions for uploading, deleting, and downloading files from Firebase Storage.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage,
    public dialog: MatDialog,
  ) { }

  /**
    * Uploads a file to Firebase Storage under the 'message_data' directory.
    * @param {File} file - The file to upload.
    * @returns {Promise<string>} - A promise that resolves with the download URL of the uploaded file.
    */
  async uploadMsgData(file: File): Promise<string> {
    const storageRef = ref(this.storage, `message_data/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  /**
   * Deletes a file from Firebase Storage.
   * @param {string} url - The storage URL of the file to delete.
   */
  async deleteDoc(url: string) {
    const desertRef = ref(this.storage, url);
    await deleteObject(desertRef).then(() => {
    }).catch((error) => {
      console.error('An error occurred!: ' + error)
    });
  }

  /**
   * Initiates a download of a file from Firebase Storage.
   * @param {string} url - The storage URL of the file to download.
   * @param {string} fileName - The name of the file to save as.
   */
  async downloadFromSorage(url: string, fileName: string) {
    const starsRef = ref(this.storage, url);

    // Get the download URL
    getDownloadURL(starsRef)
      .then((url) => {
        this.downloadData(url, fileName)
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            return this.openDialogInfo("File doesn't exist");
          case 'storage/unauthorized':
            return this.openDialogInfo("User doesn't have permission to access the object");
          case 'storage/canceled':
            return this.openDialogInfo("User canceled the upload");
          case 'storage/unknown':
            return this.openDialogInfo("Unknown error occurred, inspect the server response");
        }
        console.error('Fehler beim Herunterladen des Dokuments:', error);
        return this.openDialogInfo('Fehler beim Herunterladen des Dokuments');
      });
  }

  /**
    * Downloads data from a given URL and saves it as a file.
    * @param {string} url - The URL to download the data from.
    * @param {string} fileName - The name of the file to save the data as.
    */
  async downloadData(url: string, fileName: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) this.openDialogInfo('Netzwerkantwort war nicht erfolgreich');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      this.openDialogInfo('Fehler beim Herunterladen des Dokuments');
      console.error('Fehler beim Herunterladen des Dokuments:', error);
    }
  }

  /**
     * Opens a dialog with information for the user.
     * @param {String} info - The information to display in the dialog.
     */
  openDialogInfo(info: String): void {
    this.dialog.open(DialogInfoComponent, {
      panelClass: ['card-round-corners'],
      data: { info },
    });
  }
}
