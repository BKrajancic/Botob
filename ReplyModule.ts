import {Module}  from "./Module";
import {Service} from "./Service";
import {Message} from "./Message";
import { MessageAndReply } from './MessageAndReply';

/**
 * A simple module which gives specific responses to specific phrases
 */
export class ReplyModule implements Module {
    /**
     * The mapping of input messages to responses
     */
    responses: MessageAndReply[] = [];

    constructor () {
        this.responses.push(new MessageAndReply(/[y]+e[e]+[h]+[a]+[w]+/gi,"🤠"));
        this.responses.push(new MessageAndReply(/go[o]+d[\s|-]+night bo/gi,"goodnight 🌃"));
        this.responses.push(new MessageAndReply(/go[o]+d[\s|-]+morning bo/gi,"goodmorning 🌞"));
        //this.responses.push(new MessageAndReply(/(hey|hello|yo|wassup)\sbo/gi,"hi!")); Needs tuning
        this.responses.push(new MessageAndReply(/y(\s)*e(\s)*e(\s)*(e|\s)*(\s)*t/gi,"YEEEET"));
    }
    /**
     * Does nothing
     */
    onTick(): void {};
    /**
     * Finds if the message given matches any stored key, 
     * and if so replies with the response stored
     * 
     * @param msg 
     * @param service 
     */
    onMessage(msg: Message, service: Service): Message[] {
        let out: Message[] = [];    
        for (let response of this.responses) {
            if (response.checkReply(msg.messageData)){
                out.push(msg.source.makeReply(msg.destination, response.getReply()));
            }
        }
        return out;
    }
}
