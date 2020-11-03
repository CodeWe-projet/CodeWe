from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to CodeWe!"

@app.route('/document/<document_id>')
def document(document_id):
    return f"Document{document_id}"

@app.route('/upload', methods=['POST'])
def upload():
    doc_id = request.form['document_id']
    doc_content = request.form['doc_content']
    # TODO write in db
    # FIXME change the json
    return {"message":"file_uploaded"}

@app.route('/download', methods=['POST'])
def download():
    doc_id = request.form['doc_id']
    return {"content": "File Content"}

app.run(debug=True)