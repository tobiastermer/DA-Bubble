import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ChannelMessage } from "../models/channel-message.class";
import { User } from "../models/user.class";
import { Channel } from "../models/channel.class";
import { Reply } from "../models/reply.class";


@Injectable({
  providedIn: 'root'
})


export class DataService {

  users!: User[];
  currentUser!: User;
  currentUserID!: string; // ggf. löschen
  currentUserUID!: string; // ggf. löschen
  channels!: Channel[];
  public lastEmojis!: string[];

  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private channelsSubject = new BehaviorSubject<Channel[]>([]);
  public channels$ = this.channelsSubject.asObservable();

  private currentUserChannelsSubject = new BehaviorSubject<Channel[]>([]);
  public currentUserChannels$ = this.currentUserChannelsSubject.asObservable();

  getUserFromMessage(message: ChannelMessage): User {
    const user = this.users.find(user => user.id === message.fromUserID);
    return user ? user : new User;
  }

  getUserFromReply(reply: Reply): User {
    const user = this.users.find(user => user.id === reply.userID);
    return user ? user : new User;
  }

  getUserByName(name: string): User | undefined {
    const user = this.users.find(user => user.name === name);
    if (user) return user;
    else return
  }

  setUsers(users: User[]) {
    this.usersSubject.next(users);
  }

  setChannels(channels: Channel[]) {
    this.channelsSubject.next(channels);
    console.log(channels);
    console.log(this.channelsSubject);
  }

  setCurrentUserChannels(channels: Channel[]) {
    this.currentUserChannelsSubject.next(channels);
  }

  public getUserNameById(userID: string): string {
    if (!this.users) return ''
    const user = this.users.find(user => user.id === userID);
    return user ? user.name : '';
  }

  loadLastEmojis(){
  let load = localStorage.getItem('lastEmojis');
  if (load) this.lastEmojis =  load.split(',');
  else this.lastEmojis = ['👍','😀'];
  }

}