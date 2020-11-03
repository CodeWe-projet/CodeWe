from flask import Flask, render_template, redirect, abort
from api.api import api
from db import db
from api.data import DEBUG

app = Flask(__name__, template_folder='templates')
app.register_blueprint(api, url_prefix='/api')


@app.route('/')
def home():
    return render_template("index.html")


@app.route("/create_document", methods=['POST'])
def create_document():
    try:
        doc_id = db.create_document()
        return redirect(f"/editor/{doc_id}")
    except Exception:
        return abort(500)


@app.route('/<doc_id>')
@app.route('/editor/<doc_id>')
def editor(doc_id):
    try:
        doc_id = db.get_document(doc_id)
        if doc_id is not None:
            return render_template('editor.html', document=doc_id)
        return abort(404)
    except Exception:
        return abort(500)


app.run(debug=DEBUG)
