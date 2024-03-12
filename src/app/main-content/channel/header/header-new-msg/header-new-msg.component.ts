import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
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
export class HeaderNewMsgComponent implements OnDestroy {
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


  /**
   * Initializes the component by subscribing to changes in users and current user channels.
   * Updates the local users and channels arrays accordingly and marks for check to trigger change detection.
   * @returns {void}
   */
  ngOnInit(): void {
    this.dataService.users$.subscribe((users) => {
      this.users = users;
      this.cdr.markForCheck(); // Verwenden Sie markForCheck für OnPush-Strategie
    });

    this.dataService.currentUserChannels$.subscribe((channels) => {
      this.channels = channels;
      this.cdr.markForCheck(); // Verwenden Sie markForCheck für OnPush-Strategie
    });
  }


  /**
   * Filters users or channels based on the search input value.
   * Resets filters if the search input doesn't start with '@' or '#'.
   * @returns {void}
   */
  filter(): void {
    const search = this.searchInput.nativeElement.value.toLowerCase();
    if (search.startsWith('@')) this.filterUsers(search.slice(1));
    else if (search.startsWith('#')) this.filterChannels(search.slice(1));
    else this.resetFilters();
  }


  /**
   * Filters users based on the provided search term.
   * Updates filteredUsers array and visibility.
   * @param {string} searchTerm - The search term used to filter users.
   * @returns {void}
   */
  filterUsers(searchTerm: string): void {
    this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(searchTerm));
    this.filteredChannels = [];
    this.updateVisibility();
  }


  /**
   * Filters channels based on the provided search term.
   * Updates filteredChannels array and visibility.
   * @param {string} searchTerm - The search term used to filter channels.
   * @returns {void}
   */
  filterChannels(searchTerm: string): void {
    this.filteredChannels = this.channels.filter(channel => channel.name.toLowerCase().includes(searchTerm));
    this.filteredUsers = [];
    this.updateVisibility();
  }


  /**
   * Updates visibility based on the filtered users and channels.
   * @returns {void}
   */
  updateVisibility(): void {
    this.selectListVisible = this.filteredUsers.length > 0 || this.filteredChannels.length > 0;
    this.showChannels = this.filteredChannels.length > 0;
  }


  /**
   * Resets all filters and sets visibility to false.
   * @returns {void}
   */
  resetFilters(): void {
    this.filteredUsers = [];
    this.filteredChannels = [];
    this.selectListVisible = false;
    this.showChannels = false;
  }


  /**
   * Changes the route path based on the selected user.
   * Navigates to the corresponding user message route and closes the list.
   * @param {User} user - The selected user.
   * @returns {void}
   */
  changeUserPath(user: User): void {
    const name = user.name.replace(/\s/g, '_');
    this.router.navigate([`${this.activeRouter.snapshot.params['idUser']}/message/${name}`]);
    this.closeList();
  }


  /**
   * Changes the route path based on the selected channel.
   * Navigates to the corresponding channel route and closes the list.
   * @param {Channel} channel - The selected channel.
   * @returns {void}
   */
  changeChannelPath(channel: Channel): void {
    const channelName = channel.name;
    this.router.navigate([`${this.activeRouter.snapshot.params['idUser']}/channel/${channelName}`]);
    this.closeList();
  }



  /**
   * Closes the list by resetting search input value and filters.
   * @returns {void}
   */
  closeList(): void {
    this.searchInput.nativeElement.value = '';
    this.resetFilters();
  }


  /**
   * Lifecycle hook that is called when the component is destroyed.
   * It is used to unsubscribe from any subscriptions to prevent memory leaks.
   * @returns {void}
   */
  ngOnDestroy(): void {
  }
}
