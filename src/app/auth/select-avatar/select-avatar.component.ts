import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss',
})
export class SelectAvatarComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  avatars = ['1.svg', '2.svg', '3.svg', '4.svg', '5.svg'];
  currentAvatar = './assets/img/empty-profile.png';
  animationClass = '';
  showError = false;
  errorMessage = '';
  formIsValid = false;
  avatarError = false;
  accountSuccess = false;

  selectAvatar(avatar: string) {
    this.fadeOut();
    setTimeout(() => {
      this.currentAvatar = `./assets/img/avatars/${avatar}`;
      this.fadeIn();
    }, 500);
    this.formIsValid = true;
    this.showError = false;
    this.avatarError = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    const fileSizeMB = file.size / 1536 / 1536; 
    const isSupportedFileType = file.type === 'image/jpeg' || file.type === 'image/png';
  
    if (fileSizeMB > 1.5) {
      this.setFormError('Ihr Bild ist zu groß. Maximale Größe beträgt 1MB.');
      return;
    }
  
    if (!isSupportedFileType) {
      this.setFormError('Nur .jpg und .png Dateiformate werden unterstützt.');
      return;
    }
  
    this.loadImage(file);
  }
  
  private setFormError(errorMessage: string) {
    this.showError = true;
    this.errorMessage = errorMessage;
    this.formIsValid = false;
  }
  
  private loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.currentAvatar = e.target.result;
      this.animationClass = 'fade-in';
      this.formIsValid = true;
      this.showError = false;
      this.avatarError = false;
    };
    reader.readAsDataURL(file);
  }

  fadeIn() {
    this.animationClass = 'fade-in';
    setTimeout(() => (this.animationClass = ''), 500);
  }

  fadeOut() {
    this.animationClass = 'fade-out';
    setTimeout(() => (this.animationClass = ''), 500);
  }

  closeError() {
    this.showError = false;
  }

  registerAccount() {
    if (this.formIsValid) {
      console.log('Konto erfolgreich erstellt');
      this.accountSuccess = true;
    } else {
      this.avatarError = true;
    }
  }
}
