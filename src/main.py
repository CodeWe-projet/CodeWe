from flask import Flask, render_template, redirect, abort, send_file
from flask_socketio import SocketIO, emit, join_room
from document import Document
from config import DEBUG
from api import api
from db import db
import sys
import json

app = Flask(__name__, template_folder="templates")
app.register_blueprint(api, url_prefix="/api")
socketio = SocketIO(app)


@app.route("/")
@app.route("/index.html")
def home():
    """Render home page."""
    return render_template("index.html")


@app.route("/create_document", methods=["POST"])
def create_document():
    """Create a new document/code file."""
    doc_id = db.create_document()
    return redirect(f"/{doc_id}")


@app.route("/tos-pdf")
def pdf_tos():
    """Reroute to ToS PDF."""
    return send_file("templates/legal/tos-pdf.pdf")


@app.route("/<doc_id>")
@app.route("/editor/<doc_id>")
def editor(doc_id):
    """Enter editor with document id.

    :pre:
        doc_id: str, 5 char - in database
    """
    try:
        content = db.get_document(doc_id)
        content["content"] = json.loads(content["content"])
        if doc_id is not None:
            return render_template("editor.html", document=content)
    except Exception as error:
        if DEBUG:
            print(error)
    return abort(404)


@app.route("/tos")
@app.route("/tac")
@app.route("/termsofservice")
@app.route("/terms-of-service")
def tos():
    """Render terms of service."""
    return render_template("legal/tos.html")


@app.route("/tos/archive/<doc_id>")
@app.route("/tac/archive/<doc_id>")
@app.route("/termsofservice/archive/<doc_id>")
@app.route("/terms-of-service/archive/<doc_id>")
def tos_archive(doc_id):
    """Render terms of service form archive."""
    return render_template(f"legal/archive/tos-{doc_id}.html")


@app.route("/privacy")
@app.route("/privacypolicy")
@app.route("/privacy-policy")
def privacy():
    """Render privacy policy."""
    return render_template("legal/privacy.html")


@app.route("/licence")
def licence():
    """Render Project licence."""
    return render_template("legal/licence.html")


@socketio.on("join")
def on_join(data):
    room = data["room"]
    join_room(room)


@socketio.on("update text")
def update_text(data):
    emit("text updated", data, room=data["room"], include_self=False)
    document_content = json.loads(db.get_document(data["room"])["content"])
    document = Document(document_content)
    document.apply_requests(data["requests"])
    db.update_document(data["room"], json.dumps(document.document_dict))


@socketio.on("save")
def update_text(data):
    db.update_document(data["room"], json.dumps(data["requests"][0]["data"]))


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    socketio.run(app, *sys.argv[1:], debug=DEBUG)
