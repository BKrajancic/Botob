
import {Service} from "./Service";
import {Module} from "./Module";
import {ConsoleService} from "./ConsoleService";
import {CopyCatModule} from "./CopyCatModule";
import {Message} from "./Message";
import { ReplyModule } from "./ReplyModule";
import { FBService } from "./FBService";
import { ConsoleInputHandler } from './ConsoleInputHandler';
import { DiscordService } from "./DiscordService";
import { WebsiteService } from './WebsiteService';

/**
 * Composed of modules and services to manage communication both ways
 */
export class Bot {
    
    /**  Manages the console input */
    input: ConsoleInputHandler = new ConsoleInputHandler();
    /**The services which are currently running*/
    services: Service[] =[];
    /** The modules which will receive all messages for processing*/
    modules: Module[] = [];
    /** The timer for the message retrieval loop */
    messagesTimer;
    /** The timer for the module tick loop */
    moduleTickTimer;

    constructor() {
        this.services = [];
        this.modules = [];

        this.services.push(new ConsoleService(this.input));
        this.services.push(new DiscordService(this.input));
        //this.services.push(new WebsiteService());
        //this.services.push(new FBService(this.input)); //Gets banned rapidly, not worthwhile
        //this.modules.push (new CopyCatModule(/* Give config*/));
        this.modules.push(new ReplyModule());

        for (let service of this.services){
            this.input.push(service.login());
        }
        this.input.outputLabel();
        
    }

    /**
     * Sends a set of messages to each service
     * @param msgsToSend The message to send
     */
    sendMessages(msgsToSend: Message[]) : void {
        for (let msg of msgsToSend){
            for (let service of this.services) {
                if (msg.destination.service === service.constructor.toString()){
                    service.sendMessage(msg);
                }
            }
        }
    }

    /**
     * Initialises the looping functions of this class
     */
    initialise(): void {
        this.messagesTimer   = setInterval(()=> {this.checkMessages()}, 2000); 
        this.moduleTickTimer = setInterval(()=> {this.tickModules()}, 500); 
    }

    /**
     * Executes the tick function for each module
     */
    tickModules(): void {
        for (let item of this.modules){
            item.onTick();
        }
    }

    /**
     * Retrieves all messages from all services, distributes them to each module, 
     * then posts the module's reply to all services.
     * @TODO: Consider removing responsibilities of this module
     */
    checkMessages(): void {
        for (let service of this.services){
            let messages: Message[] = service.msgs.slice();
            service.msgs = [];
            for (let msg of messages){
                for (let item of this.modules) {
                    this.sendMessages(item.onMessage(msg,service));
                }
            }
        }
    }
}
