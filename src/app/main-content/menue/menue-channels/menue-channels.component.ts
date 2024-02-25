import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Channel } from '../../../shared/models/channel.class';
import { Router } from '@angular/router';
import { DialogAddChannelComponent } from './dialogs/dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../shared/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menue-channels',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './menue-channels.component.html',
  styleUrls: ['./menue-channels.component.scss'] // Achtung: Korrektur von styleUrl zu styleUrls
})
export class MenueChannelsComponent implements OnInit, OnDestroy {
  @Input() channelActive: number | undefined;
  @Input() pathUserName: string = '';

  @Output() channelSelected = new EventEmitter<number>();

  private channelSubscription: Subscription = new Subscription();
  channels: Channel[] = [];

  channelsVisible: boolean = true;

  constructor(private router: Router,
    public dialog: MatDialog,
    private dataService: DataService) { }

  ngOnInit() {
    this.channelSubscription.add(
      this.dataService.currentUserChannels$.subscribe(channels => {
        this.channels = channels;
      })
    );
  }

  ngOnDestroy() {
    this.channelSubscription.unsubscribe();
  }

  toggleChannelsVisibility() {
    this.channelsVisible = !this.channelsVisible;
  }

  changePath(activeChannelIndex: number) {
    this.channelSelected.emit(activeChannelIndex);
    let name = this.channels[activeChannelIndex].name
    this.router.navigate([this.pathUserName + '/channel/' + name]);
  }

  isActiveChannel(i: number): boolean {
    return this.channelActive === i;
  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent, {
      panelClass: ['card-round-corners'],
      data: { allChannel: this.channels, pathUserName: this.pathUserName },
    });
  }
}
