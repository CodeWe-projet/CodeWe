/**
 * This module deals with websockets.
 * @author Brieuc Dubois
 * @date Created on 16/11/2020
 * @date Last modification on 16/11/2020
 * @version 1.0.0
 */
import Debug from "/js/dev/utils/debugging/debug.js";
import EventManager from "/js/dev/utils/events.js";

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
            if(data.event && data.data) EventManager.triggerCustom(`socket.receive.${data.event}`, data.data);
            else {
                Debug.error('This packet hasn\'t valid event and data.', data);
            }
        }catch (error){
            Debug.error('This packet can\'t be parsed as JSON.', e);
        }
    }
}
