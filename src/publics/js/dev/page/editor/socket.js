import Config from "/js/dev/config.js";
import Debug from "/js/dev/utils/debugging/debug.js";
import Socket from "/js/dev/utils/websocket/socket.js";

const UPDATE_EVENT = 'update';

export default class EditorSocket{
    constructor(doc_id, interval=1000) {
        this.doc_id = doc_id;

        this.ws = new Socket({
            secure: false,
            port: window.location.port,
            hostname: window.location.host,
        });

        this.stack = {UPDATE_EVENT: []};
        this.preprocess = [];

        this.ws.ws.onopen =() => {
            this.join();

            setInterval(() => {
                for(const func of this.preprocess){
                    func[0](...func[1]);
                }
                if(this.stack.UPDATE_EVENT.length){
                    this.send(UPDATE_EVENT, this.stack.UPDATE_EVENT.splice(0, this.stack.UPDATE_EVENT.length));
                }
            }, interval);
        };

        document.addEventListener('socket.send', e => {
            if(e.detail.hasOwnProperty('request')) this.stack.UPDATE_EVENT.push(e.detail.request);
            if(e.detail.hasOwnProperty('requests')) this.stack.UPDATE_EVENT.push(...e.detail.requests);
        })

        document.addEventListener('socket.send_now', e => {
            this.send(e.detail.name, e.detail.requests);
        });

        document.addEventListener('socket.preprocess', e => {
            const name = e.detail[0];
            let args = e.detail[1];
            if(name === undefined) return;
            if(args === undefined) args = [];
            const tab = [name, args];
            if(!this.preprocess.includes(tab)){
                this.preprocess.push(tab);
                Debug.debug('New socket.preprocess', tab);
            }
        });

    }

    send(name, data={}) {
        this.ws.send({
            event: name,
            room: this.doc_id,
            data: data
        });
    }

    join() {
        this.send("join");
    }
}
