import { Injectable } from "@angular/core";
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
  channels!: Channel[];

  getUserFromMessage(message: ChannelMessage): User {
    const user = this.users.find(user => user.id === message.fromUserID);
    return user ? user : new User;
  }

  getUserFromReply(reply: Reply):User {
    const user = this.users.find(user => user.id === reply.userID);
    return user ? user : new User;
  }

  getUserByName(name: string): User | undefined {
    const user = this.users.find(user => user.name === name);
    if (user) return user;
    else return
  }

  





}