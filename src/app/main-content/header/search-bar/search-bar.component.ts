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

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatInputModule, MatIconModule,CommonModule,UserChipComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements AfterViewInit, OnDestroy {
  private usersSubscription!: Subscription;

  constructor(
    public dialog: MatDialog,
    private DataService: DataService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activeRouter: ActivatedRoute,
  ) {
    this.activeRouter.params.subscribe(params => {
      this.pathUserName = params['idUser']
    })
  }

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchBarContainer') searchBarContainer?: ElementRef;

  users: User[] = [];
  filteredUsers: User[] = [];
  selectListVisible: boolean = false;
  pathUserName: string = '';

  ngAfterViewInit() {
    // Initialisieren Sie die Users-Subscription
    this.usersSubscription = this.DataService.users$.subscribe((users) => {
      console.log('search-bar users', users)
      this.users = users;
      this.cdr.detectChanges(); // Füge dies hinzu, um die Change Detection manuell auszulösen
    });
  }

  closeList(){
    this.searchInput.nativeElement.value = '';
    this.selectListVisible = false;
  }

  changePath(user:any) {
    let name = user.name.replace(/\s/g, '_');
    this.router.navigate([this.pathUserName + '/message/' + name]);
    this.closeList()
  }

  filter() {
    const search = this.searchInput.nativeElement.value.toLowerCase();
    this.filteredUsers = this.users.filter(
      (user) => user.name && user.name.toLowerCase().includes(search)
    );
    this.selectListVisible = !!search && this.filteredUsers.length > 0;
  }

  ngOnDestroy() {
    // Vergessen Sie nicht, die Subscription aufzuräumen, wenn die Komponente zerstört wird
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}
