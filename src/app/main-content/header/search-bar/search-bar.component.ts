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
    private DataService: DataService,
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

  selectListVisible: boolean = false;
  pathUserName: string = '';
  showChannels: boolean = false;

  ngAfterViewInit() {
    // Initialisieren Sie die Users-Subscription
    this.usersSubscription = this.usersSubscriptionReturn();
    this.channelsSubscription = this.channelSubscriptionReturn();
    this.channelMessagesSubscription = this.channelMessageSubscriptionReturn();
  }

  usersSubscriptionReturn() {
    return this.DataService.users$.subscribe((users) => {
      this.users = users;
      this.cdr.detectChanges(); // Füge dies hinzu, um die Change Detection manuell auszulösen
    });
  }

  channelSubscriptionReturn() {
    return this.DataService.currentUserChannels$.subscribe((channels) => {
      this.channels = channels;
      this.cdr.detectChanges(); // Füge dies hinzu, um die Change Detection manuell auszulösen
    });
  }

  channelMessageSubscriptionReturn() {
    return this.ChannelMessagesService.allChannelMessages$.subscribe((message) => {
      this.messages = message;
      this.cdr.detectChanges(); // Füge dies hinzu, um die Change Detection manuell auszulösen
    });
  }

  closeList() {
    this.searchInput.nativeElement.value = '';
    this.selectListVisible = false;
  }

  changeUserPath(user: any) {
    let name = user.name.replace(/\s/g, '_');
    this.router.navigate([this.pathUserName + '/message/' + name]);
    this.closeList();
  }

  changeChannelPath(channel: any) {
    let channelName = channel.name;
    this.router.navigate([this.pathUserName + '/channel/' + channelName]);
    this.closeList();
  }

  filter() {
    const search = this.searchInput.nativeElement.value.toLowerCase();
    this.filterUsers(search);
    this.filterChannels(search);
    this.filterMessages(search);
    this.showChannel();
  }

  showChannel() {
    if (this.filteredChannels.length > 0) {
      this.showChannels = true;
    } else {
      this.showChannels = false;
    }
  }

  filterUsers(inputID: any) {
    this.filteredUsers = this.users.filter(
      (user) => user.name && user.name.toLowerCase().includes(inputID)
    );
    this.selectListVisible = !!inputID && this.filteredUsers.length > 0;
  }

  filterChannels(inputID: any) {
    this.filteredChannels = this.channels.filter(
      (channel) => channel.name && channel.name.toLowerCase().includes(inputID)
    );
    this.selectListVisible =
      (!!inputID && this.filteredUsers.length > 0) ||
      (!!inputID && this.filteredChannels.length > 0);
  }

  filterMessages(inputID: any) {
    this.filteredMessages = this.messages.filter(
      (messages) => messages.message && messages.message.toLowerCase().includes(inputID),
    );
    console.log('messages',this.filteredMessages);
    this.selectListVisible =
      (!!inputID && this.filteredUsers.length > 0) ||
      (!!inputID && this.filteredChannels.length > 0) ||
      (!!inputID && this.filteredMessages.length > 0);
  }

  ngOnDestroy() {
    // Vergessen Sie nicht, die Subscription aufzuräumen, wenn die Komponente zerstört wird
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
      this.channelsSubscription.unsubscribe();
    }
  }
}
