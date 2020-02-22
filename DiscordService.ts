import {Service} from "./Service";
import {Message} from "./Message";
import {User} from "./User";
import { InputStackEntry} from './InputStackEntry'
import { ConsoleInputHandler} from './ConsoleInputHandler';

const Discord = require('discord.js')

/** Provides access to and from discord through the official API */
export class DiscordService implements Service {
    
    msgs: Message[] = [];
    username: string;
    BOT_TOKEN: string = ""
    client = new Discord.Client()
    
    constructor(handler: ConsoleInputHandler) {
        
        this.client.on('message', msg => {
           this.receiveMessage(msg.cleanContent, msg.channel.id,msg.member.id);
        })
    }

    /** Handles messages being received */
    receiveMessage(input: string, channel_id: string, user_id: string): void {
        if (user_id !== this.getUser().id){
            let msg = new Message(
                input,
                this.getUser(),
                new User(channel_id,this),
            );
            this.msgs.push(msg);
        }
    }   

    /** Gets the bot as a user */
    getUser(): User {
        return new User(this.client.user.id, this);
    }

    /** 
     * Sends a message to the given chatroom 
     * @TODO: Split functionality to allow user messages
    */
    sendMessage(msg: Message): void {
        let channel = this.client.channels.get(msg.destination.id)
        channel.send(msg.messageData);
    }

    /**
     * Handles the login process for discord
     */
    login(): InputStackEntry {
        var fs = require('fs');
        if (fs.existsSync("discordToken.txt")) {
            console.log('\x1b[36m%s\x1b[0m', "\nReading token from file");
            this.BOT_TOKEN = fs.readFileSync("discordToken.txt", "utf8");
            this.BOT_TOKEN = this.BOT_TOKEN.replace(/(\r\n|\n|\r)/gm, "");
            console.log('\x1b[36m%s\x1b[0m', "\nDiscord will begin logging in");
            this.client.login(this.BOT_TOKEN)
        } else {
            console.log('\x1b[36m%s\x1b[0m', "\nUnable to find file to read token from, discord will not login.");
        }
        return null;
    };
}
