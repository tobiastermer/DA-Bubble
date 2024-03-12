import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../shared/models/user.class';
import { Subscription } from 'rxjs';
import { DataService } from '../../../shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { UserChipComponent } from '../../../shared/components/user-chip/user-chip.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Channel } from '../../../shared/models/channel.class';
import { ChannelMessagesService } from '../../../shared/firebase-services/channel-message.service';
import { ChannelMessage } from '../../../shared/models/channel-message.class';

/**
 * Komponente zur Darstellung einer Suchleiste, die es ermöglicht, nach Benutzern, Kanälen und Nachrichten zu suchen.
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatInputModule, MatIconModule, CommonModule, UserChipComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
  private usersSubscription!: Subscription;
  private channelsSubscription!: Subscription;
  private channelMessagesSubscription!: Subscription;

  constructor(
    public dialog: MatDialog,
    public DataService: DataService,
    private ChannelMessagesService: ChannelMessagesService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    ChannelMessagesService.getAllChannelMessages();
    this.activeRouter.params.subscribe((params) => {
      this.pathUserName = params['idUser'];
    });
  }

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchBarContainer') searchBarContainer?: ElementRef;

  users: User[] = [];
  filteredUsers: User[] = [];
  channels!: Channel[];
  messages!: ChannelMessage[];
  filteredChannels!: Channel[];
  filteredMessages!: ChannelMessage[];

  nameFromChannel: string = '';
  userFromMessage: string = '';

  selectListVisible: boolean = false;
  pathUserName: string = '';
  showChannels: boolean = false;
  showMessages: boolean = false;

  /**
 * Initialisiert die Komponente nachdem die Ansicht initialisiert wurde.
 */
  ngAfterViewInit() {
    this.usersSubscription = this.usersSubscriptionReturn();
    this.channelsSubscription = this.channelSubscriptionReturn();
    this.channelMessagesSubscription = this.channelMessageSubscriptionReturn();
  }

  /**
   * Abonniert Benutzerdaten vom DataService.
   */
  usersSubscriptionReturn() {
    return this.DataService.users$.subscribe((users) => {
      this.users = users;
      this.cdr.detectChanges(); // Füge dies hinzu, um die Change Detection manuell auszulösen
    });
  }

  /**
  * Abonniert Kanaldaten vom DataService.
  */
  channelSubscriptionReturn() {
    return this.DataService.currentUserChannels$.subscribe((channels) => {
      this.channels = channels;
      this.cdr.detectChanges(); // Füge dies hinzu, um die Change Detection manuell auszulösen
    });
  }

  /**
  * Abonniert Nachrichtendaten vom ChannelMessagesService und filtert diese basierend auf den Kanal-IDs.
  */
  channelMessageSubscriptionReturn() {
    return this.ChannelMessagesService.allChannelMessages$.subscribe(
      (message) => {
        // this.messages = message;
        // Filtern der Nachrichten basierend auf den Kanal-IDs, zu denen der Benutzer gehört
        this.messages = message.filter(message =>
          this.channels.some(channel => channel.id === message.channelID)
        );
        this.cdr.detectChanges(); // Füge dies hinzu, um die Change Detection manuell auszulösen
      }
    );
  }

  /**
   * Schließt die Liste der Suchergebnisse.
   */
  closeList() {
    this.searchInput.nativeElement.value = '';
    this.selectListVisible = false;
  }

  /**
   * Ändert den Pfad zur Benutzerseite.
   */
  changeUserPath(user: any) {
    let name = user.name.replace(/\s/g, '_');
    this.router.navigate([this.pathUserName + '/message/' + name]);
    this.closeList();
  }

  /**
  * Ändert den Pfad zur Kanalseite.
  */
  changeChannelPath(channel: any) {
    let channelName = channel.name;
    this.router.navigate([this.pathUserName + '/channel/' + channelName]);
    this.closeList();
  }

  /**
  * Ändert den Pfad zur Kanalseite anhand der Kanal-ID.
  */
  changeChannelPathByID(channelID: any) {
    let channelName = this.DataService.getChannelNameById(channelID);
    this.router.navigate([this.pathUserName + '/channel/' + channelName]);
    this.closeList();
  }

  /**
  * Filtert Benutzer, Kanäle und Nachrichten basierend auf dem Suchbegriff.
  */
  filter() {
    const search = this.searchInput.nativeElement.value.toLowerCase();
    this.filterUsers(search);
    this.filterChannels(search);
    this.filterMessages(search);
    this.showChannel();
    this.showMessage();
  }

  /**
 * Zeigt Kanäle basierend auf dem Filterergebnis an.
 */
  showChannel() {
    if (this.filteredChannels.length > 0) {
      this.showChannels = true;
    } else {
      this.showChannels = false;
    }
  }

  /**
   * Zeigt Nachrichten basierend auf dem Filterergebnis an.
   */
  showMessage() {
    if (this.filterMessages.length > 0) {
      this.showMessages = true;
    } else {
      this.showMessages = false;
    }
  }

  /**
   * Filtert Benutzer basierend auf dem Suchbegriff.
   */
  filterUsers(inputID: any) {
    this.filteredUsers = this.users.filter(
      (user) => user.name && user.name.toLowerCase().includes(inputID)
    );
    this.selectListVisible = !!inputID && this.filteredUsers.length > 0;
  }

  /**
  * Filtert Kanäle basierend auf dem Suchbegriff.
  */
  filterChannels(inputID: any) {
    this.filteredChannels = this.channels.filter(
      (channel) => channel.name && channel.name.toLowerCase().includes(inputID)
    );
    this.selectListVisible =
      (!!inputID && this.filteredUsers.length > 0) ||
      (!!inputID && this.filteredChannels.length > 0);
  }

  /**
   * Filtert Nachrichten basierend auf dem Suchbegriff.
   */
  filterMessages(inputID: any) {
    this.filteredMessages = this.messages.filter(
      (messages) =>
        messages.message && messages.message.toLowerCase().includes(inputID)
    );
    console.log('messages', this.filteredMessages);
    this.selectListVisible =
      (!!inputID && this.filteredUsers.length > 0) ||
      (!!inputID && this.filteredChannels.length > 0) ||
      (!!inputID && this.filteredMessages.length > 0);
  }

  /**
   * Bereinigt Abonnements beim Zerstören der Komponente.
   */
  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
      this.channelsSubscription.unsubscribe();
      this.channelMessagesSubscription.unsubscribe();
    }
  }

  /**
  * Konvertiert einen Zeitstempel in ein lesbares Datum.
  */
  getDateOfTimestemp(time: number | undefined): string {
    if (!time) return '';
    else {
      let date = new Date(time);
      let months = [
        'Jan.',
        'Feb.',
        'Mär.',
        'Apr.',
        'Mai',
        'Jun.',
        'Jul.',
        'Aug.',
        'Sep.',
        'Okt.',
        'Nov.',
        'Dec.',
      ];
      let day = date.getDay();
      let month = months[date.getMonth()];
      let year = date.getFullYear();
      return day + ' ' + month + ' ' + year;
    }
  }

  /**
 * Konvertiert einen Zeitstempel in eine Uhrzeit.
 */
  setTime(timestemp: number): string {
    let date = new Date(timestemp);
    return date.getHours() + ':' + date.getMinutes()
  }

  /**
 * Behandelt Bildladefehler, indem ein Standard-Avatarbild gesetzt wird.
 */
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = './../../assets/img/avatars/unknown.jpg';
  }
}
