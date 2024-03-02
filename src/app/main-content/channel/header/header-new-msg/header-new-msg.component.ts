import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../../../shared/models/user.class';
import { Channel } from '../../../../shared/models/channel.class';
import { Subscription } from 'rxjs';
import { DataService } from '../../../../shared/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserChipComponent } from '../../../../shared/components/user-chip/user-chip.component';

@Component({
  selector: 'app-header-new-msg',
  standalone: true,
  imports: [CommonModule, UserChipComponent],
  templateUrl: './header-new-msg.component.html',
  styleUrls: ['./header-new-msg.component.scss']
})
export class HeaderNewMsgComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  channels: Channel[] = [];
  filteredChannels: Channel[] = [];
  selectListVisible: boolean = false;
  showChannels: boolean = false;
  pathUserName: string = '';

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRouter: ActivatedRoute,
  ) {
    this.activeRouter.params.subscribe(params => {
      this.pathUserName = params['idUser'];
    });
  }

  ngOnInit() {
    this.dataService.users$.subscribe((users) => {
      this.users = users;
      this.cdr.markForCheck(); // Verwenden Sie markForCheck für OnPush-Strategie
    });

    this.dataService.currentUserChannels$.subscribe((channels) => {
      this.channels = channels;
      this.cdr.markForCheck(); // Verwenden Sie markForCheck für OnPush-Strategie
    });
  }

  filter() {
    const search = this.searchInput.nativeElement.value.toLowerCase();
    if (search.startsWith('@')) {
      this.filterUsers(search.slice(1));
    } else if (search.startsWith('#')) {
      this.filterChannels(search.slice(1));
    } else {
      this.resetFilters();
    }
  }

  filterUsers(searchTerm: string) {
    this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(searchTerm));
    this.filteredChannels = [];
    this.updateVisibility();
  }

  filterChannels(searchTerm: string) {
    this.filteredChannels = this.channels.filter(channel => channel.name.toLowerCase().includes(searchTerm));
    this.filteredUsers = [];
    this.updateVisibility();
  }

  updateVisibility() {
    this.selectListVisible = this.filteredUsers.length > 0 || this.filteredChannels.length > 0;
    this.showChannels = this.filteredChannels.length > 0;
  }

  resetFilters() {
    this.filteredUsers = [];
    this.filteredChannels = [];
    this.selectListVisible = false;
    this.showChannels = false;
  }

  changeUserPath(user: User) {
    const name = user.name.replace(/\s/g, '_');
    this.router.navigate([`${this.activeRouter.snapshot.params['idUser']}/message/${name}`]);
    this.closeList();
  }

  changeChannelPath(channel: Channel) {
    const channelName = channel.name;
    this.router.navigate([`${this.activeRouter.snapshot.params['idUser']}/channel/${channelName}`]);
    this.closeList();
  }

  closeList() {
    this.searchInput.nativeElement.value = '';
    this.resetFilters();
  }

  ngOnDestroy() {
    // Cleanup, falls Subscriptions verwendet werden
  }
}
