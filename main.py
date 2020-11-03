import uuid
import db
from flask import Flask, render_template, request, jsonify, redirect

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to CodeWe!"

@app.route('/document/<document_id>')
def document(document_id):
    return f"Document{document_id}"

@app.route('/create_document')
def create_document():
    doc_id = uuid.uuid4()
    db.create_document(doc_id)
    return jsonify({"message": "document created"})

@app.route('/upload', methods=['POST'])
def upload():
    doc_id, doc_content = request.form['document_id'], request.form['doc_content']
    db.update_document(doc_id, doc_content)
    return jsonify({"message":"file_uploaded"})


@app.route('/download', methods=['POST'])
def download():
    doc_id = request.form['doc_id']
    content = db.get_document(doc_id)
    return jsonify({"content": content})

app.run(debug=True)