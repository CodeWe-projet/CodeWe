from flask import Flask, render_template, redirect, abort
from flask_socketio import SocketIO, emit, join_room
from api.data import DEBUG
from api import api
from db import db
import sys
import json

app = Flask(__name__, template_folder='templates')
app.register_blueprint(api, url_prefix='/api')
socketio = SocketIO(app)


@app.route('/')
def home():
    return render_template("index.html")


@app.route("/create_document", methods=['POST'])
def create_document():
    doc_id = db.create_document()
    return redirect(f"/editor/{doc_id}")


@app.route('/<doc_id>')
@app.route('/editor/<doc_id>')
def editor(doc_id):
    content = db.get_document(doc_id)
    content['content'] = json.loads(content['content']) 
    if doc_id is not None:
        return render_template('editor.html', document=content)
    return abort(404)


@socketio.on("join")
def on_join(data):
    room = data['room']
    join_room(room)


@socketio.on('update text')
def update_text(data):
    emit('text updated', data, room=data['room'], include_self=False)


@socketio.on('save')
def update_text(data):
    db.update_document(data['room'], json.dumps(data['requests'][0]['data']))


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


if __name__ == '__main__':
    socketio.run(app, *sys.argv[1:], debug=DEBUG)
