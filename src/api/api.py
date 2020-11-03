from flask import Blueprint, request, jsonify, abort
import db.db as db

api = Blueprint("api", __name__)

@api.route('/download', methods=['POST'])
def download():
    try:
        doc_id = request.form['doc_id']
        content = db.get_document(doc_id)
        return jsonify({"success": (content is not None), "content": content})
    except Exception:
        return jsonify({"success": False})

@api.route('/create_document', methods=['POST'])
def create_document():
    try:
        doc_id = db.create_document()
        return jsonify({"succes": True, "doc_id": doc_id})
    except Exception as e:
        return jsonify({"success": False}) # , 'details': str(e)

@api.route('/upload', methods=['POST'])
def upload():
    try:
        doc_id, doc_content = request.form['doc_id'], request.form['doc_content']
        db.update_document(doc_id, doc_content)
        return jsonify({"succes":True, "uploaded":True})
    except Exception:
        return jsonify({"success":False})
