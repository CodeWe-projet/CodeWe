from flask import Flask, render_template, jsonify
from api.api import api
from db import db
from api.data import DEBUG

app = Flask(__name__, template_folder='templates')
app.register_blueprint(api, url_prefix='/api')


@app.route('/')
def home():
    return render_template("index.html")


@app.route('/<doc_id>')
@app.route('/editor/<doc_id>')
def editor(doc_id):
    doc = db.get_document(doc_id)
    return render_template('editor.html', document=doc)


app.run(debug=DEBUG)
