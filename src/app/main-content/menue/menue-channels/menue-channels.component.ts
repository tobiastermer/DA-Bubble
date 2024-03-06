import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Channel } from '../../../shared/models/channel.class';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogAddChannelComponent } from './dialogs/dialog-add-channel/dialog-add-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../shared/services/data.service';
import { Subscription } from 'rxjs';
import { PositionService } from '../../../shared/services/position.service';

@Component({
  selector: 'app-menue-channels',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './menue-channels.component.html',
  styleUrls: ['./menue-channels.component.scss'] // Achtung: Korrektur von styleUrl zu styleUrls
})
export class MenueChannelsComponent implements OnInit, OnDestroy {
  @Input() pathUserName: string = '';

  @Output() channelSelected = new EventEmitter<number>();

  pathChat: string = '';
  pathContentName: string = '';
  channels: Channel[] = [];
  channelsVisible: boolean = true;

  private channelSubscription: Subscription = new Subscription();

  constructor(private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private dataService: DataService,
    private positionService: PositionService) {
    this.activeRoute.params.subscribe(params => {
      this.pathChat = params['chat'];
      this.pathContentName = params['idChat'];
    })
  }

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
    this.positionService.setActiveResponsiveWindow('channel');
    let name = this.channels[activeChannelIndex].name
    this.router.navigate([this.pathUserName + '/channel/' + name]);
  }

  isActiveChannel(i: number): boolean {
    return this.pathChat == "channel" && this.pathContentName == this.channels[i].name;
  }

  openDialogAddChannel() {
    this.dialog.open(DialogAddChannelComponent, {
      panelClass: ['card-round-corners'],
      data: { allChannel: this.channels, pathUserName: this.pathUserName },
    });
  }
}
