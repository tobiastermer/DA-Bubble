import { Injectable } from "@angular/core";
import { DialogPosition, MatDialog } from "@angular/material/dialog";
import { Channel } from "../../../shared/models/channel.class";
import { User } from "../../../shared/models/user.class";
import { DialogChannelComponent } from "./dialog-channel/dialog-channel.component";

@Injectable({
    providedIn: 'root',
})
export class ChannelDialogService {

    constructor(
        private dialog: MatDialog
    ) { }


    public showChannelDialog(channel: Channel, allUsers: User[], members?: User[], pos?: DialogPosition) {
        const data = { channel, allUsers, members };
        this.dialog.open(DialogChannelComponent, this.showChannelProp(data, pos));
    }


    private showChannelProp(data: any, pos?: DialogPosition) {
        let wWidth = window.innerWidth;
        if (wWidth > 1000 && !pos) return {
            width: '750px',
            panelClass: ['card-round-corners'],
            data: data,
        }
        if (wWidth > 1000 && pos) return {
            width: '750px',
            position: pos, 
            panelClass: ['card-left-corner'],
            data: data,
        }
        else return this.mobileCardFullscreen(data)
    }


    private mobileCardFullscreen(data: any) {
        return {
            panelClass: ['mobile-card-fullscreen'],
            width: '100%',
            maxWidth: '100%',
            data: data
        }
    }


}