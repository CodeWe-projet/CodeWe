export class Socket{
    constructor(doc_id, interval=1000) {
        this.doc_id = doc_id;
        this.socket = io();
        this.join();
        this.stack = {'update text': []};

        this.socket.on("text updated", data => {
            for(const request of data['requests']){
                const room = data['room'];
                const event = new CustomEvent('socket.receive.' + request['type'], { detail: {request, room}});
                document.dispatchEvent(event);
            }
        });

        document.addEventListener('socket.send', e => {
            this.stack['update text'].push(e.detail.request);
        })

        setInterval(() => {
            if(this.stack['update text'].length){
                this.send('update text', this.stack['update text'].splice(0, this.stack['update text'].length));
            }
        }, interval);

    }

    send(name, requests) {
        this.socket.emit(name, {
            room: this.doc_id,
            requests: requests
        });
    }

    join() {
        this.send("join", {room: this.doc_id})
    }
}