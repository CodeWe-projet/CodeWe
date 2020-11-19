/**
 * This module deals with websockets.
 * @author Brieuc Dubois
 * @date Created on 16/11/2020
 * @date Last modification on 16/11/2020
 * @version 1.0.0
 */
import temporaryCardAlert from "/js/dev/component/text-alert.js";
import Debug from "/js/dev/utils/debugging/debug.js";
import EventManager from "/js/dev/utils/events.js";
import Random from "/js/dev/utils/random.js";
import Stack, {WaitingStack} from "/js/dev/utils/stack.js";

export default class Socket{
    constructor(options) {
        if(!window.WebSocket){
            Debug.critical('Browser doesn\t support websockets');
            return;
        }

        this.options = options || {};

        Debug.debug('Websocket connection to', this.uri());
        this.ws = new WebSocket(this.uri().href);

        this.ws.onmessage = this.onMessage;

        /**
         * WaitingStack for sockets ; Check if connected is still alive
         */
        this.waitingStack = new WaitingStack(120);
        document.addEventListener('socket.confirm', evt => {this.confirm(evt.detail);})

        setInterval(() => {
            const amount = this.waitingStack.getSize();
            if(amount > 20){
                temporaryCardAlert('Connexion', 'It seems than you are disconnected', 2000, '#ff501e')
            }else if(amount > 5){
                temporaryCardAlert('Connexion', 'It seems than you are disconnected', 2000, '#ff9000')
            }
        }, 1000);

        /**
         * Ping-pong alive event
         */
        document.addEventListener('socket.receive.ping', e => {
            this.send(JSON.stringify({
                event: 'pong',
                time: Date.now(),
            }))
        })


    }

    /**
     * Build URI for websocket
     * @return {URL}
     */
    uri(){ // 4587
        const url = new URL('ws://localhost')

        url.protocol = this.options.secure ? 'wss' : 'ws';
        url.port = this.port(url.protocol.endsWith(':') ? url.protocol.slice(0, -1) : url.protocol);
        url.hostname = this.options.hostname || window.location.origin;
        url.pathname = this.options.pathname !== undefined ? '/' + this.options.pathname || '' : '';

        if(this.options.params){
            for(const [key, value] of  Object.entries(this.options.params)){
                url.searchParams.set(key, value);
            }
        }

        return url;
    }

    /**
     * Return URI port based on options and protocol
     * @param {string} protocol
     * @return {string}
     */
    port(protocol){
        if(this.options.port
            && (protocol === 'wss' && Number(this.options.port) !== 443
                || protocol === 'ws' && Number(this.options.port) !== 80)){
            return this.options.port;
        }else{
            return '';
        }
    }

    /**
     * Send JSON content with websocket
     * @param {{}} content
     */
    send(content){
        if(content.event !== 'join'){
            const uuid = Random.string(9);

            this.waitingStack.add(uuid, content);

            Debug.debug(`SEND ${uuid} to '${content.event}': `, content);

            content['uuid'] = uuid;
        }

        this.ws.send(JSON.stringify(content));
    }

    /**
     * Called when a new message is received from server
     * @param {MessageEvent} e
     */
    onMessage(e){
        try{
            const data = JSON.parse(e.data);
            Debug.debug('RECEIVE PACKET', data);
            if(data.event && data.data) {
                EventManager.triggerCustom(`socket.receive.${data.event}`, data.data);
            }else if(data.code && data.uuid && data.time){
                EventManager.triggerCustom(`socket.confirm`, data);
            } else {
                Debug.error('This packet hasn\'t valid event and data.', data);
            }
        }catch (error){
            Debug.debug(error);
            Debug.error('This packet can\'t be parsed as JSON.', e);
        }
    }

    /**
     * When a confirm message is received
     * @param {{}} data
     */
    confirm(data){
        const code = data.code;
        const uuid = data.uuid;
        const time = data.time;

        if(code !== 'OK'){
            Debug.warn(`${uuid} come back with a non OK code.`)
        }

        this.waitingStack.archive(uuid, time);
    }
}
